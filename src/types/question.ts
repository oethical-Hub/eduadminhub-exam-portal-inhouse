export type QuestionType =
  | "mcq"
  | "true-false"
  | "descriptive"
  | "fill-blanks"
  | "file-upload"
  | "coding";

export type Difficulty = "easy" | "medium" | "hard";

// Backend API Question (matches database schema)
export interface QuestionApi {
  questionId: string;
  userId: string;
  institutionId: string;
  currentAcademicYearId: string;
  questionType: QuestionType;
  question: string;
  questionImage?: string | null;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  negativeMarks?: number;
  difficulty: Difficulty;
  category: string;
  subCategory?: string;
  tags?: string[];
  subject?: string;
  class?: string;
  topic?: string;
  timeLimit?: number;
  isActive?: boolean;
  usageCount?: number;
  lastUsedAt?: string | null;
  codeLanguage?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }>;
  fileTypes?: string[];
  maxFileSize?: number;
  fillBlanksAnswer?: Array<{
    blankIndex: number;
    correctText: string;
    caseSensitive?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Frontend Question (simplified for UI)
export interface Question {
  id: string; // Maps to questionId from API
  type: QuestionType; // Maps to questionType from API
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  negativeMarks?: number;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  explanation?: string;
  imageUrl?: string | null; // Maps to questionImage from API
  createdAt: string;
  // Additional fields from API
  subjectId?: string;
  subjectName?: string;
    classId?: string;
    className?: string;
    topic?: string;
  isActive?: boolean;
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

// Helper function to map API response to frontend Question
export function mapQuestionFromApi(apiQuestion: QuestionApi): Question {
  return {
    id: apiQuestion.questionId,
    type: apiQuestion.questionType,
    question: apiQuestion.question,
    options: apiQuestion.options,
    correctAnswer: apiQuestion.correctAnswer,
    marks: apiQuestion.marks,
    negativeMarks: apiQuestion.negativeMarks,
    difficulty: apiQuestion.difficulty,
    category: apiQuestion.category,
    tags: apiQuestion.tags || [],
    explanation: apiQuestion.explanation,
    imageUrl: apiQuestion.questionImage,
    createdAt: apiQuestion.createdAt,
    subjectId: apiQuestion.subjectId,
    subjectName: apiQuestion.subjectName,
    classId: apiQuestion.classId,
    className: apiQuestion.className,
    topic: apiQuestion.topic,
    isActive: apiQuestion.isActive,
  };
}

// Helper function to map frontend Question to API payload
export function mapQuestionToApi(question: Partial<Question>): {
  questionType: QuestionType;
  question: string;
  questionImage?: string | null;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  negativeMarks?: number;
  difficulty: Difficulty;
  category?: string;
  tags?: string[];
    subjectId?: string;
    classId?: string;
    topic?: string;
} {
  return {
    questionType: question.type as QuestionType,
    question: question.question || "",
    questionImage: question.imageUrl || null,
    options: question.options,
    correctAnswer: question.correctAnswer || "",
    explanation: question.explanation,
    marks: question.marks || 1,
    negativeMarks: question.negativeMarks,
    difficulty: question.difficulty || "easy",
    category: question.category,
    tags: question.tags,
    subjectId: question.subjectId,
    classId: question.classId,
    section: question.section,
    topic: question.topic,
  };
}

