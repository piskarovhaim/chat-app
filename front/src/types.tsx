export interface ChatUser {
  name: string;
}

export interface ChatMessage {
  name: string;
  message: string;
  timestamp: Date;
}

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

export interface ApiError {
  message: string;
}
