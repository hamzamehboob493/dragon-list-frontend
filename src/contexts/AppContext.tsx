"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { AppContextType, AppProviderProps, CurrentUser } from "@/lib/types/context/types";
import { refreshAccessToken } from "@/lib/actions/authActions";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      const userData: CurrentUser = {
        id: session.user.id,
        name: session.user.name ?? "Unknown User",
        email: session.user.email ?? "",
        image: session.user.image,
        username: session.user.username,
        accessToken: session.user.accessToken,
        refreshToken: session.user.refreshToken,
      };

      console.log('userData===========>userData', userData)
      setCurrentUser(userData);
    } else {
      setCurrentUser(null);
    }

    setIsLoading(false);
  }, [session, status]);

  const updateUser = (userData: Partial<CurrentUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const clearUser = () => {
    setCurrentUser(null);
  };

  const value: AppContextType = {
    currentUser,
    isLoading: status === "loading" || isLoading,
    isAuthenticated: !!currentUser,
    updateUser,
    clearUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppContext };
