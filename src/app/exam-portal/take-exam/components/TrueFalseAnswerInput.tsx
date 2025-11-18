"use client";

import { Question } from "@/types/question";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TrueFalseAnswerInputProps {
  question: Question;
  answer: string | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function TrueFalseAnswerInput({
  question,
  answer,
  onAnswerChange,
}: TrueFalseAnswerInputProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Select your answer:</Label>
      <RadioGroup
        value={answer || ""}
        onValueChange={(value) => onAnswerChange(value)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
          <RadioGroupItem value="True" id="true-option" />
          <Label htmlFor="true-option" className="cursor-pointer flex-1">
            True
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
          <RadioGroupItem value="False" id="false-option" />
          <Label htmlFor="false-option" className="cursor-pointer flex-1">
            False
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

