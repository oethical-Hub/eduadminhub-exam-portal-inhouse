import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  FileQuestion,
  Shield,
  Clock,
  Award,
  CheckCircle2,
  Zap,
  TrendingUp,
  Settings,
  Eye,
  Link as LinkIcon,
  School,
  Building2,
} from "lucide-react";

const VERSION = "2.0.0";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle and Version */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                EduAdminHub Exam Portal
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version {VERSION} • Advanced Examination System
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              <LinkIcon className="h-4 w-4 mr-1" />
              Integrates with EduAdminHub
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1">
              <Zap className="h-4 w-4 mr-1" />
              Standalone Available
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Online
            <span className="text-blue-600 dark:text-blue-400"> Examination Portal</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Conduct secure, automated online exams with AI-powered proctoring, automated grading,
            and comprehensive analytics. Perfect for schools, colleges, and educational institutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/coming-soon">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/exam-portal/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Powerful Features
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need for modern online examinations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-500 dark:hover:border-blue-400">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <FileQuestion className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Question Bank</CardTitle>
                <CardDescription className="text-base">
                  Manage multiple question types (MCQ, True/False, Descriptive, Fill in blanks,
                  File upload, Coding) with categories and difficulty levels. Import/Export
                  functionality for easy question management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-500 dark:hover:border-green-400">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Exam Creation</CardTitle>
                <CardDescription className="text-base">
                  Create and configure exams with custom settings, time limits, marks per question,
                  randomization options, and scheduling. Set passing marks and grading criteria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-purple-500 dark:hover:border-purple-400">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">AI Proctoring</CardTitle>
                <CardDescription className="text-base">
                  Secure exam environment with face detection, screen monitoring alerts, tab
                  switching detection, and automated flagging of suspicious activities. Browser
                  lock features included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-orange-500 dark:hover:border-orange-400">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Analytics & Results</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive performance analytics, detailed reports, class-wise and subject-wise
                  statistics, question difficulty analysis, and performance trends. View all exam
                  results in one place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              More Features
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle>Real-time Timer</CardTitle>
                </div>
                <CardDescription>
                  Countdown timer with warnings and automatic submission on timeout
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle>Auto Grading</CardTitle>
                </div>
                <CardDescription>
                  Instant grading for objective questions with partial marking support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle>Result Viewing</CardTitle>
                </div>
                <CardDescription>
                  View detailed exam results, answer reviews, and performance breakdowns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle>Performance Trends</CardTitle>
                </div>
                <CardDescription>
                  Track student performance over time with comprehensive analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle>Customizable Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure exam settings, grading criteria, and proctoring options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle>Multiple Question Types</CardTitle>
                </div>
                <CardDescription>
                  Support for MCQs, True/False, Descriptive, Fill in blanks, File upload, and Coding
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Integration & Standalone */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl">EduAdminHub Integration</CardTitle>
                </div>
                <CardDescription className="text-base mb-4">
                  Seamlessly integrate with EduAdminHub platform for unified student management
                </CardDescription>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Auto-sync student records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>View exam results in EduAdminHub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Generate report cards automatically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Sync with attendance system</span>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-2xl">Standalone Solution</CardTitle>
                </div>
                <CardDescription className="text-base mb-4">
                  Works independently as a complete examination system for any institution
                </CardDescription>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>No dependency on other platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Complete feature set included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Ready for market deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Perfect for schools and colleges</span>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Perfect For
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <School className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-xl">Schools</CardTitle>
                </div>
                <CardDescription>
                  Conduct school-level exams, assessments, and quizzes with ease. Manage question
                  banks, schedule exams, and track student performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-xl">Colleges & Universities</CardTitle>
                </div>
                <CardDescription>
                  Handle college-level examinations with advanced proctoring, automated grading, and
                  comprehensive analytics for large-scale assessments.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl mb-4 text-white">
                Ready to Transform Your Examination Process?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Start conducting secure, automated online exams today. Get started in minutes.
              </CardDescription>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link href="/coming-soon">Explore Features</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link href="/exam-portal/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 border-t pt-8">
          <p>
            EduAdminHub Exam Portal v{VERSION} • Advanced Online Examination System
          </p>
          <p className="mt-2">
            Standalone Solution • EduAdminHub Integration Available
          </p>
        </div>
      </div>
    </div>
  );
}
