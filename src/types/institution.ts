export interface Institution {
  _id: string;
  name: string;
  institutionId: string;
}

export interface InstitutionListResponse {
  success: boolean;
  message: string;
  total: number;
  data: Institution[];
}

