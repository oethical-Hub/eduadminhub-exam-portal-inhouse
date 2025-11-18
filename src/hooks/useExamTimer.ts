import { useState, useEffect, useRef } from "react";

export interface UseExamTimerReturn {
  timeRemaining: number; // seconds
  isWarning: boolean; // Less than 10 minutes
  isExpired: boolean;
  formattedTime: string;
  percentageRemaining: number;
}

export const useExamTimer = (
  duration: number, // minutes
  onTimeout: () => void
): UseExamTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize timer
    setTimeRemaining(duration * 60);
    setIsExpired(false);
    startTimeRef.current = Date.now();

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onTimeout]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isWarning = timeRemaining < 600; // Less than 10 minutes
  const percentageRemaining = (timeRemaining / (duration * 60)) * 100;

  return {
    timeRemaining,
    isWarning,
    isExpired,
    formattedTime: formatTime(timeRemaining),
    percentageRemaining,
  };
};

