"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, Mail, Building2, Shield, ArrowLeft } from "lucide-react";
import { integratedApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Institution } from "@/types/institution";
import { User } from "@/types/auth";
import { getRedirectRoute } from "@/utils/getRedirectRoute";
import PasswordInput from "./PasswordInput";
import Footer from "@/components/common/Footer";

type LoginStep = "institution" | "credentials" | "otp";

interface LoginFormProps {
  institutions: Institution[];
  loading: boolean;
  onInstitutionSelect: (institution: Institution) => void;
  selectedInstitution: Institution | null;
  onBack: () => void;
}

export default function LoginForm({
  institutions,
  loading,
  onInstitutionSelect,
  selectedInstitution,
  onBack,
}: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<LoginStep>("institution");

  //==== Credentials
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [credentialsLoading, setCredentialsLoading] = useState<boolean>(false);

  //==== OTP
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const handleInstitutionSelect = (institution: Institution) => {
    onInstitutionSelect(institution);
    setStep("credentials");
  };

  const handleCredentialsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedInstitution || !username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setCredentialsLoading(true);

      const response = await integratedApi.post(
        "/loginUser/userId",
        {
          username,
          password,
        },
        null,
        selectedInstitution.institutionId
      );

      if (response.success) {
        setOtpSent(true);
        setStep("otp");
        toast.success(response.message || "OTP sent to your email");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setCredentialsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!selectedInstitution) {
      toast.error("Institution not selected");
      return;
    }

    try {
      setOtpLoading(true);

      const response = await integratedApi.post(
        "/loginUser/verifyOtp",
        {
          otp,
        },
        null,
        selectedInstitution.institutionId
      );

      if (response.success && response.user && response.auth && selectedInstitution) {
        const user: User = response.user;
        login(response.auth, user, selectedInstitution.institutionId, selectedInstitution.name);
        toast.success(`Welcome ${user.firstName} ${user.lastName}!`);

        setTimeout(() => {
          router.replace(getRedirectRoute(user.role));
        }, 100);
      } else {
        toast.error(response.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("credentials");
      setOtp("");
      setOtpSent(false);
    } else if (step === "credentials") {
      setStep("institution");
      setUsername("");
      setPassword("");
      onBack();
    }
  };

  return (
    <div className="login-form-wrapper">
    <Card className="login-card">
      <CardHeader className="login-card-header">
        <div className="login-icon-container">
          <div className="login-icon-circle">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="login-title">EduAdminHub Exam Portal</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
        {/*================ Institution Selection Step ==================*/}
        {step === "institution" && (
          <div className="form-section">
            <div className="flex-start mb-4">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <Label className="text-base font-semibold">Select Institution</Label>
            </div>

            {loading && institutions.length === 0 ? (
              <div className="loading-container">
                <Loader2 className="loading-spinner" />
              </div>
            ) : (
              <div className="institution-list">
                {institutions.map((institution) => (
                  <button
                    key={institution._id}
                    onClick={() => handleInstitutionSelect(institution)}
                    className="institution-item"
                  >
                    <div className="font-medium">{institution.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {institution.institutionId}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {institutions.length === 0 && !loading && (
              <div className="empty-state">
                No institutions found
              </div>
            )}
          </div>
        )}

        {/*================ Credentials Step ===========================*/}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="form-section">
            <div className="form-row mb-4">
              <div className="form-row-start">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-semibold">
                  {selectedInstitution?.name}
                </Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-xs"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Change
              </Button>
            </div>

            <div className="form-field-group">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field-with-icon"
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember Me
                </Label>
              </div>
              <a
                href="/forgot-password"
                className="forgot-password-link"
              >
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={credentialsLoading}>
              {credentialsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        )}

        {/*================ OTP Verification Step =====================*/}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="form-section">
            <div className="text-center mb-4">
              <div className="flex-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <Label className="text-base font-semibold">Verify OTP</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {otpSent
                  ? "OTP has been sent to your email. Please check your inbox."
                  : "Enter the OTP sent to your email"}
              </p>
            </div>

            <div className="form-field-group">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="otp-input"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={otpLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={otpLoading || otp.length !== 6}>
                {otpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
    <Footer />
    </div>
  );
}

