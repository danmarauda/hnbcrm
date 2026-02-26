import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export function Tabs({ tabs, value, onChange, variant = "pill", className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(tabs[0]?.id);
  const activeTab = value ?? internalValue;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    if (onChange) {
      onChange(tabId);
    } else {
      setInternalValue(tabId);
    }
  };

  if (variant === "underline") {
    return (
      <div className={cn("flex gap-6 border-b border-border", className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              disabled={tab.disabled}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                tab.disabled ? "text-text-muted cursor-not-allowed" : isActive ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-1 p-1 glass rounded-lg", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            disabled={tab.disabled}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
              tab.disabled ? "text-text-muted cursor-not-allowed" : isActive ? "text-black" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-white rounded-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
