import React, { TextareaHTMLAttributes } from "react";
import "./style.css";

export interface InputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className = "", error, ...args }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`input ${className} ${error ? "error" : ""}`}
        {...args}
      />
    );
  }
);

export default Textarea;
