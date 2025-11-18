export interface StudentAnswer {
  examId: string;
  studentId: string;
  answers: Answer[];
  submittedAt: string | null; // ISO date string
  autoSubmitted: boolean;
  proctoringAlerts: number;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isMarked: boolean;
  timeSpent: number; // seconds
  answeredAt: string; // ISO date string
}

export interface Result {
  examId: string;
  studentId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeTaken: number; // minutes
  submittedAt: string; // ISO date string
  reviewedAt: string | null; // ISO date string
  reviewStatus: "pending" | "completed";
}

