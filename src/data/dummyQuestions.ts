import { Question } from "@/types/question";

// ===== Dummy Questions Data =====
// This will be used until API is ready
// Structure matches the Question interface

export const dummyQuestions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    marks: 2,
    negativeMarks: 0.5,
    difficulty: "easy",
    category: "Geography",
    tags: ["geography", "capital", "europe"],
    explanation: "Paris is the capital and largest city of France.",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "q2",
    type: "true-false",
    question: "The Earth revolves around the Sun.",
    options: ["True", "False"],
    correctAnswer: "True",
    marks: 1,
    difficulty: "easy",
    category: "Science",
    tags: ["astronomy", "earth", "sun"],
    explanation: "Yes, the Earth orbits around the Sun in an elliptical path.",
    createdAt: "2025-01-15T10:05:00Z",
  },
  {
    id: "q3",
    type: "descriptive",
    question: "Explain the process of photosynthesis in plants.",
    correctAnswer: "Photosynthesis is the process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.",
    marks: 5,
    difficulty: "medium",
    category: "Biology",
    tags: ["biology", "photosynthesis", "plants"],
    explanation: "Photosynthesis occurs in chloroplasts and requires sunlight, water, and CO2.",
    createdAt: "2025-01-15T10:10:00Z",
  },
  {
    id: "q4",
    type: "fill-blanks",
    question: "The _____ is the largest planet in our solar system. It has _____ moons.",
    correctAnswer: ["Jupiter", "95"],
    marks: 2,
    difficulty: "medium",
    category: "Astronomy",
    tags: ["astronomy", "jupiter", "solar-system"],
    explanation: "Jupiter is the largest planet and has 95 known moons.",
    createdAt: "2025-01-15T10:15:00Z",
  },
  {
    id: "q5",
    type: "mcq",
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "JavaScript", "HTML", "Java"],
    correctAnswer: "HTML",
    marks: 2,
    negativeMarks: 0.5,
    difficulty: "easy",
    category: "Computer Science",
    tags: ["programming", "languages", "web"],
    explanation: "HTML is a markup language, not a programming language.",
    createdAt: "2025-01-15T10:20:00Z",
  },
  {
    id: "q6",
    type: "coding",
    question: "Write a function in Python to calculate the factorial of a number.",
    correctAnswer: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
    marks: 10,
    difficulty: "hard",
    category: "Programming",
    tags: ["python", "recursion", "factorial"],
    explanation: "This recursive function calculates factorial by calling itself with n-1 until base case.",
    createdAt: "2025-01-15T10:25:00Z",
  },
  {
    id: "q7",
    type: "file-upload",
    question: "Upload a PDF document explaining the water cycle.",
    correctAnswer: "PDF format, maximum 5MB, should include evaporation, condensation, and precipitation stages.",
    marks: 5,
    difficulty: "medium",
    category: "Science",
    tags: ["science", "water-cycle", "document"],
    explanation: "The document should clearly explain all stages of the water cycle.",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "q8",
    type: "mcq",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: "O(log n)",
    marks: 3,
    negativeMarks: 1,
    difficulty: "hard",
    category: "Computer Science",
    tags: ["algorithms", "complexity", "search"],
    explanation: "Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity.",
    createdAt: "2025-01-15T10:35:00Z",
  },
  {
    id: "q9",
    type: "true-false",
    question: "React is a framework, not a library.",
    options: ["True", "False"],
    correctAnswer: "False",
    marks: 1,
    difficulty: "easy",
    category: "Web Development",
    tags: ["react", "framework", "library"],
    explanation: "React is a JavaScript library for building user interfaces, not a framework.",
    createdAt: "2025-01-15T10:40:00Z",
  },
  {
    id: "q10",
    type: "descriptive",
    question: "Describe the difference between REST and GraphQL APIs.",
    correctAnswer: "REST is an architectural style that uses standard HTTP methods and returns fixed data structures, while GraphQL is a query language that allows clients to request exactly the data they need in a single request.",
    marks: 5,
    difficulty: "medium",
    category: "Web Development",
    tags: ["api", "rest", "graphql"],
    explanation: "REST uses multiple endpoints, GraphQL uses a single endpoint with flexible queries.",
    createdAt: "2025-01-15T10:45:00Z",
  },
];

// ===== Helper Functions =====
export const getQuestionById = (id: string): Question | undefined => {
  return dummyQuestions.find((q) => q.id === id);
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return dummyQuestions.filter((q) => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: "easy" | "medium" | "hard"): Question[] => {
  return dummyQuestions.filter((q) => q.difficulty === difficulty);
};

export const getQuestionsByType = (type: Question["type"]): Question[] => {
  return dummyQuestions.filter((q) => q.type === type);
};

export const searchQuestions = (searchTerm: string): Question[] => {
  const term = searchTerm.toLowerCase();
  return dummyQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term) ||
      q.tags.some((tag) => tag.toLowerCase().includes(term))
  );
};

