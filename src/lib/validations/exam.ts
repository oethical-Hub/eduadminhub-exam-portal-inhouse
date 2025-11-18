import { z } from "zod";

// ===== Exam Form Schema =====
export const examFormSchema = z.object({
  // Basic Information
  title: z
    .string()
    .min(5, "Exam title must be at least 5 characters")
    .max(200, "Exam title must not exceed 200 characters")
    .regex(/^[^<>]*$/, "Title cannot contain < or > characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject must not exceed 100 characters"),
  class: z
    .string()
    .min(1, "Class is required")
    .max(50, "Class must not exceed 50 characters"),

  // Exam Settings
  duration: z.coerce
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number",
    })
    .min(5, "Duration must be at least 5 minutes")
    .max(600, "Duration cannot exceed 600 minutes (10 hours)"),
  totalMarks: z.coerce
    .number({
      required_error: "Total marks is required",
      invalid_type_error: "Total marks must be a number",
    })
    .min(1, "Total marks must be at least 1")
    .max(1000, "Total marks cannot exceed 1000"),
  passingMarks: z.coerce
    .number({
      required_error: "Passing marks is required",
      invalid_type_error: "Passing marks must be a number",
    })
    .min(0, "Passing marks cannot be negative")
    .max(1000, "Passing marks cannot exceed 1000"),
  negativeMarking: z.boolean().default(false),
  negativeMarkingValue: z.coerce
    .number({
      invalid_type_error: "Negative marking value must be a number",
    })
    .min(0, "Negative marking value cannot be negative")
    .max(10, "Negative marking value cannot exceed 10")
    .optional()
    .default(0),

  // Question Selection
  questionIds: z
    .array(z.string())
    .min(1, "At least one question must be selected")
    .refine(
      (ids) => ids.length > 0,
      { message: "Please select at least one question" }
    ),

  // Scheduling
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (date) => {
        const start = new Date(date);
        const now = new Date();
        return start >= now;
      },
      { message: "Start date must be in the future" }
    ),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine(
      (date) => {
        const end = new Date(date);
        const now = new Date();
        return end >= now;
      },
      { message: "End date must be in the future" }
    ),

  // Advanced Settings
  randomizeQuestions: z.boolean().default(false),
  randomizeOptions: z.boolean().default(false),
  proctoringEnabled: z.boolean().default(false),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    if (data.negativeMarking) {
      return data.negativeMarkingValue !== undefined && data.negativeMarkingValue > 0;
    }
    return true;
  },
  {
    message: "Negative marking value is required when negative marking is enabled",
    path: ["negativeMarkingValue"],
  }
).refine(
  (data) => {
    return data.passingMarks <= data.totalMarks;
  },
  {
    message: "Passing marks cannot exceed total marks",
    path: ["passingMarks"],
  }
);

// ===== Type Inference =====
export type ExamFormData = z.infer<typeof examFormSchema>;

// ===== Validation Helper =====
export const validateExam = (data: unknown): {
  success: boolean;
  data?: ExamFormData;
  errors?: z.ZodError;
} => {
  const result = examFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};

