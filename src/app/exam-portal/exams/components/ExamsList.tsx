"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardList, Plus, Search, Eye, Edit, Trash2, Play } from "lucide-react";
import { ExamListItem, ExamStatus } from "@/types/exam";
import { dummyExamListItems, searchExams } from "@/data/dummyExams";
import { formatDateTime } from "@/utils/formatDate";
import Link from "next/link";

interface ExamsListProps {
  readonly onViewExam?: (examId: string) => void;
  readonly onEditExam?: (examId: string) => void;
  readonly onDeleteExam?: (examId: string) => void;
  readonly onTakeExam?: (examId: string) => void;
}

export default function ExamsList({
  onViewExam,
  onEditExam,
  onDeleteExam,
  onTakeExam,
}: ExamsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExamStatus | "all">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  // Get unique subjects
  const subjects = useMemo(() => {
    const subs = new Set(dummyExamListItems.map((e) => e.subject));
    return Array.from(subs).sort();
  }, []);

  // Filter exams
  const filteredExams = useMemo(() => {
    let filtered = [...dummyExamListItems];

    // Search filter
    if (searchTerm.trim()) {
      const searchResults = searchExams(searchTerm);
      filtered = searchResults.map((exam) => ({
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        class: exam.class,
        totalMarks: exam.totalMarks,
        duration: exam.duration,
        startDate: exam.startDate,
        endDate: exam.endDate,
        status: exam.status,
        totalQuestions: exam.totalQuestions,
        createdBy: exam.createdBy,
      }));
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((e) => e.subject === subjectFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, subjectFilter]);

  const getStatusBadge = (status: ExamStatus) => {
    const colors: Record<ExamStatus, string> = {
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      active: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="dashboard-container">
      <div className="flex-between">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Exams</h1>
          <p className="dashboard-subtitle">View and manage all exams</p>
        </div>
        <Button asChild>
          <Link href="/exam-portal/create-exam">
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>All Exams ({filteredExams.length})</CardTitle>
          <CardDescription>List of all created exams</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExams.length === 0 ? (
            <div className="empty-state">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <p className="mb-4">
                {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
                  ? "No exams match your filters"
                  : "No exams created yet"}
              </p>
              {!searchTerm && statusFilter === "all" && subjectFilter === "all" && (
                <Button asChild>
                  <Link href="/exam-portal/create-exam">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Exam
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <TooltipProvider>
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-lg">{exam.title}</h3>
                          <Badge className={getStatusBadge(exam.status)}>
                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-500">Subject</Label>
                            <p className="text-sm font-semibold text-gray-900">{exam.subject}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">Class</Label>
                            <p className="text-sm font-semibold text-gray-900">{exam.class}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">Duration</Label>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDuration(exam.duration)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-500">Total Marks</Label>
                            <p className="text-sm font-semibold text-gray-900">
                              {exam.totalMarks}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Questions: </span>
                            {exam.totalQuestions}
                          </div>
                          <div>
                            <span className="font-medium">Start: </span>
                            {formatDateTime(exam.startDate)}
                          </div>
                          <div>
                            <span className="font-medium">End: </span>
                            {formatDateTime(exam.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {onTakeExam && exam.status === "active" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/exam-portal/take-exam/${exam.id}`}>
                                  <Play className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Take Exam</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {onViewExam && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewExam(exam.id)}
                                aria-label="View exam"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Exam</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {onEditExam && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditExam(exam.id)}
                                aria-label="Edit exam"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Exam</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {onDeleteExam && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeleteExam(exam.id)}
                                className="text-destructive hover:text-destructive"
                                aria-label="Delete exam"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Exam</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

