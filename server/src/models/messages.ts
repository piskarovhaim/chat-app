import mongoose, { Schema } from "mongoose";
import { ChatMessage } from "../types";

const MessageSchema = new Schema<ChatMessage>({
  name: { type: String, required: true, maxlength: 40 },
  message: { type: String, required: true, maxlength: 260 },
  timestamp: { type: Date, required: true },
});

const Message = mongoose.model<ChatMessage>("message", MessageSchema);
export default Message;
