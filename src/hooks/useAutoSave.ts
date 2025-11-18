import { useState, useEffect, useRef } from "react";
import { Answer } from "@/types/result";

export interface UseAutoSaveReturn {
  lastSaved: Date | null;
  saving: boolean;
  error: string | null;
  saveNow: () => Promise<void>;
}

export const useAutoSave = (
  examId: string,
  answers: Record<string, Answer>,
  autoSaveInterval: number = 30000 // 30 seconds default
): UseAutoSaveReturn => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const answersRef = useRef(answers);

  // Update ref when answers change
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const saveAnswers = async () => {
    try {
      setSaving(true);
      setError(null);

      // TODO: Replace with actual API call
      // await api.post(`/exams/${examId}/answers`, { answers: answersRef.current });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setLastSaved(new Date());
    } catch (err) {
      console.error("Auto-save error:", err);
      setError("Failed to auto-save answers");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save on interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (Object.keys(answersRef.current).length > 0) {
        saveAnswers();
      }
    }, autoSaveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [examId, autoSaveInterval]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (Object.keys(answersRef.current).length > 0) {
        saveAnswers();
      }
    };
  }, []);

  return {
    lastSaved,
    saving,
    error,
    saveNow: saveAnswers,
  };
};

