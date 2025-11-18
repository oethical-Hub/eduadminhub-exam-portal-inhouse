import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your exam portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Total Exams</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">All time</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Active Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">Currently running</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">Registered</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">Exams finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
          <CardDescription>Your recently created or accessed exams</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="empty-state">No exams yet. Create your first exam to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}

