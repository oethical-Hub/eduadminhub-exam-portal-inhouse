import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ResultsPageProps {
  params: {
    examId: string;
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Exam Results</h1>
        <p className="dashboard-subtitle">Exam ID: {params.examId}</p>
      </div>

      {/* Result Summary */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Result Summary</CardTitle>
          <CardDescription>Your exam performance overview</CardDescription>
        </CardHeader>
        <CardContent className="section-container">
          <div className="grid-stats">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">- / -</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Wrong</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
          <CardDescription>Review your answers and correct solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="empty-state">No results available yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}

