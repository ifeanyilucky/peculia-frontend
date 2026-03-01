export type Audience = "customers" | "professionals" | "partners";

export interface HelpCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or image path
  audience: Audience;
}

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  categoryId: string;
  audience: Audience;
  lastUpdated: string;
  helpfulCount: number;
  notHelpfulCount: number;
  relatedArticles?: string[]; // Array of article IDs
}

export interface HelpSearchQuery {
  term: string;
  audience?: Audience;
  categoryId?: string;
}
