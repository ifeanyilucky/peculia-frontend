"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { HELP_ARTICLES } from "@/constants/help-data";
import Link from "next/link";
import { Audience } from "@/types/help.types";

interface HelpSearchProps {
  audience?: Audience;
  placeholder?: string;
}

export const HelpSearch = ({
  audience,
  placeholder = "Search help articles...",
}: HelpSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return HELP_ARTICLES.filter((article) => {
      const matchesQuery =
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase());

      const matchesAudience = audience ? article.audience === audience : true;

      return matchesQuery && matchesAudience;
    }).slice(0, 5);
  }, [query, audience]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-border bg-card py-4 pl-12 pr-12 text-lg shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl z-50">
          {results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.audience}/${article.categoryId}/${article.slug}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-foreground">
                    {article.title}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No articles found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
