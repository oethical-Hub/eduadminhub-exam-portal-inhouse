"use client";

import { Question } from "@/types/question";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";

interface FileUploadAnswerInputProps {
  question: Question;
  answer: string | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

export default function FileUploadAnswerInput({
  question,
  answer,
  onAnswerChange,
}: FileUploadAnswerInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload file and get URL
      // For now, store file name
      onAnswerChange(file.name);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Upload your file:</Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
          </p>
        </label>
      </div>
      {answer && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
          <File className="h-4 w-4" />
          <span className="text-sm">{answer}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onAnswerChange("")}
            className="ml-auto"
          >
            Remove
          </Button>
        </div>
      )}
      {question.correctAnswer && (
        <p className="text-sm text-muted-foreground">
          Instructions: {question.correctAnswer}
        </p>
      )}
    </div>
  );
}

