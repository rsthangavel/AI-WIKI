
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SettingOutlined, InfoCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Button as AntButton } from "antd";
import AIAvatar from "./AIAvatar";
import ThemeToggle from "./ThemeToggle";

interface ChatHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  showBackButton = false,
}) => {
  return (
    <motion.div
      className="px-4 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <AntButton
              type="text"
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            />
          )}
          <AIAvatar size="sm" />
          <div>
            <h2 className="font-medium text-sm">Lovable AI</h2>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <AntButton
            type="text"
            shape="circle"
            icon={<InfoCircleOutlined />}
            className="flex-shrink-0 hover:bg-secondary transition-all duration-200"
          />
          <AntButton
            type="text"
            shape="circle"
            icon={<SettingOutlined />}
            className="flex-shrink-0 hover:bg-secondary transition-all duration-200"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
