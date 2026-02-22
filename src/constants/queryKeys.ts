export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  users: {
    all: (filters?: any) => ["users", filters] as const,
    detail: (id: string) => ["users", id] as const,
  },
  providers: {
    list: (filters?: any) => ["providers", filters] as const,
    detail: (id: string) => ["providers", id] as const,
    services: (id: string) => ["providers", id, "services"] as const,
    availability: (id: string, date: string) =>
      ["providers", id, "availability", date] as const,
  },
  bookings: {
    client: (filters?: any) => ["bookings", "client", filters] as const,
    provider: (filters?: any) => ["bookings", "provider", filters] as const,
    detail: (id: string) => ["bookings", id] as const,
  },
  payments: {
    all: (filters?: any) => ["payments", filters] as const,
    detail: (id: string) => ["payments", id] as const,
  },
  reviews: {
    list: (filters?: any) => ["reviews", filters] as const,
    provider: (id: string) => ["reviews", "provider", id] as const,
  },
  notifications: {
    unread: () => ["notifications", "unread"] as const,
    all: (filters?: any) => ["notifications", filters] as const,
  },
} as const;
