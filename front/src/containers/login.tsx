import React, { FC, useState } from "react";
import Input from "../shared/Input/input";
import Button from "../shared/Button/Button";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import useSocket from "../hooks/useSocket";
import "../style/login.css";

export interface LoginProps {
  setIsConnectedToChat: (b: boolean) => void;
}

export type LoginFormValues = {
  name: string;
};

const resolver: Resolver<LoginFormValues> = async (values) => {
  return {
    values: values.name ? values : {},
    errors: !values.name
      ? {
          name: {
            type: "required",
            message: "Name is required.",
          },
        }
      : {},
  };
};

const Login: FC<LoginProps> = ({ setIsConnectedToChat }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnected, socket } = useSocket();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    if (!isConnected) {
      setError("name", {
        type: "custom",
        message: "Error on connections",
      });
      return;
    }

    setIsLoading(true);
    socket.emit("newUser", data, (err) => {
      if (err !== null) {
        setError("name", {
          type: "custom",
          message: err,
        });
      } else {
        setIsConnectedToChat(true);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="login-container">
      <h3>Join to Chat</h3>

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Enter Name"
          error={errors?.name ? true : false}
          {...register("name")}
        />
        {errors?.name && (
          <span className="error-login">{errors.name.message}</span>
        )}
        <Button type="submit" loading={isLoading}>
          Start Chating
        </Button>
      </form>
    </div>
  );
};

export default Login;
