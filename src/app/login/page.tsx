"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Institution } from "@/types/institution";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Fetch institutions on mount
  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await api.get<Institution[]>("/getListInstitute/getSpecificList");
      if (response.success && response.data) {
        setInstitutions(response.data);
      } else {
        toast.error(response.message || "Failed to fetch institutions");
      }
    } catch (error: any) {
      console.error("Error fetching institutions:", error);
      toast.error(error.message || "Failed to fetch institutions");
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

      <LoginForm
        institutions={institutions}
        loading={loading}
        onInstitutionSelect={handleInstitutionSelect}
        selectedInstitution={selectedInstitution}
        onBack={handleBack}
      />
    </div>
  );
}
