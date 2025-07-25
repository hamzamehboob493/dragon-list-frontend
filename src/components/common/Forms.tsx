"use client";

import { FormsProps } from "@/lib/types/common/types";
import React from "react";

const Forms: React.FC<FormsProps> = ({ children, onSubmit, customClass = "" }) => {
  return (
    <form onSubmit={onSubmit} className={`w-full ${customClass}`}>
      {children}
    </form>
  );
};

export default Forms;
