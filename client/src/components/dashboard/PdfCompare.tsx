import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { FileText, ArrowLeftRight } from "lucide-react";

interface PdfCompareProps {
  onCompared: (result: { comparison: { summary: string; keyDifferences: string[]; confidence: number }, leftText: string, rightText: string, differencesText: string }) => void;
}

export const PdfCompare: React.FC<PdfCompareProps> = ({ onCompared }) => {
  const { toast } = useToast();
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [progress, setProgress] = useState(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, which: 'A' | 'B') => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast({ title: 'Invalid file', description: 'Please select a PDF file', variant: 'destructive' });
      return;
    }
    if (which === 'A') setFileA(f); else setFileB(f);
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      toast({ title: 'Two PDFs required', description: 'Please select both PDF A and PDF B', variant: 'destructive' });
      return;
    }
    setIsComparing(true);
    setProgress(0);
    const t = setInterval(() => setProgress(p => (p < 90 ? p + 5 : p)), 150);
    try {
      const result = await apiService.analyzeCompare(fileA, fileB);
      clearInterval(t);
      setProgress(100);
      onCompared(result);
      toast({ title: 'Comparison complete', description: 'Differences extracted successfully' });
    } catch (e: any) {
      clearInterval(t);
      toast({ title: 'Comparison failed', description: e?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsComparing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><ArrowLeftRight className="h-4 w-4" /> Compare Two Reports</CardTitle>
        <CardDescription>Select two PDFs to find key differences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Report A</label>
            <input type="file" accept=".pdf" onChange={(e) => onFileChange(e, 'A')} />
            {fileA && (
              <div className="text-xs text-muted-foreground flex items-center gap-2"><FileText className="h-3 w-3" /> {fileA.name}</div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm">Report B</label>
            <input type="file" accept=".pdf" onChange={(e) => onFileChange(e, 'B')} />
            {fileB && (
              <div className="text-xs text-muted-foreground flex items-center gap-2"><FileText className="h-3 w-3" /> {fileB.name}</div>
            )}
          </div>
        </div>
        {isComparing && <Progress value={progress} className="h-2" />}
        <Button onClick={handleCompare} disabled={!fileA || !fileB || isComparing}>Compare</Button>
      </CardContent>
    </Card>
  );
};

