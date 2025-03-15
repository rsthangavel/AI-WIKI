
import React, { useState, useRef, useEffect } from "react";
import { Input, Button as AntButton } from "antd";
import { Button } from "@/components/ui/button";
import { SendOutlined, AudioOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isWaitingForResponse?: boolean;
}

const { TextArea } = Input;

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isWaitingForResponse = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<any>(null);

  const handleSend = () => {
    if (message.trim() && !isWaitingForResponse) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.resizableTextArea.textArea.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className="px-4 py-4 border-t bg-background/80 backdrop-blur-md sticky bottom-0 z-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-2">
          <AntButton
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            className="flex-shrink-0 hover:bg-secondary transition-all duration-200"
            onClick={() => {}}
            disabled={isWaitingForResponse}
          />
          
          <div className="relative flex-grow">
            <TextArea
              ref={textareaRef}
              placeholder="Message Lovable..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isWaitingForResponse}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="resize-none pr-14 pl-4 py-3 max-h-[200px] rounded-full border bg-background"
              style={{ borderRadius: '24px' }}
            />
            
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <AntButton
                type="text"
                shape="circle"
                size="small"
                icon={<PictureOutlined />}
                className="h-8 w-8 hover:bg-secondary transition-all duration-200"
                disabled={isWaitingForResponse}
              />
              <AntButton
                type="text"
                shape="circle"
                size="small"
                icon={<AudioOutlined />}
                className="h-8 w-8 hover:bg-secondary transition-all duration-200"
                disabled={isWaitingForResponse}
              />
            </div>
          </div>
          
          <AntButton
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            className={`transition-all duration-300 ${
              !message.trim() ? "opacity-70" : "opacity-100"
            }`}
            disabled={!message.trim() || isWaitingForResponse}
            onClick={handleSend}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
