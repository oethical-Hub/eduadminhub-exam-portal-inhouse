"use client";

import { Question } from "@/types/question";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DescriptiveAnswerInputProps {
  question: Question;
  answer: string | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function DescriptiveAnswerInput({
  question,
  answer,
  onAnswerChange,
}: DescriptiveAnswerInputProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Your answer:</Label>
      <Textarea
        value={answer || ""}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={8}
        className="min-h-[200px]"
      />
      <p className="text-sm text-muted-foreground">
        Please provide a detailed answer to the question above.
      </p>
    </div>
  );
}

