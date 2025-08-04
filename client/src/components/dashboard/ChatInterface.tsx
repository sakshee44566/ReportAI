import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  uploadedFile: File | null;
  analysis: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ uploadedFile, analysis }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
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
  }, [analysis, uploadedFile]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!uploadedFile) {
      toast({
        title: "No Document",
        description: "Please upload a PDF first to start chatting.",
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

    try {
      // Simulate API call to your backend/AI service
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate mock response based on user input
      const mockResponse = generateMockResponse(userMessage.content);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: mockResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
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

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('revenue') || input.includes('sales')) {
      return "Based on the report, revenue showed strong growth of 15% quarter-over-quarter. The main drivers were expansion into new markets and improved customer retention rates. Would you like me to elaborate on any specific revenue segment?";
    }
    
    if (input.includes('profit') || input.includes('margin')) {
      return "The report indicates profit margins improved to 22%, which represents a 3 percentage point increase from the previous quarter. This improvement was primarily due to operational efficiency gains and cost optimization initiatives.";
    }
    
    if (input.includes('risk') || input.includes('challenge')) {
      return "The report identifies several key risks: market volatility, supply chain disruptions, and increased competition. However, the company has implemented mitigation strategies including diversified supplier networks and hedging mechanisms.";
    }
    
    if (input.includes('recommendation') || input.includes('suggest')) {
      return "Based on the analysis, I recommend: 1) Continue market expansion efforts, 2) Invest in technology infrastructure, 3) Focus on customer retention programs, and 4) Monitor competitive landscape closely. These recommendations align with the report's strategic objectives.";
    }
    
    return "I've analyzed your question in the context of the uploaded report. The document provides relevant insights on this topic. Could you please be more specific about which aspect you'd like me to focus on? I can provide detailed information about financial performance, operational metrics, strategic initiatives, or any other section of the report.";
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
            {messages.length === 0 && !uploadedFile && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Welcome to ReportAI</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a PDF report to start analyzing and asking questions
                  </p>
                </div>
              </div>
            )}

            {messages.length === 0 && uploadedFile && (
              <div className="text-center py-4">
                <div className="animate-pulse text-muted-foreground">
                  Analyzing your report...
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

        {messages.length === 0 && uploadedFile && (
          <div className="grid grid-cols-1 gap-2">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-left justify-start h-auto p-2 text-xs"
                onClick={() => setInputValue(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={uploadedFile ? "Ask a question about your report..." : "Upload a PDF first to start chatting"}
            disabled={!uploadedFile || isLoading}
            className="flex-1 bg-background/50 border-border/50 focus:border-primary transition-smooth"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !uploadedFile || isLoading}
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