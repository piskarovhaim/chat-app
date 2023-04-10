import React, { InputHTMLAttributes } from "react";
import "./style.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, type = "text", ...args }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`input ${className} ${error ? "error" : ""}`}
        {...args}
      />
    );
  }
);

export default Input;
