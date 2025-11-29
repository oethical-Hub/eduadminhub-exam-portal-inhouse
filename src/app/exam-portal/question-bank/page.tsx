"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import QuestionList from "./components/QuestionList";
import QuestionFormDialog from "./components/QuestionFormDialog";
import { Question } from "@/types/question";
import { questionBankApi } from "@/lib/api/questionBank";
import { useAuth } from "@/context/AuthContext";

export default function QuestionBankPage() {
  const { token, institutionId } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger list refresh

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleDeleteQuestion = async (question: Question) => {
    if (!token || !institutionId) {
      toast.error("Authentication required. Please log in.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete this question?\n\n"${question.question.substring(0, 50)}..."`)) {
      try {
        await questionBankApi.delete(question.id, token, institutionId);
        toast.success("Question deleted successfully!");
        // Trigger refresh by updating key
        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        console.error("Error deleting question:", error);
        toast.error(error.message || "Failed to delete question. Please try again.");
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
    // Trigger refresh by updating key
    setRefreshKey((prev) => prev + 1);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  return (
    <>
      <QuestionList
        refreshKey={refreshKey}
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
