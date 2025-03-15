
import React from "react";
import { motion } from "framer-motion";

interface ChatTransitionProps {
  children: React.ReactNode;
  delay?: number;
}

export const ChatTransition: React.FC<ChatTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1], 
        delay: delay / 1000
      }}
    >
      {children}
    </motion.div>
  );
};

export default ChatTransition;
