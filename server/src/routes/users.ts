import express from "express";
import { socket } from "../socket";
import { ChatUser } from "../types";
const router = express.Router();

router.get("/", async (req, res) => {
  let users: ChatUser[] = [];
  try {
    users = await socket.getOnlineUsers();
  } catch (err) {
    console.log(err);
  }
  res.json(users);
});

export default router;
