import { Download, Eye, EyeOff, RefreshCw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageComparisonProps {
  originalImage: string;
  colorizedImage: string;
  onNewPhoto: () => void;
}

export const ImageComparison = ({ originalImage, colorizedImage, onNewPhoto }: ImageComparisonProps) => {
  const [showComparison, setShowComparison] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();

  const handleDownload = async () => {
    try {
      const a = document.createElement('a');
      a.href = colorizedImage;
      a.download = `rangmantra-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.canShare) {
      try {
        const resp = await fetch(colorizedImage);
        const blob = await resp.blob();
        const file = new File([blob], 'rangmantra-memory.jpg', { type: blob.type });
        await navigator.share({
          title: 'RangMantra',
          text: 'Checkout what RangMantra did to my memory 😍 - Try it too!',
          url: 'https://rangmantra.indrasol.com',
          files: [file],
        });
      } catch (e) {
        console.error('Share failed:', e);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-transparent border-none shadow-none p-0">
        <div className="relative">
          {showComparison ? (
            <div className="space-y-2 sm:space-y-1">
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="w-full sm:w-1/2 space-y-1 sm:space-y-1">
                  <div className="text-center sm:pl-4 md:pl-8 lg:pl-16 xl:pl-28">
                    <span className="bg-black/80 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg inline-block">
                      Original
                    </span>
                  </div>
                  <div className="relative group cursor-pointer touch-manipulation">
                    <img 
                      src={originalImage} 
                      alt="Original black and white photo"
                      className={cn(
                        "w-full object-contain transition-transform duration-300 group-hover:scale-105 group-active:scale-95",
                        isMobile 
                          ? "h-[200px] rounded-lg" 
                          : "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-right rounded-l-lg sm:rounded-l-lg"
                      )}
                    />
                    <div className={cn(
                      "absolute inset-0 bg-black/0 group-hover:bg-black/10 group-active:bg-black/20 transition-colors duration-300",
                      isMobile ? "rounded-lg" : "rounded-l-lg"
                    )} />
                  </div>
                </div>
                <div className="w-full sm:w-1/2 space-y-1 sm:space-y-1">
                  <div className="text-center sm:pr-4 md:pr-8 lg:pr-16 xl:pr-28">
                    <span className="bg-gradient-warm text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-glow inline-block">
                      Colorized
                    </span>
                  </div>
                  <div className="relative group cursor-pointer touch-manipulation">
                    <img 
                      src={colorizedImage} 
                      alt="Colorized photo"
                      className={cn(
                        "w-full object-contain transition-transform duration-300 group-hover:scale-105 group-active:scale-95",
                        isMobile 
                          ? "h-[200px] rounded-lg" 
                          : "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-left rounded-r-lg sm:rounded-r-lg"
                      )}
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-warm/0 group-hover:bg-gradient-warm/10 group-active:bg-gradient-warm/20 transition-all duration-300",
                      isMobile ? "rounded-lg" : "rounded-r-lg"
                    )} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <div className="text-center">
                <span className="bg-gradient-warm text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-glow inline-block">
                  Your Revived Memory
                </span>
              </div>
              <div className="relative group cursor-pointer touch-manipulation">
                <img 
                  src={colorizedImage} 
                  alt="Colorized photo"
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                />
                <div className="absolute inset-0 bg-gradient-warm/0 group-hover:bg-gradient-warm/10 group-active:bg-gradient-warm/20 transition-all duration-300 rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-3 sm:p-4 md:p-6 mb-6 sm:mb-8 md:mb-12">
        <div className="flex flex-col gap-3 sm:gap-4 items-center text-center md:text-left md:flex-row md:justify-between">
          <div className="w-full md:w-auto">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">
              Memory Successfully Revived!
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Your black & white photo now bursts with life and color
            </p>
          </div>
          
          {/* Mobile: Full width buttons, Tablet+: Inline buttons */}
          <div className={cn(
            "flex gap-2 sm:gap-3 w-full md:w-auto",
            isMobile 
              ? "flex-col" 
              : "flex-row flex-wrap justify-center md:justify-end"
          )}>
            <Button
              variant="outline"
              size={isMobile ? "default" : "sm"}
              onClick={() => setShowComparison(!showComparison)}
              className="transition-all duration-300 hover:shadow-warm/50 active:scale-95 text-xs sm:text-sm w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              {showComparison ? (
                <>
                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Hide Comparison</span>
                  <span className="sm:hidden">Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Show Comparison</span>
                  <span className="sm:hidden">Show</span>
                </>
              )}
            </Button>
            
            <Button
              variant="glow"
              size={isMobile ? "default" : "sm"}
              onClick={handleShare}
              className="transition-all duration-300 active:scale-95 text-xs sm:text-sm w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Share
            </Button>
            
            <Button
              variant="hero"
              size={isMobile ? "default" : "sm"}
              onClick={handleDownload}
              disabled={isDownloading}
              className="transition-all duration-300 active:scale-95 text-xs sm:text-sm w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Downloading...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Separator className="my-3 sm:my-4" />
        
        <div className="text-center">
          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={onNewPhoto}
            className="transition-all duration-300 hover:shadow-warm/50 active:scale-95 w-full sm:w-auto min-w-[200px] min-h-[44px] touch-manipulation"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Revive Another Memory
          </Button>
        </div>
      </Card>
    </div>
  );
};