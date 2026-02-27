import { ChevronUp, ChevronDown, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { STAGE_COLORS } from "@/lib/onboardingTemplates";

interface StageConfig {
  name: string;
  color: string;
  isClosedWon?: boolean;
  isClosedLost?: boolean;
}

interface WizardStep2PipelineProps {
  boardName: string;
  stages: StageConfig[];
  onBoardNameChange: (name: string) => void;
  onStagesChange: (stages: StageConfig[]) => void;
}

export function WizardStep2Pipeline({
  boardName,
  stages,
  onBoardNameChange,
  onStagesChange,
}: WizardStep2PipelineProps) {
  const handleColorCycle = (index: number) => {
    const currentColorIndex = STAGE_COLORS.indexOf(stages[index].color);
    const nextColorIndex = (currentColorIndex + 1) % STAGE_COLORS.length;
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], color: STAGE_COLORS[nextColorIndex] };
    onStagesChange(newStages);
  };

  const handleNameChange = (index: number, name: string) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], name };
    onStagesChange(newStages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStages = [...stages];
    [newStages[index - 1], newStages[index]] = [
      newStages[index],
      newStages[index - 1],
    ];
    onStagesChange(newStages);
  };

  const handleMoveDown = (index: number) => {
    if (index === stages.length - 1) return;
    const newStages = [...stages];
    [newStages[index], newStages[index + 1]] = [
      newStages[index + 1],
      newStages[index],
    ];
    onStagesChange(newStages);
  };

  const handleDelete = (index: number) => {
    if (stages.length <= 3) return;
    const newStages = stages.filter((_, i) => i !== index);
    onStagesChange(newStages);
  };

  const handleAddStage = () => {
    // Insert before the first closed stage (Won/Lost), or append to end if none exist
    const firstClosedIndex = stages.findIndex(
      (s) => s.isClosedWon || s.isClosedLost
    );
    const insertIndex = firstClosedIndex === -1 ? stages.length : firstClosedIndex;
    const newStages = [...stages];
    newStages.splice(insertIndex, 0, {
      name: "New Stage",
      color: STAGE_COLORS[stages.length % STAGE_COLORS.length],
    });
    onStagesChange(newStages);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text-primary">
          Customize your Pipeline
        </h2>
        <p className="text-text-secondary">
          Adjust the stages of your sales funnel
        </p>
      </div>

      {/* Board Name */}
      <div>
        <Input
          label="Pipeline Name"
          value={boardName}
          onChange={(e) => onBoardNameChange(e.target.value)}
          placeholder="e.g.: Sales Pipeline"
        />
      </div>

      {/* Stages List */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-text-primary">
          Stages
        </label>
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-surface-raised border border-border rounded-lg hover:border-border-strong transition-colors"
            >
              {/* Color Dot */}
              <button
                onClick={() => handleColorCycle(index)}
                className="w-5 h-5 rounded-full flex-shrink-0 transition-all hover:ring-2 hover:ring-brand-500/20 focus:outline-none focus:ring-2 focus:ring-brand-500"
                style={{ backgroundColor: stage.color }}
                aria-label="Change color"
              />

              {/* Name Input */}
              <input
                type="text"
                value={stage.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary border-b border-border-strong focus:border-brand-500 focus:outline-none transition-colors px-1 py-0.5"
                placeholder="Stage name"
              />

              {/* Badges */}
              {stage.isClosedWon && <Badge variant="success">Won</Badge>}
              {stage.isClosedLost && <Badge variant="error">Lost</Badge>}

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    "p-1 rounded hover:bg-surface-overlay transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                    index === 0 && "opacity-30 cursor-not-allowed"
                  )}
                  aria-label="Move up"
                >
                  <ChevronUp size={16} className="text-text-secondary" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === stages.length - 1}
                  className={cn(
                    "p-1 rounded hover:bg-surface-overlay transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                    index === stages.length - 1 && "opacity-30 cursor-not-allowed"
                  )}
                  aria-label="Move down"
                >
                  <ChevronDown size={16} className="text-text-secondary" />
                </button>
                {stages.length > 3 && (
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 rounded hover:bg-semantic-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-semantic-error"
                    aria-label="Delete"
                  >
                    <X size={16} className="text-semantic-error" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Stage Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddStage}
          className="w-full"
        >
          <Plus size={16} />
          Add Stage
        </Button>
      </div>

      {/* Mini Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-text-primary">
          Preview
        </label>
        <div className="flex flex-wrap gap-2">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1 min-w-[60px]">
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-xs text-text-secondary text-center truncate w-full px-1">
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
