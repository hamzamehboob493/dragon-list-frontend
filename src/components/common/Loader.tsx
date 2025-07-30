"use client";

import { LoaderProps } from "@/lib/types/common/types";
import React from "react";

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = "white",
  customClass = "",
}) => {
  return (
    <div className={`flex justify-center items-center ${customClass}`}>
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
};

export default Loader;
