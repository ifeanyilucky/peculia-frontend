"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  limit?: number;
  currentCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  limit,
  currentCount,
}: PaginationProps) {
  if (totalPages <= 1 && totalResults === undefined) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 w-full">
      <div className="text-sm font-medium text-slate-500">
        {totalResults !== undefined &&
        currentCount !== undefined &&
        limit !== undefined ? (
          totalResults === 0 ? (
            <span>0 results</span>
          ) : (
            <>
              Viewing{" "}
              <span className="text-slate-900 font-bold mx-1">
                {(currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, totalResults)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-bold mx-1">
                {totalResults}
              </span>{" "}
              results
            </>
          )
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .map((p, index, array) => (
                <React.Fragment key={p}>
                  {index > 0 && p - array[index - 1] > 1 && (
                    <span className="text-slate-400 px-2">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                      currentPage === p
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
