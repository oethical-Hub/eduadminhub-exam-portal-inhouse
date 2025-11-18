"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question, QuestionType } from "@/types/question";
import { Answer } from "@/types/result";
import MCQAnswerInput from "./MCQAnswerInput";
import TrueFalseAnswerInput from "./TrueFalseAnswerInput";
import DescriptiveAnswerInput from "./DescriptiveAnswerInput";
import FillBlanksAnswerInput from "./FillBlanksAnswerInput";
import FileUploadAnswerInput from "./FileUploadAnswerInput";
import CodingAnswerInput from "./CodingAnswerInput";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answer: Answer | null;
  onAnswerChange: (answer: string | string[]) => void;
  isMarked: boolean;
  onMarkToggle: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  isMarked,
  onMarkToggle,
}: QuestionCardProps) {
  const getAnswerInput = () => {
    switch (question.type) {
      case "mcq":
        return (
          <MCQAnswerInput
            question={question}
            answer={answer?.answer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      case "true-false":
        return (
          <TrueFalseAnswerInput
            question={question}
            answer={answer?.answer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      case "descriptive":
        return (
          <DescriptiveAnswerInput
            question={question}
            answer={answer?.answer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      case "fill-blanks":
        return (
          <FillBlanksAnswerInput
            question={question}
            answer={answer?.answer as string[] | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      case "file-upload":
        return (
          <FileUploadAnswerInput
            question={question}
            answer={answer?.answer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      case "coding":
        return (
          <CodingAnswerInput
            question={question}
            answer={answer?.answer as string | undefined}
            onAnswerChange={onAnswerChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
            <Badge variant="outline">{question.marks} {question.marks === 1 ? "mark" : "marks"}</Badge>
            {question.negativeMarks && question.negativeMarks > 0 && (
              <Badge variant="outline" className="text-red-600">
                -{question.negativeMarks} negative
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          <p className="text-lg font-medium">{question.question}</p>
        </div>

        {getAnswerInput()}

        <div className="flex items-center gap-2 pt-4 border-t">
          <input
            type="checkbox"
            id={`mark-${question.id}`}
            checked={isMarked}
            onChange={onMarkToggle}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor={`mark-${question.id}`} className="text-sm cursor-pointer">
            Mark for Review
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

