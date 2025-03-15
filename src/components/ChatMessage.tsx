
import React, { useState } from "react";
import { motion } from "framer-motion";
import UserAvatar from "./UserAvatar";
import AIAvatar from "./AIAvatar";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "assistant";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
  isLoading?: boolean;
  showTypingIndicator?: boolean;
  index: number;
  fileUrl?: string;
  fileType?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  isLoading = false,
  showTypingIndicator = false,
  index,
  fileUrl,
  fileType,
}) => {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to render file attachments
  const renderFileAttachment = () => {
    if (!fileUrl || !fileType) return null;

    if (fileType.startsWith('image/')) {
      return (
        <div className="mt-2 rounded-md overflow-hidden">
          <img src={fileUrl} alt="Uploaded image" className="max-w-full max-h-[300px] object-contain" />
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <div className="mt-2 rounded-md overflow-hidden">
          <video controls className="max-w-full max-h-[300px]">
            <source src={fileUrl} type={fileType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={fileUrl} type={fileType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else {
      // For other file types, show a download link
      return (
        <div className="mt-2">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary underline flex items-center gap-2"
          >
            <span>Download attachment</span>
          </a>
        </div>
      );
    }
  };

  return (
    <motion.div
      className={cn(
        "flex gap-4 px-4 py-6 group relative",
        isUser ? "justify-end" : "",
        isUser ? "" : "hover:bg-secondary/30"
      )}
      initial="hidden"
      animate="visible"
      custom={index}
      variants={messageVariants}
    >
      {!isUser && <AIAvatar />}
      
      <div className={cn(
        "flex flex-col max-w-[80%] md:max-w-[70%] space-y-2",
        isUser ? "items-end" : ""
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl relative",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-secondary text-secondary-foreground rounded-tl-none",
          "shadow-sm"
        )}>
          {showTypingIndicator ? (
            <div className="typing-indicator-container">
              <span className="typing-indicator"></span>
              <span className="typing-indicator" style={{ animationDelay: "0.2s" }}></span>
              <span className="typing-indicator" style={{ animationDelay: "0.4s" }}></span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
          
          {/* Render file attachment if present */}
          {renderFileAttachment()}
        </div>
        
        {timestamp && (
          <div className="text-xs text-muted-foreground">
            {timestamp}
          </div>
        )}
      </div>
      
      {!isUser && !isLoading && content && (
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-secondary transition-all duration-200"
          aria-label="Copy message"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}

      {isUser && <UserAvatar />}
    </motion.div>
  );
};

export default ChatMessage;
