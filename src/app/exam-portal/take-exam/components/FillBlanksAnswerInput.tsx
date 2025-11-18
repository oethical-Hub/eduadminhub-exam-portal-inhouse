"use client";

import { Question } from "@/types/question";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FillBlanksAnswerInputProps {
  question: Question;
  answer: string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function FillBlanksAnswerInput({
  question,
  answer,
  onAnswerChange,
}: FillBlanksAnswerInputProps) {
  const answerArray = answer || [""];

  const handleChange = (index: number, value: string) => {
    const newAnswer = [...answerArray];
    newAnswer[index] = value;
    onAnswerChange(newAnswer);
  };

  // Determine number of blanks (assuming question text has placeholders like ___, [blank], etc.)
  const blankCount = Math.max(1, answerArray.length);

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Fill in the blanks:</Label>
      <div className="space-y-3">
        {Array.from({ length: blankCount }).map((_, index) => (
          <div key={index} className="space-y-1">
            <Label htmlFor={`blank-${index}`} className="text-sm">
              Blank {index + 1}:
            </Label>
            <Input
              id={`blank-${index}`}
              value={answerArray[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Enter answer for blank ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

