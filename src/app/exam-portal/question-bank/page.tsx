"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import QuestionList from "./components/QuestionList";
import QuestionFormDialog from "./components/QuestionFormDialog";
import { Question } from "@/types/question";
import { dummyQuestions } from "@/data/dummyQuestions";

export default function QuestionBankPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    if (window.confirm(`Are you sure you want to delete this question?\n\n"${question.question.substring(0, 50)}..."`)) {
      // TODO: Replace with actual API call
      console.log("Deleting question:", question.id);
      toast.success("Question deleted successfully!");
      // In real implementation, refresh the list here
    }
  };

  const handleFormSuccess = () => {
    // TODO: Replace with actual API call to refresh list
    toast.success(editingQuestion ? "Question updated!" : "Question created!");
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  return (
    <>
      <QuestionList
        onAddQuestion={handleAddQuestion}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
      />
      <QuestionFormDialog
        open={isFormOpen}
        question={editingQuestion}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
