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
import { FileQuestion, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Question, QuestionType, Difficulty } from "@/types/question";
import { dummyQuestions, searchQuestions } from "@/data/dummyQuestions";
import { formatDateTime } from "@/utils/formatDate";

interface QuestionListProps {
  readonly onAddQuestion: () => void;
  readonly onEditQuestion: (question: Question) => void;
  readonly onDeleteQuestion: (question: Question) => void;
}

export default function QuestionList({
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(dummyQuestions.map((q) => q.category));
    return Array.from(cats).sort();
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...dummyQuestions];

    // Search filter
    if (searchTerm.trim()) {
      filtered = searchQuestions(searchTerm);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((q) => q.type === typeFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    return filtered;
  }, [searchTerm, typeFilter, difficultyFilter, categoryFilter]);

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
            Questions ({filteredQuestions.length})
          </CardTitle>
          <CardDescription>All questions in your bank</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuestions.length === 0 ? (
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
        </CardContent>
      </Card>
    </div>
  );
}

