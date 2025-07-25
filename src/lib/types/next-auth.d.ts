import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      accessToken?: string;
      refreshToken?: string;
      role: string;
      tokenExpires: number;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
    role: string;
    tokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
    role: string;
    tokenExpires: number;
  }
}
