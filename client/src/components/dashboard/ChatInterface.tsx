import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  uploadedFile: File | null;
  analysis: any;
  onQuestionAsked: () => void;
  comparison?: { leftText: string; rightText: string; differencesText: string; comparison: any } | null;
  conversationId?: string | null;
  initialMessages?: Array<{ role: 'user' | 'bot'; content: string; createdAt?: string | number | Date }>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ uploadedFile, analysis, onQuestionAsked, comparison, conversationId, initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const mapped: Message[] = initialMessages.map((m, idx) => ({
        id: `init-${idx}-${Date.now()}`,
        type: m.role,
        content: m.content,
        timestamp: m.createdAt ? new Date(m.createdAt) : new Date()
      }));
      setMessages(mapped);
      return;
    }
    if (analysis && uploadedFile) {
      // Add initial summary message when file is uploaded
      const summaryMessage: Message = {
        id: `summary-${Date.now()}`,
        type: 'bot',
        content: `I've analyzed your report "${uploadedFile.name}". Here's a summary:\n\n${analysis.summary}\n\nKey Points:\n${analysis.keyPoints.map((point: string) => `• ${point}`).join('\n')}\n\nFeel free to ask me any questions about this report!`,
        timestamp: new Date()
      };
      setMessages([summaryMessage]);
    }
  }, [analysis, uploadedFile, initialMessages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!uploadedFile && !comparison && !(analysis && analysis.documentText)) {
      toast({
        title: "No Document",
        description: "Please upload a PDF or perform a comparison first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    onQuestionAsked();

    try {
      let answer = '';
      if (comparison && comparison.leftText && comparison.rightText) {
        const res = await apiService.chatCompare(userMessage.content, comparison.leftText, comparison.rightText, comparison.differencesText);
        answer = res.answer;
      } else {
        const context = analysis?.documentText || '';
        const res = await apiService.chat(userMessage.content, context);
        answer = res.answer;
      }
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      if (conversationId) {
        try {
          await apiService.appendMessages(conversationId, [
            { role: 'user', content: userMessage.content },
            { role: 'bot', content: answer },
          ]);
        } catch {}
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key financial highlights?",
    "What risks are mentioned in the report?",
    "What are the main recommendations?",
    "How did the company perform this quarter?"
  ];

  return (
    <Card className="w-full h-[600px] bg-card/50 backdrop-blur-xl border-border/50 shadow-elegant flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>AI Assistant</span>
          {uploadedFile && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{uploadedFile.name}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && !uploadedFile && !comparison && !(analysis && analysis.documentText) && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Welcome to ReportAI</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a PDF report or compare two reports to start analyzing and asking questions
                  </p>
                </div>
              </div>
            )}

            {messages.length === 0 && (uploadedFile || comparison || (analysis && analysis.documentText)) && (
              <div className="text-center py-4">
                <div className="animate-pulse text-muted-foreground">
                  {comparison ? 'Ready to answer questions about the differences.' : 'Analyzing your report...'}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <Avatar className="w-8 h-8 bg-gradient-primary">
                    <AvatarFallback className="text-white text-xs bg-transparent">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent/50 border border-border/50'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-secondary">
                    <AvatarFallback className="text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex space-x-3 justify-start">
                <Avatar className="w-8 h-8 bg-gradient-primary">
                  <AvatarFallback className="text-white text-xs bg-transparent">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-accent/50 border border-border/50 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={uploadedFile || comparison || (analysis && analysis.documentText) ? "Ask a question..." : "Upload/Compare first to start chatting"}
            disabled={!(uploadedFile || comparison || (analysis && analysis.documentText)) || isLoading}
            className="flex-1 bg-background/50 border-border/50 focus:border-primary transition-smooth"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !(uploadedFile || comparison || (analysis && analysis.documentText)) || isLoading}
            variant="default"
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};