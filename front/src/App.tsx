import React, { useState } from "react";
import Login from "./containers/login";
import Chat from "./containers/chat";
import Users from "./containers/users";
import "./style/App.css";

function App() {
  const [isConnectedToChat, setIsConnectedToChat] = useState<boolean>(false);

  return (
    <div className="App">
      <h2>Chat App</h2>
      <div className="main-container">
        {isConnectedToChat ? (
          <div className="main-chat-area-container">
            <Users />
            <Chat />
          </div>
        ) : (
          <Login setIsConnectedToChat={setIsConnectedToChat} />
        )}
      </div>
    </div>
  );
}

export default App;
