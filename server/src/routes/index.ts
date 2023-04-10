import express from "express";
import usersRouter from "./users";
import messagesRouter from "./messages";
const router = express.Router();

router.use("/users", usersRouter);
router.use("/messages", messagesRouter);

export default router;
