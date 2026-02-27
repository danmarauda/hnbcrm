import {
  Building2,
  ShoppingCart,
  Cloud,
  Wrench,
  GraduationCap,
  HeartPulse,
  Landmark,
  MoreHorizontal,
  TrendingUp,
  Contact2,
  Bot,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  INDUSTRY_TEMPLATES,
  COMPANY_SIZES,
  MAIN_GOALS,
} from "@/lib/onboardingTemplates";

interface WizardStep1WelcomeProps {
  industry: string;
  companySize: string;
  mainGoal: string;
  currency: string;
  timezone: string;
  onIndustryChange: (industry: string) => void;
  onCompanySizeChange: (size: string) => void;
  onMainGoalChange: (goal: string) => void;
  onCurrencyChange: (c: string) => void;
  onTimezoneChange: (tz: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  ShoppingCart,
  Cloud,
  Wrench,
  GraduationCap,
  HeartPulse,
  Landmark,
  MoreHorizontal,
  TrendingUp,
  Contact2,
  Bot,
  Sparkles,
};

const CURRENCIES = [
  { key: "BRL", flag: "🇧🇷", symbol: "$", label: "Real", sublabel: "Brasileiro" },
  { key: "USD", flag: "🇺🇸", symbol: "$", label: "Dollar", sublabel: "US" },
  { key: "EUR", flag: "🇪🇺", symbol: "€", label: "Euro", sublabel: "" },
];

const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "America/Sao Paulo (GMT-3)" },
  { value: "America/Manaus", label: "America/Manaus (GMT-4)" },
  { value: "America/Fortaleza", label: "America/Fortaleza (GMT-3)" },
  { value: "America/New_York", label: "America/New York (GMT-5)" },
  { value: "America/Chicago", label: "America/Chicago (GMT-6)" },
  { value: "America/Denver", label: "America/Denver (GMT-7)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (GMT-8)" },
  { value: "Europe/Paris", label: "Europa/Paris (GMT+1)" },
  { value: "Europe/London", label: "Europa/Londres (GMT+0)" },
  { value: "Europe/Berlin", label: "Europa/Berlim (GMT+1)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
  { value: "UTC", label: "UTC (GMT+0)" },
];

export function WizardStep1Welcome({
  industry,
  companySize,
  mainGoal,
  currency,
  timezone,
  onIndustryChange,
  onCompanySizeChange,
  onMainGoalChange,
  onCurrencyChange,
  onTimezoneChange,
}: WizardStep1WelcomeProps) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
          Let's personalize your CRM
        </h2>
        <p className="text-text-secondary">
          Answer a few questions to set everything up automatically
        </p>
      </div>

      {/* Section 1: Industry */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">
          What is your business industry?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INDUSTRY_TEMPLATES.map((template) => {
            const Icon = ICON_MAP[template.icon];
            const isSelected = industry === template.key;

            return (
              <Card
                key={template.key}
                variant="interactive"
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-all duration-150",
                  isSelected &&
                    "border-brand-500 bg-brand-500/10 shadow-md shadow-brand-500/10"
                )}
                onClick={() => onIndustryChange(template.key)}
              >
                {Icon && (
                  <Icon
                    size={24}
                    className={cn(
                      "transition-colors duration-150",
                      isSelected ? "text-brand-500" : "text-text-secondary"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-xs md:text-sm font-medium text-center transition-colors duration-150",
                    isSelected ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {template.label}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 2: Company Size */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">
          Team size
        </label>
        <div className="flex flex-wrap gap-2">
          {COMPANY_SIZES.map((size) => {
            const isSelected = companySize === size.key;

            return (
              <button
                key={size.key}
                onClick={() => onCompanySizeChange(size.key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-base",
                  isSelected &&
                    "bg-brand-500 text-white shadow-md shadow-brand-500/20",
                  !isSelected &&
                    "bg-surface-overlay text-text-secondary hover:bg-surface-raised hover:text-text-primary border border-border"
                )}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Main Goal */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">
          What is your main goal?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MAIN_GOALS.map((goal) => {
            const Icon = ICON_MAP[goal.icon];
            const isSelected = mainGoal === goal.key;

            return (
              <Card
                key={goal.key}
                variant="interactive"
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-all duration-150",
                  isSelected &&
                    "border-brand-500 bg-brand-500/10 shadow-md shadow-brand-500/10"
                )}
                onClick={() => onMainGoalChange(goal.key)}
              >
                {Icon && (
                  <Icon
                    size={24}
                    className={cn(
                      "transition-colors duration-150",
                      isSelected ? "text-brand-500" : "text-text-secondary"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-sm font-medium text-center transition-colors duration-150",
                    isSelected ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {goal.label}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 4: Currency */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">
          Moeda principal
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CURRENCIES.map((c) => {
            const isSelected = currency === c.key;

            return (
              <Card
                key={c.key}
                variant="interactive"
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 p-4 cursor-pointer transition-all duration-150",
                  isSelected &&
                    "border-brand-500 bg-brand-500/10 shadow-md shadow-brand-500/10"
                )}
                onClick={() => onCurrencyChange(c.key)}
              >
                <span className="text-2xl leading-none">{c.flag}</span>
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors duration-150",
                    isSelected ? "text-brand-500" : "text-text-primary"
                  )}
                >
                  {c.symbol} {c.label}
                </span>
                {c.sublabel && (
                  <span className="text-xs text-text-secondary text-center">
                    {c.sublabel}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 5: Timezone */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary">
          Time Zone
        </label>
        <select
          value={timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm",
            "bg-surface-raised border border-border text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
            "transition-colors duration-150"
          )}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
