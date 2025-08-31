import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onFileSelect(imageFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Card 
      className={cn(
        "relative border-2 border-dashed transition-all duration-300 p-6 sm:p-12",
        isDragOver 
          ? "border-primary bg-gradient-nostalgic/10 shadow-warm scale-[1.02]" 
          : "border-border hover:border-primary/50 hover:shadow-warm/50",
        isProcessing && "pointer-events-none opacity-75"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
          <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-primary-foreground" />
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-warm bg-clip-text text-transparent">
            Upload Your Memory
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
            Drag and drop your black & white photo here, or tap to browse. 
            Perfect for vintage wedding photos and family memories.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg"
            className="relative overflow-hidden w-full sm:w-auto min-h-[48px]"
            disabled={isProcessing}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <FileImage className="w-5 h-5 mr-2" />
            Choose Photo
          </Button>
          
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4 mr-1" />
            JPG, PNG, or WEBP
          </div>
        </div>
      </div>
    </Card>
  );
};