
import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import WelcomeScreen from "@/components/WelcomeScreen";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      role: "user" as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsWaitingForResponse(true);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant" as const,
        content: getAIResponse(content),
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setIsWaitingForResponse(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (message.toLowerCase().includes("help")) {
      return "I'm here to help! You can ask me about design, development, creative work, or just about anything else.";
    } else if (message.toLowerCase().includes("design")) {
      return "I'd be happy to help with design! What kind of design are you working on? UI/UX, graphic design, or something else?";
    } else if (message.toLowerCase().includes("code") || message.toLowerCase().includes("react")) {
      return "I can help with code! Do you need help with a specific programming language, framework, or concept?";
    } else {
      return "Thanks for your message! I'm a demo AI assistant. In a real implementation, I would generate thoughtful responses based on your queries.";
    }
  };

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader />
      
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen onStartChat={handleStartChat} key="welcome" />
        ) : (
          <motion.div 
            className="flex-1 overflow-y-auto"
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-[calc(100vh-180px)] text-muted-foreground">
                <p>Start a conversation with Lovable AI</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto py-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    index={index}
                  />
                ))}
                
                {isWaitingForResponse && (
                  <ChatMessage
                    role="assistant"
                    content=""
                    showTypingIndicator={true}
                    isLoading={true}
                    index={messages.length}
                  />
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isWaitingForResponse={isWaitingForResponse} 
      />
    </div>
  );
};

export default Index;
