export type QuestionType =
  | "mcq"
  | "true-false"
  | "descriptive"
  | "fill-blanks"
  | "file-upload"
  | "coding";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  negativeMarks?: number;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  explanation?: string;
  imageUrl?: string | null;
  createdAt: string; // ISO date string
}

export interface QuestionListItem {
  id: string;
  type: QuestionType;
  question: string;
  category: string;
  difficulty: Difficulty;
  marks: number;
  createdAt: string;
}

