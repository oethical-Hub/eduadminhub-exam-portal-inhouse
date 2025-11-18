"use client";

import { useRouter } from "next/navigation";
import CreateExamForm from "./components/CreateExamForm";

export default function CreateExamPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/exam-portal/exams");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Create New Exam</h1>
        <p className="dashboard-subtitle">Set up a new examination step by step</p>
      </div>

      <CreateExamForm onSuccess={handleSuccess} />
    </div>
  );
}

