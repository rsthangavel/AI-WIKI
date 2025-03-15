
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  fallback = "U", 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/10 shadow-sm transition-all duration-300`}>
      {src && <AvatarImage src={src} alt="User avatar" className="object-cover" />}
      <AvatarFallback className="bg-secondary text-secondary-foreground">
        {fallback || <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
