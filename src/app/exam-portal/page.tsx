import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  BookOpen, 
  Users, 
  BarChart3, 
  FileQuestion, 
  Clock,
  Shield,
  Award
} from "lucide-react";

export default function ExamPortalPage() {
  return (
    <div className="dashboard-container space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="dashboard-title text-4xl">Welcome to Exam Portal</h1>
        <p className="dashboard-subtitle text-lg max-w-2xl mx-auto">
          Manage exams, questions, and results all in one place
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid-stats">
        <Card className="card-container hover:shadow-lg">
          <CardHeader>
            <ClipboardList className="h-6 w-6 text-blue-600 mb-2" />
            <CardTitle>Exams</CardTitle>
            <CardDescription>View and manage all exams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/exam-portal/exams">View Exams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-container hover:shadow-lg">
          <CardHeader>
            <FileQuestion className="h-6 w-6 text-green-600 mb-2" />
            <CardTitle>Question Bank</CardTitle>
            <CardDescription>Manage your question bank</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/exam-portal/question-bank">Question Bank</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-container hover:shadow-lg">
          <CardHeader>
            <BookOpen className="h-6 w-6 text-purple-600 mb-2" />
            <CardTitle>Create Exam</CardTitle>
            <CardDescription>Create a new exam</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/exam-portal/create-exam">Create Exam</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-container hover:shadow-lg">
          <CardHeader>
            <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View performance analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/exam-portal/analytics">Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid-cards">
        <Card className="card-container">
          <CardHeader>
            <Clock className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Timer Management</CardTitle>
            <CardDescription>
              Real-time countdown with automatic submission
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-container">
          <CardHeader>
            <Shield className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>AI Proctoring</CardTitle>
            <CardDescription>
              Secure exam environment with monitoring
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="card-container">
          <CardHeader>
            <Award className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Auto Grading</CardTitle>
            <CardDescription>
              Instant results with automated grading
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

