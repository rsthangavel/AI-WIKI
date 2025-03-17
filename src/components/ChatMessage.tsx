import React, { useState } from "react";
import { motion } from "framer-motion";
import UserAvatar from "./UserAvatar";
import AIAvatar from "./AIAvatar";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "assistant";

interface YouTubeVideo {
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
}

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
  isLoading?: boolean;
  showTypingIndicator?: boolean;
  index: number;
  fileUrl?: string;
  fileType?: string;
  videos?: YouTubeVideo[];
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
  videos,
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

  // Helper function to render YouTube videos
  const renderYouTubeVideos = () => {
    if (!videos || videos.length === 0) return null;

    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-sm font-medium">YouTube Results:</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {videos.map((video, idx) => (
            <a 
              key={idx} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="p-3">
                <h4 className="line-clamp-2 text-sm font-medium">{video.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{video.channel}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  // Function to format text with bold markdown
  const formatText = (text: string) => {
    // Split by bold markdown pattern
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, i) => {
      // Check if this part is a bold pattern
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the asterisks and wrap in <strong> tag
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Return regular text
      return <span key={i}>{part}</span>;
    });
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
            <div className="whitespace-pre-wrap">
              {formatText(content)}
            </div>
          )}
          
          {/* Render file attachment if present */}
          {renderFileAttachment()}
        </div>
        
        {/* Render YouTube videos if present */}
        {!isUser && renderYouTubeVideos()}
        
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
