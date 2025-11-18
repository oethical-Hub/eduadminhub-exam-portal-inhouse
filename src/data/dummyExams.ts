import { Exam, ExamListItem } from "@/types/exam";
import { dummyQuestions } from "./dummyQuestions";

// ===== Dummy Exams Data =====
// This will be used until API is ready
// Structure matches the Exam interface

export const dummyExams: Exam[] = [
  {
    id: "exam1",
    title: "Mathematics Midterm Exam",
    description: "Comprehensive midterm examination covering algebra, geometry, and calculus",
    subject: "Mathematics",
    class: "Grade 10",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 120, // 2 hours
    startDate: "2025-02-15T09:00:00Z",
    endDate: "2025-02-15T11:00:00Z",
    status: "scheduled",
    proctoringEnabled: true,
    randomizeQuestions: true,
    randomizeOptions: true,
    passingMarks: 40,
    negativeMarking: true,
    negativeMarkingValue: 0.5,
    questions: dummyQuestions.slice(0, 25), // First 25 questions
    createdBy: "teacher1",
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "exam2",
    title: "Science Quiz - Physics",
    description: "Quick quiz on basic physics concepts",
    subject: "Science",
    class: "Grade 9",
    totalQuestions: 15,
    totalMarks: 50,
    duration: 45,
    startDate: "2025-02-10T14:00:00Z",
    endDate: "2025-02-10T14:45:00Z",
    status: "scheduled",
    proctoringEnabled: false,
    randomizeQuestions: false,
    randomizeOptions: true,
    passingMarks: 20,
    negativeMarking: false,
    negativeMarkingValue: 0,
    questions: dummyQuestions.slice(0, 15), // First 15 questions
    createdBy: "teacher2",
    createdAt: "2025-01-18T08:00:00Z",
  },
  {
    id: "exam3",
    title: "English Literature Final",
    description: "Final examination for English Literature course",
    subject: "English",
    class: "Grade 12",
    totalQuestions: 30,
    totalMarks: 150,
    duration: 180, // 3 hours
    startDate: "2025-02-20T09:00:00Z",
    endDate: "2025-02-20T12:00:00Z",
    status: "scheduled",
    proctoringEnabled: true,
    randomizeQuestions: true,
    randomizeOptions: false,
    passingMarks: 60,
    negativeMarking: false,
    negativeMarkingValue: 0,
    questions: dummyQuestions.slice(0, 30), // First 30 questions
    createdBy: "teacher1",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "exam4",
    title: "History Test - World War II",
    description: "Test covering World War II events and consequences",
    subject: "History",
    class: "Grade 11",
    totalQuestions: 20,
    totalMarks: 80,
    duration: 90,
    startDate: "2025-01-25T10:00:00Z",
    endDate: "2025-01-25T11:30:00Z",
    status: "completed",
    proctoringEnabled: true,
    randomizeQuestions: true,
    randomizeOptions: true,
    passingMarks: 32,
    negativeMarking: true,
    negativeMarkingValue: 0.25,
    questions: dummyQuestions.slice(0, 20), // First 20 questions
    createdBy: "teacher3",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "exam5",
    title: "Chemistry Lab Exam",
    description: "Practical examination on chemical reactions",
    subject: "Chemistry",
    class: "Grade 10",
    totalQuestions: 18,
    totalMarks: 90,
    duration: 150,
    startDate: "2025-02-05T13:00:00Z",
    endDate: "2025-02-05T15:30:00Z",
    status: "active",
    proctoringEnabled: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    passingMarks: 36,
    negativeMarking: false,
    negativeMarkingValue: 0,
    questions: dummyQuestions.slice(0, 18), // First 18 questions
    createdBy: "teacher2",
    createdAt: "2025-01-12T09:00:00Z",
  },
];

// ===== Exam List Items (for listing view) =====
export const dummyExamListItems: ExamListItem[] = dummyExams.map((exam) => ({
  id: exam.id,
  title: exam.title,
  subject: exam.subject,
  class: exam.class,
  totalMarks: exam.totalMarks,
  duration: exam.duration,
  startDate: exam.startDate,
  endDate: exam.endDate,
  status: exam.status,
  totalQuestions: exam.totalQuestions,
  createdBy: exam.createdBy,
}));

// ===== Helper Functions =====
export const getExamById = (id: string): Exam | undefined => {
  return dummyExams.find((exam) => exam.id === id);
};

export const getExamsByStatus = (status: Exam["status"]): Exam[] => {
  return dummyExams.filter((exam) => exam.status === status);
};

export const getExamsBySubject = (subject: string): Exam[] => {
  return dummyExams.filter((exam) => exam.subject.toLowerCase() === subject.toLowerCase());
};

export const searchExams = (searchTerm: string): Exam[] => {
  const term = searchTerm.toLowerCase();
  return dummyExams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(term) ||
      exam.subject.toLowerCase().includes(term) ||
      exam.class.toLowerCase().includes(term) ||
      exam.description?.toLowerCase().includes(term)
  );
};

