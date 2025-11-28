"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { integratedApi } from "@/lib/api";
import { Institution } from "@/types/institution";
import LoginForm from "@/components/login/LoginForm";
import StandaloneLoginForm from "@/components/login/StandaloneLoginForm";

/**
 * Login Content Component
 * Separated to use useSearchParams inside Suspense boundary
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "standalone" or "integrated" or null

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Check if standalone mode from query param
  const isStandaloneMode = mode === "standalone";

  // Fetch institutions only for integrated mode
  useEffect(() => {
    if (!isStandaloneMode) {
      fetchInstitutions();
    }
  }, [isStandaloneMode]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await integratedApi.get<Institution[]>("/getListInstitute/getSpecificList");
      if (response.success && response.data) {
        setInstitutions(response.data);
      } else {
        toast.error(response.message || "Failed to fetch institutions");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error fetching institutions:", err);
      toast.error(err.message || "Failed to fetch institutions");
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const handleBack = () => {
    setSelectedInstitution(null);
  };

  return (
    <>
      {/* Render form based on query param mode */}
      {isStandaloneMode ? (
        // Standalone Mode: Simple email + password login
        <StandaloneLoginForm />
      ) : (
        // Integrated Mode: Institution + OTP login
        <LoginForm
          institutions={institutions}
          loading={loading}
          onInstitutionSelect={handleInstitutionSelect}
          selectedInstitution={selectedInstitution}
          onBack={handleBack}
        />
      )}
    </>
  );
}

/**
 * Loading Fallback Component
 */
function LoginLoading() {
  return (
    <div className="login-form-wrapper">
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Login Page
 * Wrapped with Suspense for useSearchParams compatibility in Next.js 15
 */
export default function LoginPage() {
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

      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={<LoginLoading />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
