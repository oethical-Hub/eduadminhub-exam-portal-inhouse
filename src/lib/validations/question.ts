import { z } from "zod";

// ===== Question Type Enum =====
export const questionTypeEnum = z.enum([
  "mcq",
  "true-false",
  "descriptive",
  "fill-blanks",
  "file-upload",
  "coding",
]);

// ===== Difficulty Enum =====
export const difficultyEnum = z.enum(["easy", "medium", "hard"]);

// ===== Base Question Schema =====
const baseQuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(2000, "Question must not exceed 2000 characters")
    .regex(/^[^<>]*$/, "Question cannot contain < or > characters"),
  marks: z.coerce
    .number({
      required_error: "Marks is required",
      invalid_type_error: "Marks must be a number",
    })
    .min(0.5, "Marks must be at least 0.5")
    .max(100, "Marks cannot exceed 100"),
  negativeMarks: z.coerce
    .number({
      invalid_type_error: "Negative marks must be a number",
    })
    .min(0, "Negative marks cannot be negative")
    .max(10, "Negative marks cannot exceed 10")
    .optional(),
  difficulty: difficultyEnum,
  category: z
    .string()
    .max(100, "Category must not exceed 100 characters")
    .optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
  explanation: z
    .string()
    .max(1000, "Explanation must not exceed 1000 characters")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
});

// ===== MCQ Schema =====
const mcqSchema = baseQuestionSchema.extend({
  type: z.literal("mcq"),
  options: z
    .array(z.string())
    .min(2, "At least 2 options required")
    .max(10, "Maximum 10 options allowed")
    .refine(
      (options) => {
        const nonEmpty = options.filter((opt) => opt.trim().length > 0);
        return nonEmpty.length >= 2;
      },
      { message: "At least 2 non-empty options required" }
    )
    .refine(
      (options) => {
        return options.every(
          (opt) => opt.trim().length === 0 || (opt.length >= 1 && opt.length <= 500)
        );
      },
      { message: "Each option must be between 1 and 500 characters" }
    ),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

// ===== True/False Schema =====
const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("true-false"),
  options: z.array(z.string()).length(2).default(["True", "False"]),
  correctAnswer: z.enum(["True", "False"]),
});

// ===== Descriptive Schema =====
const descriptiveSchema = baseQuestionSchema.extend({
  type: z.literal("descriptive"),
  correctAnswer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(5000, "Answer must not exceed 5000 characters"),
});

// ===== Fill Blanks Schema =====
const fillBlanksSchema = baseQuestionSchema.extend({
  type: z.literal("fill-blanks"),
  correctAnswer: z
    .array(z.string().min(1, "Blank answer cannot be empty"))
    .min(1, "At least one blank answer required")
    .max(20, "Maximum 20 blanks allowed"),
});

// ===== File Upload Schema =====
const fileUploadSchema = baseQuestionSchema.extend({
  type: z.literal("file-upload"),
  correctAnswer: z
    .string()
    .min(1, "File format/instructions are required")
    .max(500, "File format must not exceed 500 characters"),
});

// ===== Coding Schema =====
const codingSchema = baseQuestionSchema.extend({
  type: z.literal("coding"),
  correctAnswer: z
    .string()
    .min(10, "Expected output/solution must be at least 10 characters")
    .max(5000, "Solution must not exceed 5000 characters"),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Test case input is required"),
        output: z.string().min(1, "Test case output is required"),
      })
    )
    .min(1, "At least one test case required")
    .max(10, "Maximum 10 test cases allowed")
    .optional(),
});

// ===== Union Schema =====
export const questionFormSchema = z.discriminatedUnion("type", [
  mcqSchema,
  trueFalseSchema,
  descriptiveSchema,
  fillBlanksSchema,
  fileUploadSchema,
  codingSchema,
]);

// ===== Type Inference =====
export type QuestionFormData = z.infer<typeof questionFormSchema>;

// ===== Validation Helper =====
export const validateQuestion = (data: unknown): {
  success: boolean;
  data?: QuestionFormData;
  errors?: z.ZodError;
} => {
  const result = questionFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};

