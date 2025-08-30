import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { apiService } from "@/lib/api";

interface PdfUploadProps {
  onFileUploaded: (file: File, analysis: any) => void;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

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
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileSelection = async (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only PDF files.",
        variant: "destructive",
      });
      return;
    }

    if (pdfFiles.length > 1) {
      toast({
        title: "Multiple Files",
        description: "Please upload one PDF file at a time.",
        variant: "destructive",
      });
      return;
    }

    const file = pdfFiles[0];
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a PDF file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    try {
      // Show progress animation until request returns
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 150);

      const { analysis, documentText } = await apiService.analyzeDocument(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Analysis Complete",
        description: "Your PDF has been analyzed successfully.",
      });

      onFileUploaded(
        new File([file], file.name, { type: file.type }),
        { ...analysis, documentText }
      );
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload and analyze the PDF. Please try again.",
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-xl border-border/50 shadow-elegant">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Upload Your Report</CardTitle>
        <CardDescription>
          Upload a PDF report to get AI-powered analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-accent/20'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-primary/20 scale-110' : 'bg-accent'
              }`}>
                <Upload className={`h-8 w-8 transition-colors duration-300 ${
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                </h3>
                <p className="text-muted-foreground">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF files up to 50MB
                </p>
              </div>

              <Button
                variant="premium"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
              >
                <FileText className="h-4 w-4 mr-2" />
                Browse Files
              </Button>

              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelection(Array.from(e.target.files))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {uploadProgress === 100 ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : isUploading ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />
                ) : null}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {uploadProgress < 90 ? 'Uploading...' : 'Analyzing...'}
                  </span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};