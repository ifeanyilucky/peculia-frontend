export const ROUTES = {
  public: {
    home: "/",
    explore: "/explore",
    forBusiness: "/for-business",
    providerDetail: (id: string) => `/providers/${id}`,
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
    bookingDetail: (id: string) => `/bookings/${id}`,
    book: (providerId: string) => `/book/${providerId}`,
    payments: "/payments",
    saved: "/saved",
    notifications: "/notifications",
    profile: "/profile",
  },
  admin: {
    dashboard: "/dashboard",
    users: "/users",
    userDetail: (id: string) => `/users/${id}`,
    bookings: "/bookings",
    payments: "/payments",
    reviews: "/reviews",
    providers: "/providers",
  },
} as const;
