
import { Camera, Heart, LogOut, Palette } from "lucide-react";
import { ColorizationAPI, EphemeralResponse } from "@/services/colorizationApi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { FloatingFeedback } from "@/components/FloatingFeedback";
import { ImageComparison } from "@/components/ImageComparison";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AppState = 'upload' | 'processing' | 'complete';
type ProcessingStage = 'analyzing' | 'colorizing' | 'enhancing' | 'complete';

// Using ColorizationAPI service for endpoints and polling

const App = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('analyzing');
  const [progress, setProgress] = useState(0);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [colorizedImage, setColorizedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);

  // Auth protection
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      // Show original image immediately
      const origUrl = URL.createObjectURL(file);
      setOriginalImage(origUrl);
      setAppState('processing');
      setProcessingStage('colorizing');
      setProgress(50);
      setProcessingStartTime(Date.now());

      // Call new in-memory colorization API
      const resp: EphemeralResponse = await ColorizationAPI.colorizeEphemeral(file);

      // Helper to convert base64 => Blob => object URL
      const b64ToUrl = (b64: string): string => {
        const byteStr = atob(b64);
        const len = byteStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = byteStr.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      };

      const colorUrl = b64ToUrl(resp.colorized_base64);
      setColorizedImage(colorUrl);
      setProcessingStage('complete');
      setProgress(100);
      setAppState('complete');
      setIsUploading(false);
      toast({
        title: 'Colorization Complete!',
        description: 'Your photo has been successfully colorized.',
      });
    } catch (error) {
      toast({
        title: 'Colorization Failed',
        description: error instanceof Error ? error.message : 'Failed to colorize image',
        variant: 'destructive',
      });
      setAppState('upload');
      setProcessingStartTime(null);
      setIsUploading(false);
    }
  };

  const handleNewPhoto = () => {
    setAppState('upload');
    setProcessingStage('analyzing');
    setProgress(0);
    setOriginalImage('');
    setColorizedImage('');
    setProcessingStartTime(null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
    } catch (e) {
      toast({
        title: "Logout failed",
        description: e instanceof Error ? e.message : 'Please try again',
        variant: 'destructive',
      });
    }
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
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <Camera className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                YaadonKe<span className="bg-gradient-to-r from-orange-800 via-red-700 to-red-800 bg-clip-text text-transparent">Rang</span>
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
            <div className="w-full max-w-2xl px-4 space-y-4">
              <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
              <p className="text-sm text-center font-semibold bg-gradient-to-r from-orange-800 via-red-700 to-red-800 bg-clip-text text-transparent">
                Perfect for your vintage wedding photos and family memories.
              </p>
            </div>
          )}

          {appState === 'processing' && (
            <div className="space-y-6 sm:space-y-8">
              <ProcessingStatus 
                stage={processingStage} 
                progress={progress} 
                processingTime={processingStartTime ? Math.floor((Date.now() - processingStartTime) / 1000) : undefined}
              />
              
              {originalImage && (
                <Card className="overflow-hidden bg-transparent border-none shadow-none p-0">
                  <img 
                    src={originalImage} 
                    alt="Your uploaded photo"
                    className="w-full max-h-96 object-contain"
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
          <p className="text-xs sm:text-sm text-muted-foreground px-4 font-semibold">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </footer>
      </div>

      {/* Floating Feedback Component */}
      {user && <FloatingFeedback userId={user.id} userEmail={user.email} />}
    </div>
  );
};

export default App;