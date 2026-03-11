export const ROUTES = {
  public: {
    home: "/",
    explore: "/explore",
    providerDetail: (id: string) => `/providers/${id}`,
    forBusiness: "/for-business",
  },
  auth: {
    login: "/login",
    registerClient: "/register/client",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },
  client: {
    dashboard: "/dashboard",
    bookings: "/bookings",
    bookingDetail: (_id: string) => "/bookings",
    book: (providerId: string) => `/book/${providerId}`,
    payments: "/payments",
    saved: "/saved",
    notifications: "/notifications",
    profile: "/profile",
  },
  partnersPortal: "https://partners.glamyad.com",
} as const;
