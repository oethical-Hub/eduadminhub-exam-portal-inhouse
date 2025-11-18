import { Question } from "./question";

export type ExamStatus = "scheduled" | "active" | "completed" | "cancelled";

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number; // minutes
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: ExamStatus;
  proctoringEnabled: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarkingValue: number;
  questions: Question[];
  createdBy: string;
  createdAt: string; // ISO date string
}

export interface ExamListItem {
  id: string;
  title: string;
  subject: string;
  class: string;
  totalMarks: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  totalQuestions: number;
  createdBy: string;
}

