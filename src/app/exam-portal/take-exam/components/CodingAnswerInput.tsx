"use client";

import { Question } from "@/types/question";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CodingAnswerInputProps {
  question: Question;
  answer: string | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function CodingAnswerInput({
  question,
  answer,
  onAnswerChange,
}: CodingAnswerInputProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Your code solution:</Label>
      <Textarea
        value={answer || ""}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Write your code here..."
        rows={15}
        className="font-mono text-sm"
      />
      <p className="text-sm text-muted-foreground">
        Write your code solution in the text area above. Make sure to include proper syntax and logic.
      </p>
    </div>
  );
}

