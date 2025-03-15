
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, LightbulbIcon, SearchIcon, CodeIcon } from "lucide-react";
import AIAvatar from "./AIAvatar";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const exampleQueries = [
    "Create a 3D rotating animation",
    "Explain quantum computing",
    "Help me design a landing page",
    "Generate a React component",
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-4 text-center"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6">
        <AIAvatar size="lg" />
      </motion.div>

      <motion.h1
        variants={item}
        className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
      >
        Lovable AI
      </motion.h1>

      <motion.p
        variants={item}
        className="text-lg text-muted-foreground max-w-md mb-8"
      >
        Your intelligent assistant for design, development, and creative work.
      </motion.p>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mb-8">
        <div className="bg-secondary/50 rounded-xl p-4 text-left flex items-start space-x-3">
          <LightbulbIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Creative Ideas</h3>
            <p className="text-sm text-muted-foreground">Get inspired with fresh perspectives and innovative solutions</p>
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-xl p-4 text-left flex items-start space-x-3">
          <CodeIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Code Generation</h3>
            <p className="text-sm text-muted-foreground">Generate code snippets and complete components</p>
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-xl p-4 text-left flex items-start space-x-3">
          <SearchIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Smart Research</h3>
            <p className="text-sm text-muted-foreground">Find answers and insights on any topic</p>
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-xl p-4 text-left flex items-start space-x-3">
          <MessageCircleIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Natural Conversation</h3>
            <p className="text-sm text-muted-foreground">Chat naturally with context-aware responses</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <p className="text-sm text-muted-foreground mb-3">Try asking about:</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {exampleQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              className="rounded-full text-sm hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
              onClick={() => onStartChat()}
            >
              {query}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Button
          size="lg"
          className="rounded-full px-8 hover:scale-105 transition-all duration-300"
          onClick={onStartChat}
        >
          Start a New Chat
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
