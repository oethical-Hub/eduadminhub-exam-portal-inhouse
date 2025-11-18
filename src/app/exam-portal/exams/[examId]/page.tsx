import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, FileText, Award } from "lucide-react";

interface ExamDetailsPageProps {
  params: {
    examId: string;
  };
}

export default function ExamDetailsPage({ params }: ExamDetailsPageProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Exam Details</h1>
        <p className="dashboard-subtitle">Exam ID: {params.examId}</p>
      </div>

      <Card className="card-container">
        <CardHeader>
          <CardTitle>Exam Information</CardTitle>
          <CardDescription>Detailed information about this exam</CardDescription>
        </CardHeader>
        <CardContent className="section-container">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">-</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="font-medium">-</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="font-medium">-</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Passing Marks</p>
                <p className="font-medium">-</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

