import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndexRowProps {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  year?: string;
  image?: string;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  className?: string;
}

export function IndexRow({
  id,
  title,
  subtitle,
  category,
  year,
  image,
  onSelect,
  onHover,
  className,
}: IndexRowProps) {
  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ x: 4 }}
      className={cn(
        "w-full flex items-center justify-between py-6 px-2 group cursor-pointer",
        "border-b border-glass-border transition-colors",
        "hover:bg-white/[0.02]",
        className
      )}
    >
      <div className="flex items-baseline gap-8 flex-1">
        {year && (
          <span className="text-[10px] tracking-[0.3em] text-text-muted group-hover:text-text-secondary transition-colors uppercase shrink-0">
            {year}
          </span>
        )}
        <div className="flex flex-col items-start">
          <h3 className="font-display text-xl sm:text-2xl text-text-secondary group-hover:text-white transition-all tracking-wide uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-text-muted mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {category && (
          <span className="hidden md:block text-[11px] tracking-[0.2em] text-text-muted group-hover:text-text-secondary uppercase">
            {category}
          </span>
        )}
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ArrowUpRight size={16} className="text-text-muted group-hover:text-white transition-colors" />
        </div>
      </div>
    </motion.button>
  );
}

// Index List Container
interface IndexListProps {
  children: React.ReactNode;
  className?: string;
}

export function IndexList({ children, className }: IndexListProps) {
  return (
    <div className={cn("border-t border-glass-border", className)}>
      {children}
    </div>
  );
}
