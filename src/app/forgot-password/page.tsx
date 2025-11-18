"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="page-container relative">
      {/* Back to Home Navigation */}
      <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="ghost" size="sm" className="nav-back-button">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

