"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Question } from "@/types/question";
import { Answer } from "@/types/result";

interface QuestionNavigationProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, Answer>;
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const getQuestionStatus = (index: number) => {
    const question = questions[index];
    const answer = answers[question.id];

    if (answer?.isMarked) {
      return "marked";
    }
    if (answer?.answer) {
      if (Array.isArray(answer.answer)) {
        return answer.answer.some((a) => a && a.trim() !== "") ? "answered" : "unanswered";
      }
      return answer.answer.trim() !== "" ? "answered" : "unanswered";
    }
    return "unanswered";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "answered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "marked":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return "bg-blue-500 text-white border-blue-600";
    }
    switch (status) {
      case "answered":
        return "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800";
      case "marked":
        return "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800";
      default:
        return "bg-white border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(index);
            const isCurrent = index === currentIndex;

            return (
              <Button
                key={question.id}
                type="button"
                variant="outline"
                size="sm"
                className={`h-12 flex flex-col items-center justify-center gap-1 ${getStatusColor(status, isCurrent)}`}
                onClick={() => onQuestionSelect(index)}
              >
                {getStatusIcon(status)}
                <span className="text-xs font-medium">{index + 1}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>Not Answered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

