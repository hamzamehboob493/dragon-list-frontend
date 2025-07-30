import { ReactNode } from "react";	

export interface CurrentUser {	
  id: string;	
  name: string;	
  email: string;	
  image?: string;	
  username?: string;	
  accessToken?: string;	
  refreshToken?: string;	
}	

export interface AppContextType {	
  currentUser: CurrentUser | null;	
  isLoading: boolean;	
  isAuthenticated: boolean;	
  updateUser: (userData: Partial<CurrentUser>) => void;	
  clearUser: () => void;	
}	

export interface AppProviderProps {	
  children: ReactNode;	
}	

export type Theme = "light" | "dark";	

export interface ThemeContextType {	
  theme: Theme;	
  toggleTheme: () => void;	
}
