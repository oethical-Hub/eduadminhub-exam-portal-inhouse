"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Link as LinkIcon, Zap, CheckCircle2 } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="page-container relative">
      {/* Header with Back Button and Theme Toggle - Fixed at top */}
      <div className="page-top-navigation">
        <Button asChild variant="ghost" className="nav-back-button">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <div className="page-wrapper">
        {/* Main Content */}
        <div className="coming-soon-content">
          <div className="coming-soon-hero">
            <h1 className="coming-soon-title">
              Choose Your Solution
            </h1>
            <p className="coming-soon-subtitle">
              Select how you want to use EduAdminHub Exam Portal
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standalone Solution */}
            <Card className="solution-card solution-card-green">
              <CardHeader>
                <div className="solution-icon-container">
                  <div className="solution-icon-circle solution-icon-green">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Standalone Solution</CardTitle>
                    <Badge variant="default" className="mt-2 bg-green-500 hover:bg-green-600">
                      Available
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Works independently as a complete examination system for any institution
                </CardDescription>
              </CardHeader>
              <CardContent className="section-container">
                <div className="feature-list">
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>No dependency on other platforms</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Complete feature set included</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Your own backend (Node.js + MongoDB)</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Perfect for schools and colleges</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/login?mode=standalone">Login with Standalone</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* EduAdminHub Integration */}
            <Card className="solution-card solution-card-blue">
              <CardHeader>
                <div className="solution-icon-container">
                  <div className="solution-icon-circle solution-icon-blue">
                    <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">EduAdminHub Integration</CardTitle>
                    <Badge variant="default" className="mt-2 bg-blue-500 hover:bg-blue-600">
                      Available
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Seamlessly integrate with EduAdminHub platform for unified student management
                </CardDescription>
              </CardHeader>
              <CardContent className="section-container">
                <div className="feature-list">
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Auto-sync student records</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>View exam results in EduAdminHub</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Generate report cards automatically</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="feature-icon" />
                    <span>Sync with attendance system</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link href="/login?mode=integrated">Login with EduAdminHub</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
