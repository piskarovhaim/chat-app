import socketIO from "socket.io";
import { ChatEvent, CHAT_ROOM } from "./constants";
import { ChatMessage, ChatUser } from "./types";
import { Server } from "http";
import MessageModel from "./models/messages";

export interface ServerToClientEvents {
  userListUpdated: (u: ChatUser[]) => void;
  messageReceived: (m: ChatMessage) => void;
}

export interface ClientToServerEvents {
  newUser: (
    u: ChatUser,
    callback: (e: string | null, a: string | null) => void
  ) => void;
  newMessage: (
    message: string,
    callback: (e: string | null, a: string | null) => void
  ) => void;
}

interface InterServerEvents {}

interface SocketData {
  name: string;
}

export class Socket {
  private io: socketIO.Server;

  constructor() {
    this.io = new socketIO.Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >();
    this.listen();
  }

  public attach(server: Server): Socket {
    this.io.attach(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return this;
  }

  public async getOnlineUsers(): Promise<ChatUser[]> {
    const sockets = await this.io.in(CHAT_ROOM).fetchSockets();
    return sockets.map(({ data }) => ({ name: data.name }));
  }
  private listen(): void {
    this.io.on(ChatEvent.CONNECT, (socket: any) => {
      // user join to chat group event
      socket.on(
        ChatEvent.NEW_USER,
        async (
          user: ChatUser,
          cd: (e: string | null, a: ChatUser[] | null) => void
        ) => {
          const users = await this.getOnlineUsers();
          if (users.find(({ name }) => name === user.name)) {
            cd("Name already exists, please choose another.", null);
          } else {
            socket.join(CHAT_ROOM);
            socket.data.name = user.name;
            users.push({ name: user.name });
            this.io.emit(ChatEvent.USER_LIST_UPDATED, users); // update the user list
            cd(null, users);
          }
        }
      );

      // new message on the chat group
      socket.on(
        ChatEvent.NEW_MESSAGE,
        async (m: string, cd: (e: string | null) => void) => {
          try {
            const message = await MessageModel.create({
              message: m,
              name: socket.data.name,
              timestamp: Date.now(),
            });
            this.io.emit(ChatEvent.MESSAGE_RECEIVED, message);
            cd(null); // send message successed
          } catch (err) {
            console.error(err);
            cd("Error on send message,please try again.");
          }
        }
      );

      // user disconected
      socket.on(ChatEvent.DISCONNECT, async () => {
        const users = await this.getOnlineUsers();
        this.io.emit(ChatEvent.USER_LIST_UPDATED, users); // update the user list
      });
    });
  }
}

const socket = new Socket();

export { socket };
