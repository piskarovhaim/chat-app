import DB from "./db";
import { ChatServer } from "./server";
import router from "./routes";

DB.connect();

const server = new ChatServer(router);

const app = server.app;
const socket = server.socket;

export { app, socket };
