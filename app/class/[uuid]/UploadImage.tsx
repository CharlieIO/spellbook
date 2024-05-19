import { useRef, useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UploadImageProps {
  onUpload: (files: FileList | null) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setUploadProgress(prevProgress => {
          const nextProgress = prevProgress + 20;
          if (nextProgress < 100) {
            return nextProgress;
          }
          clearInterval(interval);
          return 100;
        });
      }, 500);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isUploading]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fileInputRef.current && !isUploading) {
      const files = fileInputRef.current.files;
      if (files) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/') && file.size <= 20000000);
        if (validFiles.length !== files.length) {
          alert('Only image files under 20MB are allowed.');
          return;
        }
      }
      setIsUploading(true);
      setUploadProgress(0);
      await onUpload(files);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the input field after upload
        setIsFileSelected(false); // Reset file selection state
      }
    }
  };

  const handleFileChange = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle>Upload New Images of Your Notes</CardTitle>
        <CardDescription>Uploading more notes helps us create better quizzes and content for you.</CardDescription>
      </CardHeader>
      <CardContent className="pt-2"> {/* Reduced top padding */}
        <form className="flex flex-col md:flex-row items-center justify-between gap-4" onSubmit={handleFormSubmit}>
          <div className="flex-1">
            <Input ref={fileInputRef} className="w-full" id="image-upload" multiple type="file" disabled={isUploading} accept="image/*" onChange={handleFileChange} />
            {isUploading && (
              <Progress className="w-full mt-4 h-2" value={uploadProgress} /> // Made the progress bar smaller
            )}
          </div>
          <Button className="shrink-0" type="submit" disabled={isUploading || !isFileSelected}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadImage;
