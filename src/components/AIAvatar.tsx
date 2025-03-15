
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SparklesIcon } from "lucide-react";

interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
}

const AIAvatar: React.FC<AIAvatarProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={`${sizeClasses[size]} bg-gradient-to-br from-primary/80 to-primary border-2 border-primary/10 shadow-sm animate-pulse-subtle`}>
      <AvatarImage src="/ai-avatar.png" alt="AI Assistant" className="p-1" />
      <AvatarFallback className="bg-primary text-primary-foreground">
        <SparklesIcon className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
};

export default AIAvatar;
