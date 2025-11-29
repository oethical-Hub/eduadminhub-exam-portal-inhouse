import { api } from "../api";
import { getApiBaseUrl } from "@/config/mode";
import { API_ENDPOINTS } from "./endpoints";
import { Question, QuestionApi, QuestionType, Difficulty, mapQuestionFromApi } from "@/types/question";

export interface QuestionBankResponse {
  success: boolean;
  message: string;
  data: QuestionApi[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QuestionResponse {
  success: boolean;
  message: string;
  data: QuestionApi;
}

export interface QuestionStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    active: number;
    inactive: number;
    byType: Record<QuestionType, number>;
    byDifficulty: Record<Difficulty, number>;
  };
}

export interface CreateQuestionPayload {
  questionType: QuestionType;
  question: string;
  questionImage?: string | null;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  negativeMarks?: number;
  difficulty: Difficulty;
  category?: string;
  subCategory?: string;
  tags?: string[];
  subjectId?: string;
  classId?: string;
  topic?: string;
  timeLimit?: number;
  codeLanguage?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }>;
  fileTypes?: string[];
  maxFileSize?: number;
  fillBlanksAnswer?: Array<{
    blankIndex: number;
    correctText: string;
    caseSensitive?: boolean;
  }>;
}

export interface QuestionListFilters {
  page?: number;
  limit?: number;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  category?: string;
  subject?: string;
  search?: string;
  tags?: string | string[];
  isActive?: boolean;
}

export const questionBankApi = {
  // Get all questions with filters
  getAll: async (
    filters: QuestionListFilters = {},
    token?: string | null,
    institutionId?: string | null
  ): Promise<{ data: Question[]; pagination?: QuestionBankResponse["pagination"] }> => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.questionType) queryParams.append("questionType", filters.questionType);
    if (filters.difficulty) queryParams.append("difficulty", filters.difficulty);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.subject) queryParams.append("subject", filters.subject);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.tags) {
      const tagsArray = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      tagsArray.forEach(tag => queryParams.append("tags", tag));
    }
    if (filters.isActive !== undefined) queryParams.append("isActive", filters.isActive.toString());

    const endpoint = `${API_ENDPOINTS.questionBank.getAll}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get<QuestionBankResponse["data"]>(endpoint, token, institutionId) as QuestionBankResponse;
    
    return {
      data: response.data.map(mapQuestionFromApi),
      pagination: response.pagination,
    };
  },

  // Get question by ID
  getById: async (
    questionId: string,
    token?: string | null,
    institutionId?: string | null
  ): Promise<Question> => {
    const response = await api.get<QuestionApi>(`${API_ENDPOINTS.questionBank.getById}/=${questionId}`, token, institutionId) as QuestionResponse;
    return mapQuestionFromApi(response.data);
  },

  // Create question
  create: async (
    payload: CreateQuestionPayload,
    token?: string | null,
    institutionId?: string | null
  ): Promise<Question> => {
    const response = await api.post<QuestionApi>(API_ENDPOINTS.questionBank.create, payload, token, institutionId) as QuestionResponse;
    return mapQuestionFromApi(response.data);
  },

  // Update question
  update: async (
    questionId: string,
    payload: Partial<CreateQuestionPayload>,
    token?: string | null,
    institutionId?: string | null
  ): Promise<Question> => {
    const response = await api.put<QuestionApi>(`${API_ENDPOINTS.questionBank.update}/=${questionId}`, payload, token, institutionId) as QuestionResponse;
    return mapQuestionFromApi(response.data);
  },

  // Delete question
  delete: async (
    questionId: string,
    token?: string | null,
    institutionId?: string | null
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete<never>(`${API_ENDPOINTS.questionBank.delete}/=${questionId}`, token, institutionId);
  },

  // Bulk delete questions
  bulkDelete: async (
    questionIds: string[],
    token?: string | null,
    institutionId?: string | null
  ): Promise<{ success: boolean; message: string; deletedCount?: number }> => {
    // DELETE with body - using fetch directly as api.delete doesn't support body
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.questionBank.bulkDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(institutionId ? { "x-institution-id": institutionId } : {}),
      },
      body: JSON.stringify({ questionIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete questions");
    }

    return response.json();
  },

  // Toggle question status
  toggleStatus: async (
    questionId: string,
    isActive: boolean,
    token?: string | null,
    institutionId?: string | null
  ): Promise<Question> => {
    const response = await api.put<QuestionApi>(
      `${API_ENDPOINTS.questionBank.toggleStatus}/=${questionId}`,
      { isActive },
      token,
      institutionId
    ) as QuestionResponse;
    return mapQuestionFromApi(response.data);
  },

  // Get questions by category
  getByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 10,
    token?: string | null,
    institutionId?: string | null
  ): Promise<{ data: Question[]; pagination?: QuestionBankResponse["pagination"] }> => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const endpoint = `${API_ENDPOINTS.questionBank.getByCategory}/=${category}?${queryParams.toString()}`;
    const response = await api.get<QuestionBankResponse["data"]>(endpoint, token, institutionId) as QuestionBankResponse;
    
    return {
      data: response.data.map(mapQuestionFromApi),
      pagination: response.pagination,
    };
  },

  // Get statistics
  getStatistics: async (
    token?: string | null,
    institutionId?: string | null
  ): Promise<QuestionStatisticsResponse> => {
    return api.get<QuestionStatisticsResponse["data"]>(
      API_ENDPOINTS.questionBank.statistics,
      token,
      institutionId
    ) as Promise<QuestionStatisticsResponse>;
  },
};

