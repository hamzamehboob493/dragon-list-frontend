"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import FontAwesome from "./FontAwesome";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface SessionWrapperProps {
  children: ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <SessionProvider>
      <AppProvider>
        <ThemeProvider>
          <FontAwesome />
          {children}
        </ThemeProvider>
      </AppProvider>
    </SessionProvider>
  );
}
