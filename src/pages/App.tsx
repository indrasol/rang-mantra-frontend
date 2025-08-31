import { useState, useEffect, useCallback } from "react";
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

// Define the API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

interface ColorizeResponse {
  request_id: string;
  status: 'processing' | 'complete' | 'failed';
  original_url: string;
  colorized_url?: string;
  error_message?: string;
}

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
  const [requestId, setRequestId] = useState<string>('');
  const [statusCheckInterval, setStatusCheckInterval] = useState<number | null>(null);

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

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      
      // First set local preview of original image
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setAppState('processing');
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      if (!user?.id) {
        throw new Error('User ID not available');
      }
      
      formData.append('user_id', user.id);
      if (user.email) {
        formData.append('user_email', user.email);
      }
      
      // Get the JWT token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      // Send the image to our API
      const response = await fetch(`${API_URL}/colorize/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload image');
      }
      
      const data: ColorizeResponse = await response.json();
      
      // Start tracking the status
      setRequestId(data.request_id);
      setOriginalImage(data.original_url);
      
      // Set up status checking
      startStatusCheck(data.request_id);
      
      // Start the progress animation
      simulateProgressAnimation();
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      
      // Reset to upload state
      handleNewPhoto();
    } finally {
      setIsUploading(false);
    }
  };

  const simulateProgressAnimation = useCallback(() => {
    // Simulate progress animation for UX purposes
    // Real status comes from API checks
    const stages: ProcessingStage[] = ['analyzing', 'colorizing', 'enhancing', 'complete'];
    let currentStageIndex = 0;
    let currentProgress = 0;

    const interval = window.setInterval(() => {
      // Slower progression than before to match backend processing time
      currentProgress += Math.random() * 8 + 2;
      
      if (currentProgress >= 100) {
        currentStageIndex++;
        if (currentStageIndex < stages.length - 1) { // Don't automatically complete
          setProcessingStage(stages[currentStageIndex]);
          currentProgress = 0;
        } else {
          // Max out at enhancing at 99% until we get actual completion from API
          setProcessingStage('enhancing');
          setProgress(99);
          return;
        }
      }
      
      setProgress(Math.min(currentProgress, 99)); // Max 99% until real completion
    }, 800);
    
    return interval;
  }, []);
  
  const startStatusCheck = useCallback((requestId: string) => {
    // Clear any existing interval
    if (statusCheckInterval) {
      window.clearInterval(statusCheckInterval);
    }
    
    // Set up interval to check status every 2 seconds
    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/colorize/status/${requestId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to check status');
        }
        
        const data: ColorizeResponse = await response.json();
        
        // Update UI based on status
        if (data.status === 'complete' && data.colorized_url) {
          // Clear interval once complete
          window.clearInterval(interval);
          setStatusCheckInterval(null);
          
          // Set the colorized image and complete state
          setColorizedImage(data.colorized_url);
          setProcessingStage('complete');
          setProgress(100);
          setAppState('complete');
        } else if (data.status === 'failed') {
          // Handle failure
          window.clearInterval(interval);
          setStatusCheckInterval(null);
          
          toast({
            title: "Colorization failed",
            description: data.error_message || "Failed to colorize image",
            variant: "destructive",
          });
          
          // Reset to upload state
          handleNewPhoto();
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 2000); // Check every 2 seconds
    
    setStatusCheckInterval(interval);
    
    return interval;
  }, [toast, statusCheckInterval]);

  const handleNewPhoto = () => {
    // Clear any status check interval
    if (statusCheckInterval) {
      window.clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    
    setAppState('upload');
    setProcessingStage('analyzing');
    setProgress(0);
    setOriginalImage('');
    setColorizedImage('');
    setRequestId('');
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
                <span className="bg-gradient-to-r from-orange-800 via-red-700 to-red-800 bg-clip-text text-transparent">Rang</span>Mantra
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
          <p className="text-xs sm:text-sm text-muted-foreground px-4 font-semibold">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;