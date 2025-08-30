import React, { useState } from 'react';
import { PdfUpload } from './PdfUpload';
import { PdfCompare } from './PdfCompare';
import { ChatInterface } from './ChatInterface';
import { ChatSidebar } from './ChatSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

export const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Array<{ role: 'user' | 'bot'; content: string; createdAt?: string }>>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    reportsAnalyzed: 0,
    questionsAsked: 0,
    insightsGenerated: 0
  });

  const handleFileUploaded = async (file: File, analysisData: any) => {
    setUploadedFile(file);
    setAnalysis(analysisData);
    setComparison(null);
    // Increment stats
    setStats(prev => ({ ...prev, reportsAnalyzed: prev.reportsAnalyzed + 1 }));
    setStats(prev => ({ ...prev, insightsGenerated: prev.insightsGenerated + 1 }));
    try {
      const title = `${file.name} • ${new Date().toLocaleDateString()}`;
      const summaryText = `I've analyzed your report "${file.name}". Here's a summary:\n\n${analysisData.summary}\n\nKey Points:\n${analysisData.keyPoints.map((p: string) => `• ${p}`).join('\n')}\n\nFeel free to ask me any questions about this report!`;
      const created = await apiService.createConversation({
        title,
        type: 'single',
        context: { documentText: analysisData.documentText },
        initialMessages: [{ role: 'bot', content: summaryText }]
      });
      setConversationId(created.id);
      setSelectedConversationId(created.id);
      setInitialMessages([{ role: 'bot', content: summaryText }]);
    } catch {}
  };

  const handleCompared = async (result: any) => {
    setComparison(result);
    setAnalysis(null);
    try {
      const title = `Comparison • ${new Date().toLocaleDateString()}`;
      const summaryText = `Summary of differences:\n${result.comparison.summary}\n\nKey differences:\n${result.comparison.keyDifferences.map((p: string) => `• ${p}`).join('\n')}`;
      const created = await apiService.createConversation({
        title,
        type: 'compare',
        context: { leftText: result.leftText, rightText: result.rightText, differencesText: result.differencesText },
        initialMessages: [{ role: 'bot', content: summaryText }]
      });
      setConversationId(created.id);
      setSelectedConversationId(created.id);
      setInitialMessages([{ role: 'bot', content: summaryText }]);
    } catch {}
  };

  const handleQuestionAsked = () => {
    setStats(prev => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
  };

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id);
    setConversationId(id);
    try {
      const convo = await apiService.getConversation(id);
      // Hydrate messages
      setInitialMessages(convo.messages.map(m => ({ role: m.role as 'user' | 'bot', content: m.content, createdAt: m.createdAt })));
      // Set context
      if (convo.type === 'single') {
        setComparison(null);
        setAnalysis({ documentText: convo.context?.documentText });
        setUploadedFile(null);
      } else {
        setAnalysis(null);
        setComparison({
          leftText: convo.context?.leftText || '',
          rightText: convo.context?.rightText || '',
          differencesText: convo.context?.differencesText || '',
          comparison: { summary: '', keyDifferences: [], confidence: 0.6 }
        });
      }
    } catch {}
  };

  const statsData = [
    {
      title: "Reports Analyzed",
      value: stats.reportsAnalyzed.toString(),
      icon: FileText,
      description: "Total reports"
    },
    {
      title: "Questions Asked",
      value: stats.questionsAsked.toString(),
      icon: MessageSquare,
      description: "Total queries"
    },
    {
      title: "Insights Generated",
      value: stats.insightsGenerated.toString(),
      icon: TrendingUp,
      description: "Key findings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ReportAI
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome to your AI Assistant</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your reports and get instant AI-powered analysis, summaries, and answer any questions about your documents.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-xl border-border/50 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-4">
              <ChatSidebar selectedId={selectedConversationId} onSelect={handleSelectConversation} />
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Upload & Analyze</h3>
              <PdfUpload onFileUploaded={handleFileUploaded} />
              
              {analysis && analysis.summary && (
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Summary</CardTitle>
                    <CardDescription>
                      AI-generated insights from your report
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {analysis.keyPoints.map((point: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Confidence Score
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {Math.round(analysis.confidence * 100)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Compare Section */}
              <h3 className="text-xl font-semibold">Compare Reports</h3>
              <PdfCompare onCompared={handleCompared} />

              {comparison && (
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Key Differences</CardTitle>
                    <CardDescription>
                      Summary and differences between Report A and Report B
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">{comparison.comparison.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Differences</h4>
                      <ul className="space-y-1">
                        {comparison.comparison.keyDifferences.map((point: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Confidence Score
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {Math.round((comparison.comparison.confidence || 0.6) * 100)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Chat Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ask Questions</h3>
              <ChatInterface 
                uploadedFile={uploadedFile} 
                analysis={analysis}
                onQuestionAsked={handleQuestionAsked}
                comparison={comparison}
                conversationId={conversationId}
                initialMessages={initialMessages}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};