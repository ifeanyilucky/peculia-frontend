"use client";

import { HelpArticle, HelpCategory } from "@/types/help.types";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  User,
  Share2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface ArticleLayoutProps {
  article: HelpArticle;
  category: HelpCategory;
  children: React.ReactNode;
}

export const ArticleLayout = ({
  article,
  category,
  children,
}: ArticleLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Breadcrumbs */}
      <nav className="border-b border-border bg-card">
        <div className="container flex h-14 items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link href="/help" className="hover:text-primary transition-colors">
            Help Center
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link
            href={`/help/${article.audience}`}
            className="capitalize hover:text-primary transition-colors"
          >
            {article.audience}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link
            href={`/help/${article.audience}/${category.slug}`}
            className="hover:text-primary transition-colors"
          >
            {category.title}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="font-medium text-foreground truncate">
            {article.title}
          </span>
        </div>
      </nav>

      <div className="container py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <article className="max-w-3xl">
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: {article.lastUpdated}</span>
                </div>
              </div>
            </header>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </div>

            <footer className="mt-16 border-t border-border pt-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">
                    Was this article helpful?
                  </h4>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 rounded-full border border-border px-6 py-2 transition-all hover:bg-primary/10 hover:border-primary text-sm font-medium">
                      <ThumbsUp className="h-4 w-4" />
                      Yes
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-border px-6 py-2 transition-all hover:bg-destructive/10 hover:border-destructive text-sm font-medium">
                      <ThumbsDown className="h-4 w-4" />
                      No
                    </button>
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded-full border border-border px-6 py-2 transition-all hover:bg-accent text-sm font-medium">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </button>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-12">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  In this article
                </h4>
                <nav className="flex flex-col gap-3 text-sm border-l border-border pl-4">
                  {/* TOC would be dynamic here */}
                  <a href="#" className="text-primary font-medium">
                    Overview
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Key Steps
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Troubleshooting
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Next Steps
                  </a>
                </nav>
              </div>

              <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
                <h4 className="mb-2 font-bold text-xl">Still need help?</h4>
                <p className="mb-6 opacity-90 text-sm">
                  Our team is here to help you get the best experience on
                  Glamyad.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-primary transition-transform hover:scale-105"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
