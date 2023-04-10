import React, { FC } from "react";
import Messages from "./messages";
import SendMessage from "./sendMessage";
import "../../style/chat.css";

export interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  return (
    <div className="chat-container">
      <Messages />
      <SendMessage />
    </div>
  );
};

export default Chat;
