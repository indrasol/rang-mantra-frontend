import { useState } from "react";
import { Sparkles, Heart, Clock, Palette, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ImageComparison } from "@/components/ImageComparison";
import heroImage from "@/assets/hero-transformation.jpg";
import beforeImage from "@/assets/before-bw.jpg";
import afterImage from "@/assets/after-color.jpg";

type AppState = 'upload' | 'processing' | 'complete';
type ProcessingStage = 'analyzing' | 'colorizing' | 'enhancing' | 'complete';

const Index = () => {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('upload');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('analyzing');
  const [progress, setProgress] = useState(0);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [colorizedImage, setColorizedImage] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-gradient-sunset">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1"></div>
            <div className="inline-flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                RangMantra
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="gap-2 transition-all duration-300 hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </div>
          </div>
          <p className="text-base sm:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed px-4">
            Transform your cherished black & white memories into vibrant colored moments
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {appState === 'upload' && (
            <div className="space-y-8 sm:space-y-12">
              <FileUpload onFileSelect={handleFileSelect} />
              
              {/* Hero Section */}
              <Card className="overflow-hidden shadow-warm bg-gradient-nostalgic/10 border-primary/20">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
                  <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-black">
                      Transform Your Memories
                    </h2>
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                      Transform your precious black & white wedding photos and family memories 
                      into beautiful colored moments. Perfect for bringing decades-old marriage 
                      photos back to life with stunning vibrancy.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-medium">Fast</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">Results in seconds</p>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto">
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-medium">Beautiful</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">Stunning results</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative order-1 lg:order-2">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center">
                        <img 
                          src={beforeImage} 
                          alt="Black and white wedding photo"
                          className="rounded-lg shadow-warm w-full h-32 sm:h-48 object-cover"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">Before</p>
                      </div>
                      <div className="text-center">
                        <img 
                          src={afterImage} 
                          alt="Colorized wedding photo"
                          className="rounded-lg shadow-warm w-full h-32 sm:h-48 object-cover"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">After</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
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
        <footer className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;