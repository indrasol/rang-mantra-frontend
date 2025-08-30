import { useState } from "react";
import { Download, Share2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  originalImage: string;
  colorizedImage: string;
  onNewPhoto: () => void;
}

export const ImageComparison = ({ originalImage, colorizedImage, onNewPhoto }: ImageComparisonProps) => {
  const [showComparison, setShowComparison] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(colorizedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `chromarevive-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(colorizedImage);
        const blob = await response.blob();
        const file = new File([blob], 'chromarevive-memory.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'My Colorized Memory - ChromaRevive',
          text: 'Check out how ChromaRevive brought my old photo back to life!',
          files: [file]
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-warm">
        <div className="relative">
          {showComparison ? (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative group">
                <img 
                  src={originalImage} 
                  alt="Original black and white photo"
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Original
                  </span>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src={colorizedImage} 
                  alt="Colorized photo"
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-warm/0 group-hover:bg-gradient-warm/10 transition-all duration-300" />
                <div className="absolute bottom-4 right-4">
                  <span className="bg-gradient-warm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-glow">
                    Colorized
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={colorizedImage} 
                alt="Colorized photo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-warm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-glow">
                  Your Revived Memory
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800">
              Memory Successfully Revived!
            </h3>
            <p className="text-muted-foreground text-sm">
              Your black & white photo now bursts with life and color
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="transition-all duration-300 hover:shadow-warm/50"
            >
              {showComparison ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Comparison
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Comparison
                </>
              )}
            </Button>
            
            <Button
              variant="glow"
              size="sm"
              onClick={handleShare}
              className="transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="hero"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="transition-all duration-300"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onNewPhoto}
            className="transition-all duration-300 hover:shadow-warm/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Revive Another Memory
          </Button>
        </div>
      </Card>
    </div>
  );
};