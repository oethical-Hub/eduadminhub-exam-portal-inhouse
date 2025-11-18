"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import {
  questionFormSchema,
  QuestionFormData,
} from "@/lib/validations/question";
import { Question } from "@/types/question";
import { toast } from "react-toastify";

interface QuestionFormDialogProps {
  readonly open: boolean;
  readonly question: Question | null;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export default function QuestionFormDialog({
  open,
  question,
  onClose,
  onSuccess,
}: QuestionFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      type: "mcq",
      question: "",
      marks: 1,
      negativeMarks: 0,
      difficulty: "easy",
      category: "",
      tags: [],
      explanation: "",
      options: ["", ""],
      correctAnswer: "",
    } as QuestionFormData,
  });

  const questionType = watch("type");
  const options = (questionType === "mcq" || questionType === "true-false")
    ? (watch("options") as string[] | undefined) || []
    : [];
  const tags = watch("tags") || [];
  const tagInput = watch("tagInput" as any) || "";

  // Reset form when question changes
  useEffect(() => {
    if (question && open) {
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : question.correctAnswer;
      reset({
        type: question.type,
        question: question.question,
        marks: question.marks,
        negativeMarks: question.negativeMarks || 0,
        difficulty: question.difficulty,
        category: question.category,
        tags: question.tags || [],
        explanation: question.explanation || "",
        options: question.options || (question.type === "true-false" ? ["True", "False"] : ["", ""]),
        correctAnswer: correctAnswer as any,
      });
    } else if (open) {
      reset({
        type: "mcq",
        question: "",
        marks: 1,
        negativeMarks: 0,
        difficulty: "easy",
        category: "",
        tags: [],
        explanation: "",
        options: ["", ""],
        correctAnswer: "",
      });
    }
  }, [question, open, reset]);

  const onSubmit: SubmitHandler<QuestionFormData> = async (data) => {
    try {
      // TODO: Replace with actual API call
      console.log("Question data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success(
        question ? "Question updated successfully!" : "Question created successfully!"
      );
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question. Please try again.");
    }
  };

  const handleAddOption = () => {
    if (options.length < 10) {
      setValue("options", [...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setValue("options", newOptions);
      // Clear correct answer if it was the removed option
      if (watch("correctAnswer") === options[index]) {
        setValue("correctAnswer", "");
      }
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && tags.length < 10 && !tags.includes(trimmedTag)) {
      setValue("tags", [...tags, trimmedTag]);
      setValue("tagInput" as any, "");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddBlank = () => {
    const currentAnswer = watch("correctAnswer");
    if (Array.isArray(currentAnswer)) {
      if (currentAnswer.length < 20) {
        setValue("correctAnswer", [...currentAnswer, ""] as any);
      }
    } else {
      setValue("correctAnswer", [""] as any);
    }
  };

  const handleRemoveBlank = (index: number) => {
    const currentAnswer = watch("correctAnswer");
    if (Array.isArray(currentAnswer) && currentAnswer.length > 1) {
      const newAnswer = currentAnswer.filter((_, i) => i !== index);
      setValue("correctAnswer", newAnswer as any);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {question ? "Edit Question" : "Create New Question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Question Type *</Label>
            <Select
              value={questionType}
              onValueChange={(value) => {
                setValue("type", value as any);
                // Reset options and answer based on type
                if (value === "true-false") {
                  setValue("options", ["True", "False"]);
                  setValue("correctAnswer", "");
                } else if (value === "mcq") {
                  setValue("options", ["", ""]);
                  setValue("correctAnswer", "");
                } else if (value === "fill-blanks") {
                  setValue("correctAnswer", [""] as any);
                } else {
                  setValue("correctAnswer", "");
                }
              }}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="descriptive">Descriptive</SelectItem>
                <SelectItem value="fill-blanks">Fill in the Blanks</SelectItem>
                <SelectItem value="file-upload">File Upload</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              {...register("question")}
              placeholder="Enter your question here..."
              rows={4}
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question.message}</p>
            )}
          </div>

          {/* Options for MCQ and True/False */}
          {(questionType === "mcq" || questionType === "true-false") && (
            <div className="space-y-2">
              <Label>Options *</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    {...register(`options.${index}` as any)}
                    placeholder={`Option ${index + 1}`}
                    className={
                      errors.options &&
                      typeof errors.options === "object" &&
                      !("message" in errors.options) &&
                      index in errors.options
                        ? "border-destructive"
                        : ""
                    }
                    disabled={questionType === "true-false"}
                  />
                  {questionType === "mcq" && options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {questionType === "mcq" && options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
              {errors.options && typeof errors.options === "object" && "message" in errors.options && (
                <p className="text-sm text-destructive">{errors.options.message as string}</p>
              )}
            </div>
          )}

          {/* Correct Answer */}
          <div className="space-y-2">
            <Label htmlFor="correctAnswer">
              {questionType === "mcq" || questionType === "true-false"
                ? "Correct Answer *"
                : questionType === "fill-blanks"
                ? "Correct Answers (for each blank) *"
                : questionType === "file-upload"
                ? "File Format/Instructions *"
                : questionType === "coding"
                ? "Expected Output/Solution *"
                : "Correct Answer *"}
            </Label>

            {questionType === "mcq" && (
              <Select
                value={watch("correctAnswer") as string}
                onValueChange={(value) => setValue("correctAnswer", value)}
              >
                <SelectTrigger id="correctAnswer" className={errors.correctAnswer ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((opt) => opt.trim().length > 0)
                    .map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            {questionType === "true-false" && (
              <Select
                value={watch("correctAnswer") as string}
                onValueChange={(value) => setValue("correctAnswer", value)}
              >
                <SelectTrigger id="correctAnswer" className={errors.correctAnswer ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select True or False" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">True</SelectItem>
                  <SelectItem value="False">False</SelectItem>
                </SelectContent>
              </Select>
            )}

            {questionType === "fill-blanks" && (
              <div className="space-y-2">
                {(() => {
                  const answers = watch("correctAnswer");
                  const answerArray = Array.isArray(answers) ? answers : [""];
                  return answerArray.map((answer, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        {...register(`correctAnswer.${index}` as any)}
                        placeholder={`Answer for blank ${index + 1}`}
                        className={
                          errors.correctAnswer && typeof errors.correctAnswer === "object" && index in errors.correctAnswer
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {answerArray.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBlank(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ));
                })()}
                {(() => {
                  const answers = watch("correctAnswer");
                  const answerArray = Array.isArray(answers) ? answers : [""];
                  return answerArray.length < 20 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddBlank}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blank
                    </Button>
                  ) : null;
                })()}
                {errors.correctAnswer && typeof errors.correctAnswer === "object" && "message" in errors.correctAnswer && (
                  <p className="text-sm text-destructive">{errors.correctAnswer.message as string}</p>
                )}
              </div>
            )}

            {(questionType === "descriptive" ||
              questionType === "file-upload" ||
              questionType === "coding") && (
              <Textarea
                {...register("correctAnswer" as any)}
                placeholder={
                  questionType === "file-upload"
                    ? "e.g., PDF format, maximum 5MB, should include..."
                    : questionType === "coding"
                    ? "Expected output or solution code..."
                    : "Enter the correct answer..."
                }
                rows={questionType === "coding" ? 8 : 4}
                className={errors.correctAnswer ? "border-destructive" : ""}
              />
            )}

            {errors.correctAnswer && (
              <p className="text-sm text-destructive">
                {typeof errors.correctAnswer === "object" && "message" in errors.correctAnswer
                  ? errors.correctAnswer.message
                  : "Correct answer is required"}
              </p>
            )}
          </div>

          {/* Marks and Negative Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks *</Label>
              <Input
                id="marks"
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                {...register("marks", { valueAsNumber: true, required: true })}
                className={errors.marks ? "border-destructive" : ""}
              />
              {errors.marks && (
                <p className="text-sm text-destructive">{errors.marks.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="negativeMarks">Negative Marks</Label>
              <Input
                id="negativeMarks"
                type="number"
                step="0.5"
                min="0"
                max="10"
                {...register("negativeMarks", { valueAsNumber: true, required: false })}
                className={errors.negativeMarks ? "border-destructive" : ""}
              />
              {errors.negativeMarks && (
                <p className="text-sm text-destructive">{errors.negativeMarks.message}</p>
              )}
            </div>
          </div>

          {/* Difficulty and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={watch("difficulty")}
                onValueChange={(value) => setValue("difficulty", value as any)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-destructive">{errors.difficulty.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g., Mathematics, Science"
                className={errors.category ? "border-destructive" : ""}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tagInput"
                placeholder="Enter tag and press Add"
                value={tagInput}
                onChange={(e) => setValue("tagInput" as any, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                maxLength={50}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={tags.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              {...register("explanation")}
              placeholder="Explain why this is the correct answer..."
              rows={3}
              className={errors.explanation ? "border-destructive" : ""}
            />
            {errors.explanation && (
              <p className="text-sm text-destructive">{errors.explanation.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : question ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

