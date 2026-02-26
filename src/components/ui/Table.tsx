import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  variant?: "default" | "glass";
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  onRowClick,
  variant = "default",
  className,
}: TableProps<T>) {
  const getRowKey = (item: T, index: number) => {
    if (rowKey) return rowKey(item, index);
    return (item.id as string) ?? index.toString();
  };

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full">
        <thead>
          <tr className={cn("border-b border-border", variant === "glass" ? "glass" : "bg-surface-raised")}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={getRowKey(item, index)}
              onClick={() => onRowClick?.(item, index)}
              className={cn(
                "border-b border-border last:border-b-0 transition-colors",
                onRowClick && "cursor-pointer",
                variant === "glass"
                  ? "hover:bg-white/[0.02]"
                  : "hover:bg-surface-overlay"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 text-sm text-text-primary", col.className)}>
                  {col.render ? col.render(item, index) : (item[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-text-muted">No data</div>
      )}
    </div>
  );
}
