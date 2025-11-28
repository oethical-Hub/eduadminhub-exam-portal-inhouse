"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, Mail, Zap, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getRedirectRoute } from "@/utils/getRedirectRoute";
import PasswordInput from "./PasswordInput";
import Footer from "@/components/common/Footer";

// Validation Schema
import { standaloneLoginSchema, type StandaloneLoginFormData } from "@/lib/validations/auth";

// Dummy authentication for testing (remove when API is ready)
import { authenticateUser } from "@/data/dummyUsers";

// Set to true to use dummy data, false to use real API
const USE_DUMMY_DATA = true;

/**
 * Standalone Login Form
 * 
 * Simple email + password login for standalone mode
 * Uses react-hook-form with Zod validation
 */
export default function StandaloneLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StandaloneLoginFormData>({
    resolver: zodResolver(standaloneLoginSchema),
    mode: "onBlur", // Validate on blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: StandaloneLoginFormData) => {
    try {
      setLoading(true);

      let response;

      if (USE_DUMMY_DATA) {
        // Use dummy data for testing
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
        response = authenticateUser(data.email, data.password);
      } else {
        // Use real API (uncomment when backend is ready)
        // const apiResponse = await api.post("/auth/login", { 
        //   email: data.email, 
        //   password: data.password 
        // });
        // response = {
        //   success: apiResponse.success,
        //   message: apiResponse.message,
        //   data: apiResponse.data,
        // };
        toast.error("API not configured yet. Using dummy data.");
        return;
      }

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Login with standalone mode (institutionId = "standalone")
        login(token, user, "standalone", "Standalone Mode");

        toast.success(`Welcome ${user.firstName} ${user.lastName}!`);

        // Redirect based on role
        setTimeout(() => {
          router.replace(getRedirectRoute(user.role));
        }, 100);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <Card className="login-card">
        <CardHeader className="login-card-header">
          <div className="login-icon-container">
            <div className="standalone-login-icon-circle">
              <Zap className="standalone-login-icon" />
            </div>
          </div>
          <CardTitle className="login-title">Standalone Login</CardTitle>
          <CardDescription>Sign in with your email and password</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Test Credentials Info */}
          {USE_DUMMY_DATA && (
            <div className="info-box info-box-blue mb-4">
              <div className="flex-start gap-2">
                <Info className="info-box-icon info-box-icon-blue" />
                <div className="text-sm">
                  <p className="info-box-title info-box-title-blue">Test Credentials:</p>
                  <div className="info-box-content-blue">
                    <p>Admin: <code className="info-box-code">admin@school.com</code> / <code className="info-box-code">admin123</code></p>
                    <p>Teacher: <code className="info-box-code">teacher@school.com</code> / <code className="info-box-code">teacher123</code></p>
                    <p>Student: <code className="info-box-code">student@school.com</code> / <code className="info-box-code">student123</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-section">
            {/* Email Field */}
            <div className="form-field-group">
              <Label htmlFor="email">Email</Label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`input-field-with-icon ${errors.email ? "input-error" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-field-group">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "input-error" : ""}
                error={errors.password?.message}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="remember"
                  className="checkbox-input"
                />
                <Label htmlFor="remember" className="checkbox-label">
                  Remember Me
                </Label>
              </div>
              <Link href="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="btn-standalone" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="btn-icon" />
                  Sign In
                </>
              )}
            </Button>

            {/* Switch to EduAdminHub */}
            <div className="divider-with-text">
              <p className="divider-text">
                Want to use EduAdminHub instead?{" "}
                <Link href="/login?mode=integrated" className="divider-link">
                  Login with EduAdminHub
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
