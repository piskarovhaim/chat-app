import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import "./style.css";

export interface ButtonProps {
  className?: string;
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  className = "",
  disabled = false,
  children,
  type,
  loading,
  onClick = () => {},
}) => {
  const _renderLoading = () => {
    return "loading...";
  };

  return (
    <button
      disabled={disabled || loading}
      className={`button ${className}`}
      onClick={onClick}
      type={type}
    >
      {loading ? _renderLoading() : children}
    </button>
  );
};

export default Button;
