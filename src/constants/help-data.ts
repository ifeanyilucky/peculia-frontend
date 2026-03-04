import { HelpCategory, HelpArticle } from "@/types/help.types";

export const HELP_CATEGORIES: HelpCategory[] = [
  // Customer Categories
  {
    id: "c1",
    slug: "booking",
    title: "Booking Appointments",
    description:
      "Learn how to find, book, and manage your beauty appointments.",
    icon: "Calendar",
    audience: "customers",
  },
  {
    id: "c2",
    slug: "payments",
    title: "Payments & Deposits",
    description:
      "Everything you need to know about deposits, refunds, and payment security.",
    icon: "CreditCard",
    audience: "customers",
  },
  {
    id: "c3",
    slug: "account",
    title: "Account & Profile",
    description:
      "Manage your personal information, passwords, and account preferences.",
    icon: "User",
    audience: "customers",
  },
  {
    id: "c4",
    slug: "reviews",
    title: "Reviews & Ratings",
    description: "How to share your experiences and what our ratings mean.",
    icon: "Star",
    audience: "customers",
  },
  {
    id: "c5",
    slug: "safety",
    title: "Safety & Trust",
    description: "How we keep our community safe and verified.",
    icon: "ShieldCheck",
    audience: "customers",
  },

  // Professional Categories
  {
    id: "p1",
    slug: "getting-started",
    title: "Getting Started",
    description:
      "Set up your professional profile and start accepting bookings.",
    icon: "Rocket",
    audience: "professionals",
  },
  {
    id: "p2",
    slug: "bookings",
    title: "Managing Bookings",
    description:
      "Tools to manage your calendar, clients, and appointments efficiently.",
    icon: "CalendarClock",
    audience: "professionals",
  },
  {
    id: "p3",
    slug: "payments",
    title: "Deposits & Payments",
    description: "Manage your earnings, payouts, and transaction settings.",
    icon: "Wallet",
    audience: "professionals",
  },
  {
    id: "p4",
    slug: "business-tools",
    title: "Business Tools",
    description:
      "Unlock growth with analytics, marketing, and client management tools.",
    icon: "BarChart3",
    audience: "professionals",
  },
  {
    id: "p5",
    slug: "policies",
    title: "Policies & Compliance",
    description:
      "Setting your terms and staying compliant with platform standards.",
    icon: "FileText",
    audience: "professionals",
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  // --- CUSTOMER ARTICLES ---
  // Booking
  {
    id: "ca1",
    slug: "how-to-book",
    title: "How to book an appointment",
    content: "Booking on Glamyad is simple...",
    categoryId: "c1",
    audience: "customers",
    lastUpdated: "2024-03-01",
    helpfulCount: 150,
    notHelpfulCount: 2,
  },
  {
    id: "ca2",
    slug: "how-to-reschedule",
    title: "How to reschedule",
    content: "Need to change your time? No problem...",
    categoryId: "c1",
    audience: "customers",
    lastUpdated: "2024-03-01",
    helpfulCount: 85,
    notHelpfulCount: 5,
  },
  {
    id: "ca-miss",
    slug: "missed-appointment",
    title: "What happens if I miss my appointment?",
    content: "No-shows affect our professionals deeply...",
    categoryId: "c1",
    audience: "customers",
    lastUpdated: "2024-03-01",
    helpfulCount: 45,
    notHelpfulCount: 0,
  },
  // Payments
  {
    id: "ca3",
    slug: "why-deposits",
    title: "Why do I need to pay a deposit?",
    content: "Deposits help ensure professionals can manage their time...",
    categoryId: "c2",
    audience: "customers",
    lastUpdated: "2024-03-01",
    helpfulCount: 210,
    notHelpfulCount: 12,
  },
  {
    id: "ca-refund",
    slug: "refund-policy",
    title: "Refund policy explained",
    content: "Our refund policy is designed to be fair...",
    categoryId: "c2",
    audience: "customers",
    lastUpdated: "2024-03-01",
    helpfulCount: 180,
    notHelpfulCount: 8,
  },

  // --- PROFESSIONAL ARTICLES ---
  // Getting Started
  {
    id: "pa1",
    slug: "create-professional-account",
    title: "Creating your professional account",
    content: "Join thousands of experts on Glamyad...",
    categoryId: "p1",
    audience: "professionals",
    lastUpdated: "2024-03-01",
    helpfulCount: 320,
    notHelpfulCount: 1,
  },
  {
    id: "pa-services",
    slug: "adding-services",
    title: "Adding services to your profile",
    content: "Display your skills effectively...",
    categoryId: "p1",
    audience: "professionals",
    lastUpdated: "2024-03-01",
    helpfulCount: 95,
    notHelpfulCount: 2,
  },
  // Managing Bookings
  {
    id: "pa2",
    slug: "accepting-bookings",
    title: "Accepting bookings",
    content: "Manage your incoming requests with ease...",
    categoryId: "p2",
    audience: "professionals",
    lastUpdated: "2024-03-01",
    helpfulCount: 145,
    notHelpfulCount: 3,
  },
  {
    id: "pa-no-show",
    slug: "no-show-management",
    title: "No-show management",
    content: "Protect your business from cancellations...",
    categoryId: "p2",
    audience: "professionals",
    lastUpdated: "2024-03-01",
    helpfulCount: 210,
    notHelpfulCount: 0,
  },
  // Deposits & Payments
  {
    id: "pa-deposit-settings",
    slug: "setting-deposit-percentage",
    title: "Setting deposit percentage",
    content: "Control your upfront earnings...",
    categoryId: "p3",
    audience: "professionals",
    lastUpdated: "2024-03-01",
    helpfulCount: 165,
    notHelpfulCount: 4,
  },
];
