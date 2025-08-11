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
      whatsappMessages: "/dashboard/messages",
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
      processTranscript: "/meetings/process-transcript",
      parse: "/dragons-list/generate/meeting",
      lists: "/dragons-list/meeting",
    },
    jobs: {
      status: "/dragons-list/jobs",
      result: "/dragons-list/jobs",
    },
    chatbot: {
      index: "/chatbot",
    },
    whatsappMessages: {
      index: "whatsapp/messages/previous-day",
    },
  },
};
