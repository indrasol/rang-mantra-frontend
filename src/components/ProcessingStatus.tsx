import { Loader2, Sparkles, Palette, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  stage: 'analyzing' | 'colorizing' | 'enhancing' | 'complete';
  progress: number;
}

const stages = {
  analyzing: {
    icon: ImageIcon,
    title: "Analyzing Your Memory",
    description: "Understanding the composition and details..."
  },
  colorizing: {
    icon: Palette,
    title: "Adding Life & Color",
    description: "Bringing your moment back to life..."
  },
  enhancing: {
    icon: Sparkles,
    title: "Enhancing Details",
    description: "Adding final touches and refinements..."
  },
  complete: {
    icon: Sparkles,
    title: "Memory Revived!",
    description: "Your colorized photo is ready."
  }
};

export const ProcessingStatus = ({ stage, progress }: ProcessingStatusProps) => {
  const currentStage = stages[stage];
  const Icon = currentStage.icon;
  
  return (
    <Card className="p-8 text-center space-y-6 bg-gradient-nostalgic/5 border-primary/20">
      <div className="mx-auto w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow animate-pulse">
        {stage === 'complete' ? (
          <Icon className="w-10 h-10 text-primary-foreground" />
        ) : (
          <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold bg-gradient-warm bg-clip-text text-transparent">
          {currentStage.title}
        </h3>
        <p className="text-muted-foreground">
          {currentStage.description}
        </p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{progress}% complete</p>
      </div>
    </Card>
  );
};