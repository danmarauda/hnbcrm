import { Contact2, Target, MessageSquare, ArrowRightLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface WizardStep3SampleDataProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isGenerating: boolean;
  generatingStep: string;
}

const SAMPLE_DATA_ITEMS = [
  {
    icon: Contact2,
    label: "8 contacts com perfis completos",
  },
  {
    icon: Target,
    label: "6 leads in different pipeline stages",
  },
  {
    icon: MessageSquare,
    label: "3 simulated multichannel conversations",
  },
  {
    icon: ArrowRightLeft,
    label: "1 pending AI-to-human handoff",
  },
];

export function WizardStep3SampleData({
  enabled,
  onToggle,
  isGenerating,
  generatingStep,
}: WizardStep3SampleDataProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text-primary">Sample Data</h2>
        <p className="text-text-secondary">
          Explore the CRM with realistic auto-generated data
        </p>
      </div>

      {/* Toggle Card */}
      <Card
        className={cn(
          "transition-all duration-200",
          enabled && "border-brand-500 shadow-md shadow-brand-500/10",
          isGenerating && "animate-pulse"
        )}
      >
        <div className="space-y-4">
          {/* Toggle Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Toggle Switch */}
            <button
              onClick={() => !isGenerating && onToggle(!enabled)}
              disabled={isGenerating}
              className={cn(
                "relative w-12 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-base",
                enabled ? "bg-brand-500" : "bg-surface-overlay border border-border",
                isGenerating && "cursor-not-allowed opacity-50"
              )}
              aria-label="Toggle sample data"
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200",
                  enabled ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>

            {/* Label */}
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text-primary">
                Generate sample data
              </h3>
            </div>
          </div>

          {/* Preview List (when enabled) */}
          {enabled && !isGenerating && (
            <div className="space-y-2 pt-2 border-t border-border animate-fade-in-up">
              {SAMPLE_DATA_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon size={16} className="text-brand-500 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Generating Progress */}
          {isGenerating && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-sm text-text-primary font-medium">
                  {generatingStep}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-surface-overlay rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {/* Disabled Message */}
          {!enabled && !isGenerating && (
            <p className="text-sm text-text-muted pt-2 border-t border-border">
              You can add data manually later
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
