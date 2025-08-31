import { useState, useEffect } from "react";
import { Sparkles, Heart, Clock, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ImageComparison } from "@/components/ImageComparison";
import heroImage from "@/assets/hero-transformation.jpg";
import beforeImage from "@/assets/before-bw.jpg";
import afterImage from "@/assets/after-color.jpg";

type AppState = 'upload' | 'processing' | 'complete';
type ProcessingStage = 'analyzing' | 'colorizing' | 'enhancing' | 'complete';

const App = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('analyzing');
  const [progress, setProgress] = useState(0);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [colorizedImage, setColorizedImage] = useState<string>('');

  // Auth protection
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFileSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setAppState('processing');
    simulateProcessing();
  };

  const simulateProcessing = () => {
    // Simulate processing stages
    const stages: ProcessingStage[] = ['analyzing', 'colorizing', 'enhancing', 'complete'];
    let currentStageIndex = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      
      if (currentProgress >= 100) {
        currentStageIndex++;
        if (currentStageIndex < stages.length) {
          setProcessingStage(stages[currentStageIndex]);
          currentProgress = 0;
        } else {
          clearInterval(interval);
          // For demo, use the hero image as colorized result
          setColorizedImage(heroImage);
          setAppState('complete');
          return;
        }
      }
      
      setProgress(Math.min(currentProgress, 100));
    }, 500);
  };

  const handleNewPhoto = () => {
    setAppState('upload');
    setProcessingStage('analyzing');
    setProgress(0);
    setOriginalImage('');
    setColorizedImage('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-sunset flex flex-col">
      <div className="container mx-auto px-4 py-6 sm:py-8 flex-1 flex flex-col">
        {/* Header */}
        <header className="text-center mb-16 sm:mb-20">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1"></div>
            <div className="inline-flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                <span className="text-orange-600">Ran</span><span className="text-orange-600">g</span>Mantra
              </h1>
            </div>
            <div className="flex-1 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
          <p className="text-base sm:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed px-4">
            Transform your cherished black & white memories into vibrant colored moments
          </p>
        </header>

        <main className="flex-1 flex items-center justify-center">
          {appState === 'upload' && (
            <div className="w-full max-w-2xl px-4">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          )}

          {appState === 'processing' && (
            <div className="space-y-6 sm:space-y-8">
              <ProcessingStatus stage={processingStage} progress={progress} />
              
              {originalImage && (
                <Card className="overflow-hidden shadow-warm">
                  <img 
                    src={originalImage} 
                    alt="Your uploaded photo"
                    className="w-full h-64 sm:h-auto object-cover sm:max-h-96"
                  />
                </Card>
              )}
            </div>
          )}

          {appState === 'complete' && originalImage && colorizedImage && (
            <ImageComparison
              originalImage={originalImage}
              colorizedImage={colorizedImage}
              onNewPhoto={handleNewPhoto}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center pt-6 sm:pt-8 border-t border-border/50 mt-auto">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;