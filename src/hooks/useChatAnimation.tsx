
import { useEffect, useState } from "react";

type AnimationState = "initial" | "animating" | "complete";

export function useChatAnimation(delay: number = 0) {
  const [animationState, setAnimationState] = useState<AnimationState>("initial");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState("animating");
      
      const completeTimer = setTimeout(() => {
        setAnimationState("complete");
      }, 300); // Animation duration
      
      return () => clearTimeout(completeTimer);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return {
    isAnimating: animationState === "animating",
    isComplete: animationState === "complete",
    animationClass: 
      animationState === "initial" 
        ? "opacity-0 translate-y-4" 
        : animationState === "animating" 
          ? "opacity-100 translate-y-0 transition-all duration-300 ease-out" 
          : "opacity-100 translate-y-0"
  };
}

export function useTypingAnimation(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return { displayedText, isComplete };
}
