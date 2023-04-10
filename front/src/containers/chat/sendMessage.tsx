import React, { FC, useState } from "react";
import Textarea from "../../shared/Input/textarea";
import Button from "../../shared/Button/Button";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import useSocket from "../../hooks/useSocket";
import "../../style/chat.css";

export interface MessageProps {}

type MessageFormValues = {
  message: string;
};

const resolver: Resolver<MessageFormValues> = async (values) => {
  return {
    values: values.message ? values : {},
    errors: !values.message
      ? {
          message: {
            type: "required",
          },
        }
      : {},
  };
};

const Chat: FC<MessageProps> = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({ resolver });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnected, socket } = useSocket();

  const onSubmit: SubmitHandler<MessageFormValues> = ({ message }) => {
    reset({ message: "" });
    if (!isConnected) {
      setError("message", {
        type: "custom",
        message: "Error on connections",
      });
      return;
    }
    setIsLoading(true);
    socket.emit("newMessage", message, (err) => {
      if (err) {
        setError("message", {
          type: "custom",
          message: err,
        });
      }
      setIsLoading(false);
    });
  };

  return (
    <form className="chat-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="chat-form-textarea">
        <Textarea
          rows={1}
          placeholder="Enter message"
          error={errors?.message ? true : false}
          {...register("message")}
        />
        {errors?.message && (
          <span className="error-sendMessage">{errors.message.message}</span>
        )}
      </div>
      <Button type="submit" loading={isLoading}>
        Send
      </Button>
    </form>
  );
};

export default Chat;
