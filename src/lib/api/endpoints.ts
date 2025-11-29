/**
 * Centralized API Endpoints Configuration
 * All API endpoints are defined here and exported for use across the application
 */

export const API_ENDPOINTS = {
  // Question Bank Endpoints
  questionBank: {
    create: "/api/add-question/byId",
    getAll: "/api/get-questions/getList",
    getById: "/api/get-question/getById",
    update: "/api/edit-question/byId",
    delete: "/api/delete-question/byId",
    bulkDelete: "/api/bulk-delete-questions/bulkDelete",
    toggleStatus: "/api/toggle-question-status/toggleStatus",
    getByCategory: "/api/questions-by-category/byCategory",
    statistics: "/api/question-statistics/statistics",
  },

  // Class Master Endpoints
  class: {
    create: "/api/addClass/byId",
    getAll: "/api/get-class/getList",
    getById: "/api/get-class/getById",
    update: "/api/edit-class/byId",
    delete: "/api/delete-class/delById",
    exportExcel: "/api/get-class/excel",
    exportPdf: "/api/get-class/pdf",
  },

  // Subject Master Endpoints
  subject: {
    create: "/api/add-subject/byId",
    getAll: "/api/get-subjects/getList",
    getById: "/api/get-subjects/getById",
    update: "/api/edit-subject/byId",
    delete: "/api/delete-subject/byId",
  },

  // Authentication Endpoints (Integrated Mode - EduAdminHub)
  auth: {
    login: "/api/loginUser/userId",
    verifyOtp: "/api/loginUser/verifyOtp",
    refreshToken: "/api/loginUser/refreshToken",
    logout: "/api/logoutUser/byId",
    forgotPassword: "/api/user/forgot-password",
    getInstitutions: "/api/getListInstitute/getSpecificList",
  },

  // Authentication Endpoints (Standalone Mode)
  authStandalone: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    me: "/auth/me",
    updatePassword: "/auth/update-password",
  },
};

