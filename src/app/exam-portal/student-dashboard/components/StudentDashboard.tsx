"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Award, BookOpen, TrendingUp } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Student Dashboard</h1>
        <p className="dashboard-subtitle">Your exam overview and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Upcoming Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">Scheduled</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">0</div>
            <p className="stats-card-description">Exams taken</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">-</div>
            <p className="stats-card-description">Overall</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="stats-card-header">
            <CardTitle className="stats-card-title">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-card-value">-</div>
            <p className="stats-card-description">Trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Exams scheduled for you</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="empty-state">No upcoming exams at the moment.</p>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
          <CardDescription>Your latest exam results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="empty-state">No results available yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}

