
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon, MicIcon, ImageIcon, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isWaitingForResponse?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isWaitingForResponse = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isWaitingForResponse) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  return (
    <motion.div 
      className="px-4 py-4 border-t bg-background/80 backdrop-blur-md sticky bottom-0 z-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full flex-shrink-0 hover:bg-secondary transition-all duration-200"
            onClick={() => {}}
            disabled={isWaitingForResponse}
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-grow">
            <Textarea
              ref={textareaRef}
              placeholder="Message Lovable..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isWaitingForResponse}
              className="resize-none pr-14 pl-4 py-3 max-h-[200px] rounded-full border focus-visible:ring-1 focus-visible:ring-primary bg-background"
              rows={1}
            />
            
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-8 w-8 rounded-full hover:bg-secondary transition-all duration-200"
                disabled={isWaitingForResponse}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-8 w-8 rounded-full hover:bg-secondary transition-all duration-200"
                disabled={isWaitingForResponse}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            className={`rounded-full flex-shrink-0 transition-all duration-300 ${
              !message.trim() ? "opacity-70" : "opacity-100"
            }`}
            size="icon"
            disabled={!message.trim() || isWaitingForResponse}
            onClick={handleSend}
          >
            <PaperPlaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
