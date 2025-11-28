"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Institution } from "@/types/institution";
import LoginForm from "@/components/login/LoginForm";
import StandaloneLoginForm from "@/components/login/StandaloneLoginForm";

export default function LoginPage() {
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
      const response = await api.get<Institution[]>("/getListInstitute/getSpecificList");
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
    </div>
  );
}
