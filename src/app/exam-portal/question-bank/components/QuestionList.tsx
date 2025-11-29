"use client";

import { useState, useEffect, useMemo } from "react";
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
import { FileQuestion, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Question, QuestionType, Difficulty } from "@/types/question";
import { formatDateTime } from "@/utils/formatDate";
import { questionBankApi } from "@/lib/api/questionBank";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface QuestionListProps {
  readonly onAddQuestion: () => void;
  readonly onEditQuestion: (question: Question) => void;
  readonly onDeleteQuestion: (question: Question) => void;
  readonly refreshKey?: number; // Key to trigger refresh
}

export default function QuestionList({
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  refreshKey = 0,
}: QuestionListProps) {
  const { token, institutionId } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Get unique categories from questions
  const categories = useMemo(() => {
    const cats = new Set(questions.map((q) => q.category));
    return Array.from(cats).sort();
  }, [questions]);

  // Fetch questions from API
  const fetchQuestions = async () => {
    if (!token || !institutionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const filters: any = {
        page,
        limit,
        isActive: true,
      };

      if (typeFilter !== "all") {
        filters.questionType = typeFilter;
      }

      if (difficultyFilter !== "all") {
        filters.difficulty = difficultyFilter;
      }

      if (categoryFilter !== "all") {
        filters.category = categoryFilter;
      }

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      const response = await questionBankApi.getAll(filters, token, institutionId);
      setQuestions(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      }
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      toast.error(error.message || "Failed to load questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on mount and when filters change
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, institutionId, page, typeFilter, difficultyFilter, categoryFilter, refreshKey]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchQuestions();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredQuestions = questions;

  const getTypeBadgeColor = (type: QuestionType) => {
    const colors: Record<QuestionType, string> = {
      mcq: "bg-blue-100 text-blue-700 border-blue-200",
      "true-false": "bg-green-100 text-green-700 border-green-200",
      descriptive: "bg-purple-100 text-purple-700 border-purple-200",
      "fill-blanks": "bg-orange-100 text-orange-700 border-orange-200",
      "file-upload": "bg-pink-100 text-pink-700 border-pink-200",
      coding: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors: Record<Difficulty, string> = {
      easy: "bg-green-500 text-white",
      medium: "bg-yellow-500 text-white",
      hard: "bg-red-500 text-white",
    };
    return colors[difficulty];
  };

  const formatQuestionType = (type: QuestionType) => {
    const formats: Record<QuestionType, string> = {
      mcq: "MCQ",
      "true-false": "True/False",
      descriptive: "Descriptive",
      "fill-blanks": "Fill Blanks",
      "file-upload": "File Upload",
      coding: "Coding",
    };
    return formats[type] || type;
  };

  return (
    <div className="dashboard-container">
      <div className="flex-between">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Question Bank</h1>
          <p className="dashboard-subtitle">Manage your question repository</p>
        </div>
        <Button onClick={onAddQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="fill-blanks">Fill Blanks</SelectItem>
                  <SelectItem value="file-upload">File Upload</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={difficultyFilter}
                onValueChange={(value) => setDifficultyFilter(value as any)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card className="card-container">
        <CardHeader>
          <CardTitle>
            Questions ({loading ? "..." : total})
          </CardTitle>
          <CardDescription>All questions in your bank</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading questions...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <FileQuestion className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <p className="mb-4">
                {searchTerm || typeFilter !== "all" || difficultyFilter !== "all" || categoryFilter !== "all"
                  ? "No questions match your filters"
                  : "No questions yet"}
              </p>
              {!searchTerm && typeFilter === "all" && difficultyFilter === "all" && categoryFilter === "all" && (
                <Button onClick={onAddQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Question
                </Button>
              )}
            </div>
          ) : (
            <TooltipProvider>
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={getTypeBadgeColor(question.type)}
                          >
                            {formatQuestionType(question.type)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(question.difficulty)}
                          >
                            {question.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            {question.category}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {question.marks} {question.marks === 1 ? "mark" : "marks"}
                          </span>
                          {question.negativeMarks && question.negativeMarks > 0 && (
                            <span className="text-sm text-red-600">
                              -{question.negativeMarks} negative
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {question.question}
                        </h3>
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {question.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-600"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {formatDateTime(question.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditQuestion(question)}
                              aria-label="Edit question"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Question</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteQuestion(question)}
                              className="text-destructive hover:text-destructive"
                              aria-label="Delete question"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Question</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          )}

          {/* Pagination */}
          {!loading && filteredQuestions.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

