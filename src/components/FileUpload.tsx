
import { useState, useCallback, useRef } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
};

export const FileUpload = ({ onFileSelect, isUploading = false }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Allowed image file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/svg+xml'
  ];

  const validateImageFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, WebP, BMP, TIFF, or SVG)",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (validateImageFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, toast]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (validateImageFile(file)) {
          onFileSelect(file);
        }
        // Reset the input value so the same file can be selected again
        e.target.value = '';
      }
    },
    [onFileSelect, toast]
  );

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 transition-all ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      } cursor-pointer`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${
            isDragging ? "scale-110" : ""
          } bg-gradient-warm shadow-glow`}
        >
          <UploadCloud
            className={`w-8 h-8 text-primary-foreground transition-all ${
              isDragging ? "scale-110" : ""
            }`}
          />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Upload Black & White Photo</h3>
          <p className="text-muted-foreground text-sm">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, GIF, WebP, BMP, TIFF, SVG (max 10MB)
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-2"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Select Photo"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.svg"
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};