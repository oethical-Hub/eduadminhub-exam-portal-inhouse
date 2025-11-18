"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import {
  examFormSchema,
  type ExamFormData,
} from "@/lib/validations/exam";
import { Question } from "@/types/question";
import { dummyQuestions } from "@/data/dummyQuestions";
import { toast } from "react-toastify";

interface CreateExamFormProps {
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Information", description: "Exam details" },
  { id: 2, title: "Exam Settings", description: "Duration, marks, etc." },
  { id: 3, title: "Question Selection", description: "Select questions" },
  { id: 4, title: "Scheduling", description: "Start and end dates" },
  { id: 5, title: "Advanced Settings", description: "Randomization, proctoring" },
];

export default function CreateExamForm({ onSuccess }: CreateExamFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>(dummyQuestions);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      class: "",
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      negativeMarking: false,
      negativeMarkingValue: 0,
      questionIds: [],
      startDate: "",
      endDate: "",
      randomizeQuestions: false,
      randomizeOptions: false,
      proctoringEnabled: false,
    } as ExamFormData,
  });

  // Watch form values
  const negativeMarking = watch("negativeMarking");
  const questionIds = watch("questionIds");

  // Update selectedQuestions when questionIds changes
  useEffect(() => {
    setSelectedQuestions(questionIds || []);
  }, [questionIds]);

  // Filter questions based on search
  const filteredQuestions = availableQuestions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (questionId: string) => {
    const newSelected = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter((id) => id !== questionId)
      : [...selectedQuestions, questionId];
    
    setSelectedQuestions(newSelected);
    setValue("questionIds", newSelected);
  };

  const calculateTotalMarks = () => {
    return selectedQuestions.reduce((total, id) => {
      const question = availableQuestions.find((q) => q.id === id);
      return total + (question?.marks || 0);
    }, 0);
  };

  const onSubmit: SubmitHandler<ExamFormData> = async (data) => {
    try {
      // TODO: Replace with actual API call
      console.log("Exam data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Exam created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error("Failed to create exam. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(watch("title") && watch("subject") && watch("class"));
      case 2:
        return !!(watch("duration") && watch("totalMarks") && watch("passingMarks"));
      case 3:
        return selectedQuestions.length > 0;
      case 4:
        return !!(watch("startDate") && watch("endDate"));
      case 5:
        return true; // Advanced settings are optional
      default:
        return false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep === step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : currentStep > step.id
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for your exam</CardDescription>
          </CardHeader>
          <CardContent className="form-section space-y-4">
            <div className="form-field-group">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Mathematics Midterm Exam"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="form-field-group">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter exam description (optional)"
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-field-group">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="e.g., Mathematics"
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>

              <div className="form-field-group">
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  {...register("class")}
                  placeholder="e.g., Grade 10, Class A"
                  className={errors.class ? "border-destructive" : ""}
                />
                {errors.class && (
                  <p className="text-sm text-destructive">{errors.class.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Exam Settings */}
      {currentStep === 2 && (
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Exam Settings</CardTitle>
            <CardDescription>Configure exam duration, marks, and grading</CardDescription>
          </CardHeader>
          <CardContent className="form-section space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-field-group">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="60"
                  min={5}
                  max={600}
                  className={errors.duration ? "border-destructive" : ""}
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration.message}</p>
                )}
              </div>

              <div className="form-field-group">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  {...register("totalMarks", { valueAsNumber: true })}
                  placeholder="100"
                  min={1}
                  max={1000}
                  className={errors.totalMarks ? "border-destructive" : ""}
                />
                {errors.totalMarks && (
                  <p className="text-sm text-destructive">{errors.totalMarks.message}</p>
                )}
              </div>
            </div>

            <div className="form-field-group">
              <Label htmlFor="passingMarks">Passing Marks *</Label>
              <Input
                id="passingMarks"
                type="number"
                {...register("passingMarks", { valueAsNumber: true })}
                placeholder="40"
                min={0}
                max={1000}
                className={errors.passingMarks ? "border-destructive" : ""}
              />
              {errors.passingMarks && (
                <p className="text-sm text-destructive">{errors.passingMarks.message}</p>
              )}
            </div>

            <div className="form-field-group">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negativeMarking"
                  checked={negativeMarking}
                  onCheckedChange={(checked) => setValue("negativeMarking", checked as boolean)}
                />
                <Label htmlFor="negativeMarking" className="cursor-pointer">
                  Enable Negative Marking
                </Label>
              </div>
              {negativeMarking && (
                <div className="mt-2">
                  <Input
                    type="number"
                    {...register("negativeMarkingValue", { valueAsNumber: true })}
                    placeholder="Negative marks per wrong answer"
                    min={0}
                    max={10}
                    step={0.5}
                    className={errors.negativeMarkingValue ? "border-destructive" : ""}
                  />
                  {errors.negativeMarkingValue && (
                    <p className="text-sm text-destructive">
                      {errors.negativeMarkingValue.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Question Selection */}
      {currentStep === 3 && (
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Question Selection</CardTitle>
            <CardDescription>
              Select questions from your question bank ({selectedQuestions.length} selected, Total
              Marks: {calculateTotalMarks()})
            </CardDescription>
          </CardHeader>
          <CardContent className="form-section space-y-4">
            <div className="form-field-group">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No questions found</p>
              ) : (
                <div className="space-y-2">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedQuestions.includes(question.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                            <Badge variant="outline">{question.difficulty}</Badge>
                            <Badge variant="outline">{question.category}</Badge>
                            <span className="text-sm text-gray-600">
                              {question.marks} {question.marks === 1 ? "mark" : "marks"}
                            </span>
                          </div>
                          <p className="text-sm font-medium line-clamp-2">{question.question}</p>
                        </div>
                        {selectedQuestions.includes(question.id) && (
                          <CheckCircle2 className="h-5 w-5 text-blue-500 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.questionIds && (
              <p className="text-sm text-destructive">{errors.questionIds.message}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Scheduling */}
      {currentStep === 4 && (
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Exam Scheduling</CardTitle>
            <CardDescription>Set the start and end dates for your exam</CardDescription>
          </CardHeader>
          <CardContent className="form-section space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-field-group">
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register("startDate")}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="form-field-group">
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register("endDate")}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Advanced Settings */}
      {currentStep === 5 && (
        <Card className="card-container">
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Configure additional exam options</CardDescription>
          </CardHeader>
          <CardContent className="form-section space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="randomizeQuestions"
                  checked={watch("randomizeQuestions")}
                  onCheckedChange={(checked) =>
                    setValue("randomizeQuestions", checked as boolean)
                  }
                />
                <Label htmlFor="randomizeQuestions" className="cursor-pointer">
                  Randomize Question Order
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="randomizeOptions"
                  checked={watch("randomizeOptions")}
                  onCheckedChange={(checked) => setValue("randomizeOptions", checked as boolean)}
                />
                <Label htmlFor="randomizeOptions" className="cursor-pointer">
                  Randomize Option Order (for MCQ)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proctoringEnabled"
                  checked={watch("proctoringEnabled")}
                  onCheckedChange={(checked) => setValue("proctoringEnabled", checked as boolean)}
                />
                <Label htmlFor="proctoringEnabled" className="cursor-pointer">
                  Enable AI Proctoring
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Exam"}
          </Button>
        )}
      </div>
    </form>
  );
}

