import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../types";

const URL: string = "http://localhost:5000";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: true,
});

export default function useSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return {
    isConnected,
    socket,
  };
}
