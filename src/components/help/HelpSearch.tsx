"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { helpService } from "@/services/help.service";
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
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await helpService.searchArticles(query, audience);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
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
        {(query || isLoading) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl z-50">
          {results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((article) => (
                <Link
                  key={article._id}
                  href={`/help/${article.audience}/${article.categoryId.slug || "article"}/${article.slug}`}
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
            !isLoading && (
              <div className="p-8 text-center text-muted-foreground">
                No articles found matching "{query}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
