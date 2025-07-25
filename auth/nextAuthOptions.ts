import { NextAuthOptions } from "next-auth";
import { envVars } from "@/config";
import { refreshAccessToken, signIn } from "../src/lib/actions/authActions";
import CredentialsProvider from "next-auth/providers/credentials";

if (!envVars.nextAuthSecret) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await signIn(credentials);

          if (!response?.data) return null;

          const { token, refreshToken, tokenExpires, user } = response.data;

          if (user?.id) {
            return {
              id: String(user.id),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role?.name,
              accessToken: token,
              refreshToken,
              tokenExpires,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: envVars.nextAuthSecret,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.tokenExpires = user.tokenExpires;
        return token;
      }

      // Token expiration check with 5-minute buffer
      const currentTime = Date.now();
      const bufferTime = 300_000;

      if (token.tokenExpires && currentTime >= token.tokenExpires - bufferTime) {
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.tokenExpires = token.tokenExpires;
      }
      return session;
    },
  },
};
