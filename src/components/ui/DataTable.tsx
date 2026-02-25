"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface ColumnDef<T> {
  header: ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectedIds?: Set<string>;
  onToggleSelectRow?: (item: T) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  selectedIds,
  onToggleSelectRow,
  onToggleSelectAll,
  isAllSelected,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
      <table className="w-full text-left text-sm whitespace-nowrap text-slate-600">
        <thead>
          <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px] bg-slate-50/50">
            {onToggleSelectAll && (
              <th className="py-3 px-4 w-12 rounded-tl-2xl">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="w-5 h-5 rounded border-slate-300 bg-white text-rose-600 focus:ring-1 focus:ring-rose-500/50 cursor-pointer accent-rose-600"
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "py-3 px-4",
                  col.className,
                  idx === columns.length - 1 && !onToggleSelectAll
                    ? "rounded-tr-2xl"
                    : "",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onToggleSelectAll ? 1 : 0)}
                className="py-12 px-6 text-center text-slate-400 font-medium"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "hover:bg-slate-50/80 transition-colors group",
                  onRowClick && "cursor-pointer",
                )}
              >
                {onToggleSelectRow && selectedIds && (
                  <td
                    className="py-3 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelectRow(item);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => onToggleSelectRow(item)}
                      className="w-5 h-5 rounded border-slate-300 bg-white text-rose-600 focus:ring-1 focus:ring-rose-500/50 cursor-pointer accent-rose-600"
                    />
                  </td>
                )}
                {columns.map((col, idx) => (
                  <td key={idx} className={cn("py-3 px-4", col.className)}>
                    {col.cell
                      ? col.cell(item)
                      : String(item[col.accessorKey as keyof T] || "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
