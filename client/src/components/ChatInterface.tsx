import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { quickReplyOptions, initialChatMessages } from "@/lib/dummyData";
import { sendMessage, getChatHistory } from "@/lib/geminiClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface ChatMessage {
  id?: number;
  isUserMessage: boolean;
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Scroll to bottom of chat messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;
      
      try {
        const history = await getChatHistory(user.id, 15);
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    
    loadChatHistory();
  }, [user]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return;
    
    const userMessage: ChatMessage = {
      isUserMessage: true,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const aiResponse = await sendMessage(inputValue, user.id);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickReply = async (option: string) => {
    if (!user) return;
    
    setInputValue(option);
    const userMessage: ChatMessage = {
      isUserMessage: true,
      content: option,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const aiResponse = await sendMessage(option, user.id);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-200 px-5 py-4 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="material-icons">smart_toy</span>
          </div>
          <div>
            <h2 className="font-semibold">AI Wealth Advisor</h2>
            <div className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Online • Using Gemini with MCP</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Chat messages container */}
        <ScrollArea className="h-[400px]">
          <div className="p-5 space-y-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 ${message.isUserMessage ? 'justify-end' : ''}`}
              >
                {!message.isUserMessage && (
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="material-icons text-sm">smart_toy</span>
                  </div>
                )}
                
                <div 
                  className={`${
                    message.isUserMessage
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  } rounded-lg p-3 max-w-[85%] shadow-sm`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                
                {message.isUserMessage && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="material-icons text-sm">person</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Quick reply buttons after AI message */}
            {messages.length > 0 && !messages[messages.length - 1].isUserMessage && (
              <div className="flex flex-wrap gap-2 px-11 mt-4">
                {quickReplyOptions.map((option, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => handleQuickReply(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-icons text-sm">smart_toy</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Chat input area */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <span className="material-icons">mic</span>
            </Button>
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask your wealth advisor..."
                className="rounded-full pl-4 pr-10 py-6 text-gray-700"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons">attach_file</span>
              </Button>
            </div>
            <Button 
              className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary-600"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <span className="material-icons">send</span>
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 px-12">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="material-icons text-xs mr-1">info</span>
              Powered by Gemini with Model Context Protocol
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 h-auto w-auto p-0">
                <span className="material-icons text-sm">settings</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 h-auto w-auto p-0">
                <span className="material-icons text-sm">help_outline</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
