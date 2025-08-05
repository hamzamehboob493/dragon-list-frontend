export const routes = {
  ui: {
    root: "/",
    signIn: "/auth/sign-in",
    dashboard: {
      index: "/dashboard",
      teams: "/dashboard/teams",
      chatbot: "/dashboard/chatbot",
      settings: "/dashboard/settings",
      profile: "/dashboard/profile",
      users: "/dashboard/users",
      meetings: "/dashboard/meetings",
    },
  },
  api: {
    auth: {
      logIn: "/auth/email/login",
      refreshAuthTokens: "/auth/refresh",
    },
    teams: {
      index: "/teams",
    },
    users: {
      index: "/users",
    },
    meetings: {
      index: "/meetings",
    },
    chatbot: {
      index: "/chatbot"
    }
  },
};
