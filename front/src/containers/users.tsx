import React, { FC, useEffect, useState, useCallback } from "react";
import axios from "axios";
import useSocket from "../hooks/useSocket";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { ChatUser, ApiError } from "../types";
import "../style/users.css";

export interface UsersProps {}

const Users: FC<UsersProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const [users, setUsers] = useState<ChatUser[]>([]);

  const { socket } = useSocket();

  const fetchOnlineUsers = useCallback(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get<ChatUser[]>("/api/users")
      .then(({ data }) => setUsers(data))
      .catch((err) => setError({ message: err.response.statusText }))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffectOnce(() => {
    fetchOnlineUsers();
  });

  useEffect(() => {
    function userListUpdated(_users: ChatUser[]) {
      setUsers(_users);
      setError(null);
    }

    socket.on("userListUpdated", userListUpdated);

    return () => {
      socket.off("userListUpdated", userListUpdated);
    };
  }, [socket]);

  return (
    <div className="users-container">
      <div className="users-list-container">
        <div className="users-list-title">Online Users</div>
        {error && <span className="error-fetchUsers">{error.message}</span>}
        {isLoading ? (
          <span className="users-list-loading">loading users...</span>
        ) : (
          users.map(({ name }) => {
            return (
              <div className="user-list-name" key={`user-list-${name}`}>
                {name}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Users;
