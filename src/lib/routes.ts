export const routes = {
  ui: {
    root: "/",
    signIn: "/auth/sign-in",
    dashboard: {
      index: "/dashboard",
      users: "/dashboard/users",
      analytics: "/dashboard/analytics",
      settings: "/dashboard/settings",
      profile: "/dashboard/profile",
    },
  },
  api: {
    auth: {
      logIn: "/auth/email/login",
      refreshAuthTokens: "/auth/refresh"
    },
  },
};
