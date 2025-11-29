"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { integratedApi } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";
import Footer from "@/components/common/Footer";

// Email validation pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate email field
  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return "Email is required.";
    }
    if (!emailPattern.test(value.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  // Handle input change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      const emailError = validateEmail(value);
      setError(emailError);
    }
  };

  // Handle blur
  const handleBlur = () => {
    const emailError = validateEmail(email);
    setError(emailError);
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    if (!email.trim()) return false;
    if (error) return false;
    return emailPattern.test(email.trim());
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email before submit
    const emailError = validateEmail(email);
    setError(emailError);

    if (emailError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);

      const response = await integratedApi.post(
        API_ENDPOINTS.auth.forgotPassword,
        { email: email.trim() }
      );

      if (response.success) {
        toast.success(
          response.message ||
            "If an account with that email exists, a reset link has been sent."
        );
        setEmail("");
        setError("");
      } else {
        toast.error(response.message || "Failed to send reset link");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      toast.error(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <Card className="login-card">
        <CardHeader className="login-card-header">
          <CardTitle className="login-title">Forgot Password?</CardTitle>
          <CardDescription>
            If you forgot your password, well, then we'll email you instructions
            to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReset} className="form-section">
            <div className="form-field-group">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleBlur}
                  className={cn(
                    "input-field-with-icon",
                    error && "border-destructive focus-visible:border-destructive"
                  )}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="forgot-password-link"
              >
                <ArrowLeft className="inline h-4 w-4 mr-1" />
                Return to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}

