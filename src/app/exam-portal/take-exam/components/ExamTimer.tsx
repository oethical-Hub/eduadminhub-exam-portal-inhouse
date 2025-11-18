"use client";

import { Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UseExamTimerReturn } from "@/hooks/useExamTimer";

interface ExamTimerProps {
  timer: UseExamTimerReturn;
}

export default function ExamTimer({ timer }: ExamTimerProps) {
  const { formattedTime, isWarning, isExpired, percentageRemaining } = timer;

  return (
    <Card className={`${isWarning ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" : ""} ${isExpired ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className={`h-6 w-6 ${isWarning ? "text-yellow-600" : isExpired ? "text-red-600" : ""}`} />
            <div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className={`text-2xl font-bold ${isWarning ? "text-yellow-600" : isExpired ? "text-red-600" : ""}`}>
                {formattedTime}
              </p>
            </div>
          </div>
          {isWarning && !isExpired && (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Less than 10 minutes remaining</span>
            </div>
          )}
          {isExpired && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Time's up!</span>
            </div>
          )}
        </div>
        {!isExpired && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isWarning ? "bg-yellow-500" : "bg-blue-500"
                }`}
                style={{ width: `${percentageRemaining}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

