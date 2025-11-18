"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ExamsList from "./components/ExamsList";

export default function ExamsPage() {
  const router = useRouter();

  const handleViewExam = (examId: string) => {
    router.push(`/exam-portal/exams/${examId}`);
  };

  const handleEditExam = (examId: string) => {
    // TODO: Navigate to edit page or open edit dialog
    toast.info("Edit exam functionality coming soon");
  };

  const handleDeleteExam = (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      // TODO: Replace with actual API call
      console.log("Deleting exam:", examId);
      toast.success("Exam deleted successfully!");
    }
  };

  const handleTakeExam = (examId: string) => {
    router.push(`/exam-portal/take-exam/${examId}`);
  };

  return (
    <ExamsList
      onViewExam={handleViewExam}
      onEditExam={handleEditExam}
      onDeleteExam={handleDeleteExam}
      onTakeExam={handleTakeExam}
    />
  );
}

