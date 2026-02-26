import { forwardRef, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, placeholder = "Select...", label, error, disabled, searchable, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.value === value);

    const filteredOptions = searchable
      ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : options;

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearch("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearch("");
    };

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>}

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
            "border bg-surface-raised",
            isOpen ? "border-white/20 ring-1 ring-white/10" : "border-border hover:border-white/10",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-semantic-error"
          )}
        >
          <span className={selectedOption ? "text-text-primary" : "text-text-muted"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown size={16} className={cn("text-text-muted transition-transform", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 glass glass-lg rounded-lg border border-glass-border overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-glass-border">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.02]">
                    <Search size={14} className="text-text-muted" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto glass-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-text-muted text-center">No options found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                        option.disabled
                          ? "text-text-muted cursor-not-allowed"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]",
                        value === option.value && "text-white bg-white/[0.03]"
                      )}
                    >
                      <span>{option.label}</span>
                      {value === option.value && <Check size={14} className="text-white" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="mt-1.5 text-xs text-semantic-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
