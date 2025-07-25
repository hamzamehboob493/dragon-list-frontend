"use client";

import { ButtonProps } from "@/lib/types/common/types";
import React from "react";
import ButtonSpinner from "./ButtonSpinner";

const Button: React.FC<ButtonProps> = ({
  children,
  customClass = "",
  loading = false,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`
        px-4 py-2 
        bg-orange-500 
        text-white 
        rounded-md 
        hover:bg-orange-600 
        dark:bg-orange-600 
        dark:hover:bg-orange-700 
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        transition 
        ${customClass}
      `}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <ButtonSpinner /> : children}
    </button>
  );
};

export default Button;
