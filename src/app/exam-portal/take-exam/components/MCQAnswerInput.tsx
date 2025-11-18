"use client";

import { Question } from "@/types/question";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MCQAnswerInputProps {
  question: Question;
  answer: string | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function MCQAnswerInput({
  question,
  answer,
  onAnswerChange,
}: MCQAnswerInputProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Select your answer:</Label>
      <RadioGroup
        value={answer || ""}
        onValueChange={(value) => onAnswerChange(value)}
        className="space-y-3"
      >
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

