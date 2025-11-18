"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Save, CheckCircle2 } from "lucide-react";
import { getExamById } from "@/data/dummyExams";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useProctoring } from "@/hooks/useProctoring";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { Question } from "@/types/question";
import { Answer } from "@/types/result";
import ExamTimer from "../components/ExamTimer";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigation from "../components/QuestionNavigation";
import ProctoringCamera from "../components/ProctoringCamera";
import ProctoringAlerts from "../components/ProctoringAlerts";
import { toast } from "react-toastify";

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState(getExamById(examId));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize exam and questions
  useEffect(() => {
    if (!exam) {
      toast.error("Exam not found");
      router.push("/exam-portal/exams");
      return;
    }

    // Load questions from exam (in real app, fetch from API)
    const examQuestions = exam.questions && exam.questions.length > 0 
      ? exam.questions 
      : []; // Fallback to empty if no questions
    setQuestions(examQuestions);

    // Initialize answers
    const initialAnswers: Record<string, Answer> = {};
    examQuestions.forEach((q) => {
      initialAnswers[q.id] = {
        questionId: q.id,
        answer: q.type === "fill-blanks" ? [""] : "",
        isMarked: false,
        timeSpent: 0,
        answeredAt: new Date().toISOString(),
      };
    });
    setAnswers(initialAnswers);
  }, [exam, router]);

  // Submit exam
  const handleSubmitExam = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit) {
      setShowSubmitDialog(false);
    }

    setSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // await api.post(`/exams/${examId}/submit`, { answers });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(autoSubmit ? "Exam auto-submitted!" : "Exam submitted successfully!");
      router.push(`/exam-portal/results/${examId}`);
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, router]);

  // Timer
  const handleTimeout = useCallback(() => {
    toast.warning("Time's up! Submitting exam automatically...");
    handleSubmitExam(true);
  }, [handleSubmitExam]);

  const timer = useExamTimer(exam?.duration || 60, handleTimeout);

  // Auto-save
  const autoSave = useAutoSave(examId, answers);

  // Proctoring (only enable if exam is loaded and proctoring is enabled)
  const proctoring = useProctoring(examId, exam ? (exam.proctoringEnabled || false) : false);

  // Exam Security (disable right-click, shortcuts, etc.)
  useExamSecurity(true);

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer,
        answeredAt: new Date().toISOString(),
      },
    }));
  };

  // Handle mark toggle
  const handleMarkToggle = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isMarked: !prev[questionId].isMarked,
      },
    }));
  };

  // Navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentIndex(index);
  };

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading exam...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">
              {exam.subject} - {exam.class}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {autoSave.saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Save className="h-4 w-4 animate-pulse" />
                <span>Saving...</span>
              </div>
            )}
            {autoSave.lastSaved && !autoSave.saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Saved</span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => autoSave.saveNow()}
              disabled={autoSave.saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Now
            </Button>
          </div>
        </div>

        {/* Timer */}
        <ExamTimer timer={timer} />

        {/* Proctoring Alerts */}
        {exam && exam.proctoringEnabled && proctoring.alerts.length > 0 && (
          <ProctoringAlerts
            alerts={proctoring.alerts}
            onDismiss={(alertId) => {
              // In real app, this would update the alerts state
              console.log("Dismiss alert:", alertId);
            }}
          />
        )}

        {/* Proctoring Info */}
        {exam && exam.proctoringEnabled && proctoring.alerts.length === 0 && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm">Proctoring is active. Please stay in frame.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Proctoring Camera */}
            {exam && exam.proctoringEnabled && (
              <ProctoringCamera proctoring={proctoring} examId={examId} />
            )}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              answer={currentAnswer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              isMarked={currentAnswer?.isMarked || false}
              onMarkToggle={() => handleMarkToggle(currentQuestion.id)}
            />

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleMarkToggle(currentQuestion.id)}
                >
                  {currentAnswer?.isMarked ? "Unmark" : "Mark for Review"}
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={() => setShowSubmitDialog(true)}
                disabled={timer.isExpired}
              >
                Submit Exam
              </Button>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <p className="text-sm">
              <strong>Answered:</strong>{" "}
              {Object.values(answers).filter((a) => {
                if (Array.isArray(a.answer)) {
                  return a.answer.some((ans) => ans && ans.trim() !== "");
                }
                return a.answer && a.answer.trim() !== "";
              }).length}{" "}
              / {questions.length}
            </p>
            <p className="text-sm">
              <strong>Marked for Review:</strong>{" "}
              {Object.values(answers).filter((a) => a.isMarked).length}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleSubmitExam(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
