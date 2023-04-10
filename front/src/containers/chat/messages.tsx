import React, { FC, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import useSocket from "../../hooks/useSocket";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import { ChatMessage, ApiError } from "../../types";
import Button from "../../shared/Button/Button";
import "../../style/messages.css";

export interface MessagesProps {}
export interface MessagesResponse {
  page: number;
  limit: number;
  count: number;
  docs: ChatMessage[];
}

export interface Paginate {
  page: number;
  limit: number;
  count: number;
}

const Messages: FC<MessagesProps> = () => {
  //fetch helpers
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginate, setPaginate] = useState<Paginate | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  // messages array
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // to scroll down
  const bottomRef = useRef<HTMLInputElement | null>(null);

  const { socket } = useSocket();

  const fetchMessages = useCallback(
    (_page: number = 1, scrollToBttom: boolean = true) => {
      setIsLoading(true);
      setError(null);
      axios
        .get<MessagesResponse>(`/api/messages?page=${_page}`)
        .then(({ data }) => {
          const { page, limit, count } = data;
          setPaginate({ page, limit, count });
          setMessages((prev) => [...data.docs].reverse().concat(prev));
          if (scrollToBttom)
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 200);
        })
        .catch((err) => setError({ message: err.response.data.message }))
        .finally(() => {
          setIsLoading(false);
        });
    },
    []
  );

  useEffectOnce(() => {
    fetchMessages();
  });

  // messageReceived lisener event
  useEffect(() => {
    function newMessageReceived(message: ChatMessage) {
      setMessages((prev) => prev.concat(message));
      setTimeout(() => {
        bottomRef.current?.scrollIntoView();
      }, 100);
    }

    socket.on("messageReceived", newMessageReceived);

    return () => {
      socket.off("messageReceived", newMessageReceived);
    };
  }, [socket]);

  return (
    <div className="messages-container">
      <div className="messages-list-container">
        {/* {'Error message'} */}
        {error && <span className="error-fetchMessages">{error.message}</span>}

        {/* {'Loading'} */}
        {isLoading && (
          <span className="messages-list-loading">loading messages...</span>
        )}

        {/* {'Load older messages'} */}
        {!isLoading &&
          paginate &&
          paginate.page * paginate.limit < paginate.count && (
            <Button onClick={() => fetchMessages(paginate.page + 1, false)}>
              Load older messages
            </Button>
          )}

        {/* {'messages list'} */}
        {messages.map(({ message, timestamp, name }, i) => {
          return (
            <div
              className="message-container"
              key={`message-list-${name}-${i}`}
            >
              <div className="message-container-title">
                {name} -{" "}
                {new Date(timestamp).toLocaleString("en-GB", {
                  timeZone: "UTC",
                })}
              </div>
              {message}
            </div>
          );
        })}

        {/* {'ref to scroll to'} */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Messages;
