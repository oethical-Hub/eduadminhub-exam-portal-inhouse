import { api } from "../api";
import { API_ENDPOINTS } from "./endpoints";

export interface Class {
  classId: string;
  className: string;
  section: string;
  roomNumber: string;
  noOfStudents?: number;
  status: boolean;
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  code: string;
  type: "Core" | "Elective" | "Optional" | "Theory" | "Practical";
  status: boolean;
}

export interface MasterResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

export const mastersApi = {
  // Get all classes
  getClasses: async (
    token?: string | null,
    institutionId?: string | null
  ): Promise<Class[]> => {
    const response = await api.post<MasterResponse<Class>["data"]>(
      API_ENDPOINTS.class.getAll,
      {}, // Empty body for POST request
      token,
      institutionId
    ) as MasterResponse<Class>;
    
    return response.data || [];
  },

  // Get all subjects
  getSubjects: async (
    token?: string | null,
    institutionId?: string | null
  ): Promise<Subject[]> => {
    const response = await api.post<MasterResponse<Subject>["data"]>(
      API_ENDPOINTS.subject.getAll,
      {}, // Empty body for POST request
      token,
      institutionId
    ) as MasterResponse<Subject>;
    
    return response.data || [];
  },
};


