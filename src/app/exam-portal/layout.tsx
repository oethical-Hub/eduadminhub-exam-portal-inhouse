import { ReactNode } from "react";
import Header from "@/components/custom/Header";

interface ExamPortalLayoutProps {
  children: ReactNode;
}

export default function ExamPortalLayout({ children }: ExamPortalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <div className="page-wrapper">
        {children}
      </div>
    </div>
  );
}

