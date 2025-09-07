
import { useState, useCallback, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
};

export const FileUpload = ({ onFileSelect, isUploading = false }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (file.type.startsWith("image/")) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
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
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};