import express from "express";
import { createServer, Server } from "http";
import { Socket, socket } from "./socket";

export class ChatServer {
  public static readonly PORT: number = 5000;
  private _app: express.Application;
  private server: Server;
  private port: string | number;
  private _socket: Socket;

  constructor(router: express.Router) {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this.server = createServer(this._app);
    this._socket = socket.attach(this.server);
    this.listen();
    this._app.use("/api", router);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }

  get app(): express.Application {
    return this._app;
  }

  get socket(): Socket {
    return this._socket;
  }
}
