# Standalone Login Implementation Guide

## 📋 Overview

This document describes the **Standalone Login** implementation for EduAdminHub Exam Portal. Standalone mode allows users to login without EduAdminHub integration, using a simple email + password authentication.

---

## 🔄 Two Login Modes

| Mode | URL | Description |
|------|-----|-------------|
| **Standalone** | `/login?mode=standalone` | Simple Email + Password login |
| **Integrated** | `/login?mode=integrated` | EduAdminHub login with Institution + OTP |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Coming Soon Page                          │
│                  /coming-soon                                │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                    │
│  [Login with Standalone]│  [Login with EduAdminHub]         │
│           │             │            │                       │
│           ▼             │            ▼                       │
│  /login?mode=standalone │  /login?mode=integrated           │
│           │             │            │                       │
│           ▼             │            ▼                       │
│  StandaloneLoginForm    │  LoginForm (OTP Flow)             │
│  (Email + Password)     │  (Institution → Credentials → OTP)│
│           │             │            │                       │
│           ▼             │            ▼                       │
│  Standalone Backend     │  EduAdminHub Backend              │
│  (Node.js + MongoDB)    │  (api.eduadminhub.com)            │
└─────────────────────────┴───────────────────────────────────┘
```

---

## 📁 Files Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                    # Login page (mode detection)
│   └── coming-soon/
│       └── page.tsx                    # Mode selection page
│
├── components/
│   └── login/
│       ├── LoginForm.tsx               # Integrated mode (OTP)
│       ├── StandaloneLoginForm.tsx     # Standalone mode (Email+Password)
│       ├── PasswordInput.tsx           # Password input with toggle
│       └── ForgotPasswordForm.tsx      # Forgot password form
│
├── context/
│   └── AuthContext.tsx                 # Authentication state management
│
├── data/
│   └── dummyUsers.ts                   # Dummy users for testing
│
├── lib/
│   ├── api.ts                          # API utilities
│   └── auth.ts                         # Auth utilities (token, cookies)
│
├── config/
│   └── mode.ts                         # Mode configuration
│
└── types/
    └── auth.ts                         # Auth type definitions
```

---

## 🧪 Test Credentials (Dummy Data)

| Role | Email | Password | Redirect |
|------|-------|----------|----------|
| **Admin** | `admin@school.com` | `admin123` | `/exam-portal/dashboard` |
| **Teacher** | `teacher@school.com` | `teacher123` | `/exam-portal/dashboard` |
| **Teacher** | `mary@school.com` | `mary123` | `/exam-portal/dashboard` |
| **Student** | `student@school.com` | `student123` | `/exam-portal/student-dashboard` |
| **Student** | `priya@school.com` | `priya123` | `/exam-portal/student-dashboard` |

---

## 🔐 Authentication Flow

### Standalone Mode Flow:

```
1. User visits /coming-soon
        │
        ▼
2. Clicks "Login with Standalone"
        │
        ▼
3. Redirects to /login?mode=standalone
        │
        ▼
4. StandaloneLoginForm renders
        │
        ▼
5. User enters Email + Password
        │
        ▼
6. Form submits to authenticateUser()
        │
        ├── If USE_DUMMY_DATA = true
        │       │
        │       ▼
        │   Check against dummyUsers array
        │
        └── If USE_DUMMY_DATA = false
                │
                ▼
            POST /api/v1/auth/login
            { email, password }
        │
        ▼
7. On Success:
   - Receive { user, token }
   - Call login(token, user, "standalone", "Standalone Mode")
   - Store in cookies
   - Redirect based on role
        │
        ▼
8. Dashboard loads with authenticated user
```

---

## 📝 API Endpoints (Backend)

### Login Endpoint

**POST** `/api/v1/auth/login`

**Request:**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "_id": "user_admin_001",
      "email": "admin@school.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "status": true,
      "phone": "9876543210"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

## 🍪 Cookie Storage

| Cookie Name | Description | Example Value |
|-------------|-------------|---------------|
| `authToken` | JWT token | `eyJhbGciOiJI...` |
| `institutionId` | Institution ID | `standalone` |
| `institutionName` | Institution name | `Standalone Mode` |
| `userData` | User data (JSON) | `{"_id":"...", "email":"..."}` |

---

## 🔧 Configuration

### Enable/Disable Dummy Data

In `src/components/login/StandaloneLoginForm.tsx`:

```typescript
// For testing with dummy data
const USE_DUMMY_DATA = true;

// For production with real API
const USE_DUMMY_DATA = false;
```

### API Base URL

In `src/config/mode.ts`:

```typescript
export const API_CONFIG = {
  standalone: {
    baseUrl: process.env.NEXT_PUBLIC_STANDALONE_API_URL || "http://localhost:5000/api/v1",
    requiresInstitutionId: false,
  },
  integrated: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.eduadminhub.com/api",
    requiresInstitutionId: true,
  },
};
```

---

## 🎯 Key Components

### 1. StandaloneLoginForm.tsx

```typescript
// Main features:
// - Simple email + password form
// - Test credentials info box (when using dummy data)
// - Green theme to differentiate from integrated mode
// - Link to switch to EduAdminHub login
// - Uses authenticateUser() for dummy data
// - Ready for real API integration
```

### 2. dummyUsers.ts

```typescript
// Provides:
// - Array of test users with credentials
// - authenticateUser(email, password) function
// - generateDummyToken() for JWT-like tokens
// - getUserByEmail() utility function
```

### 3. AuthContext.tsx

```typescript
// Features:
// - Supports both standalone and integrated modes
// - institutionId = "standalone" for standalone mode
// - isStandaloneMode flag for components
// - Multi-tab synchronization
// - Auto-logout on token expiry
```

### 4. auth.ts

```typescript
// Supports:
// - IntegratedDecodedToken (EduAdminHub format)
// - StandaloneDecodedToken (simple JWT format)
// - Token decoding and expiry checking
// - Cookie management utilities
```

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Standalone Login

1. Go to `http://localhost:3000/coming-soon`
2. Click **"Login with Standalone"**
3. Use test credentials:
   - Email: `admin@school.com`
   - Password: `admin123`
4. Click **"Sign In"**
5. You'll be redirected to Dashboard

### 3. Test Different Roles

| Credential | Dashboard |
|------------|-----------|
| `admin@school.com` / `admin123` | Admin Dashboard |
| `teacher@school.com` / `teacher123` | Teacher Dashboard |
| `student@school.com` / `student123` | Student Dashboard |

---

## 🔄 Switching to Real API

When your backend API is ready:

### Step 1: Update StandaloneLoginForm.tsx

```typescript
// Change:
const USE_DUMMY_DATA = true;

// To:
const USE_DUMMY_DATA = false;
```

### Step 2: Uncomment API Call

```typescript
// In handleSubmit function, uncomment:
const apiResponse = await api.post("/auth/login", { email, password });
response = {
  success: apiResponse.success,
  message: apiResponse.message,
  data: apiResponse.data,
};
```

### Step 3: Set Environment Variable

Create `.env.local`:

```env
NEXT_PUBLIC_STANDALONE_API_URL=http://localhost:5000/api/v1
```

---

## 🛡️ Security Considerations

### Current Implementation (Dummy Data)

- ⚠️ Passwords stored in plain text (only for testing)
- ⚠️ Dummy JWT tokens (not cryptographically secure)
- ⚠️ No rate limiting

### Production Requirements

- ✅ Passwords hashed with bcrypt (backend)
- ✅ Secure JWT tokens with secret key (backend)
- ✅ HTTPS only
- ✅ Rate limiting on login attempts
- ✅ HTTP-only cookies for tokens
- ✅ Token refresh mechanism

---

## 📊 Role-Based Redirects

```typescript
// src/utils/getRedirectRoute.ts

function getRedirectRoute(role: string): string {
  const normalizedRole = role?.toLowerCase() || "";

  // Admin/Teacher roles
  if (normalizedRole.includes("admin") || 
      normalizedRole.includes("teacher")) {
    return "/exam-portal/dashboard";
  }

  // Student role
  if (normalizedRole.includes("student")) {
    return "/exam-portal/student-dashboard";
  }

  // Parent role
  if (normalizedRole.includes("parent")) {
    return "/exam-portal/student-dashboard";
  }

  // Default
  return "/exam-portal/dashboard";
}
```

---

## 🐛 Troubleshooting

### Login not working?

1. Check browser console for errors
2. Verify credentials are correct (case-sensitive)
3. Clear cookies and try again
4. Check if `USE_DUMMY_DATA` is set correctly

### Redirect not happening?

1. Check user role in response
2. Verify `getRedirectRoute()` handles the role
3. Check AuthContext `isAuthenticated` state

### Cookies not being set?

1. Check if running on localhost (cookies work)
2. Verify `setCookie()` is being called
3. Check browser cookie settings

---

## 📝 Related Documentation

- [STANDALONE.md](./STANDALONE.md) - Complete standalone architecture
- [AUTHENTICATION_IMPLEMENTATION.md](./AUTHENTICATION_IMPLEMENTATION.md) - Auth system overview
- [AUTHENTICATION_PLAN.md](./AUTHENTICATION_PLAN.md) - Auth planning document
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Code style guidelines

---

## ✅ Implementation Checklist

- [x] StandaloneLoginForm component
- [x] Dummy users data for testing
- [x] Query param based mode detection (`?mode=standalone`)
- [x] AuthContext standalone support
- [x] Token utilities for both formats
- [x] Coming Soon page buttons
- [x] Role-based redirects
- [x] Test credentials info box
- [x] Switch mode link in form
- [ ] Real API integration (pending backend)
- [ ] Forgot password for standalone
- [ ] Remember me functionality
- [ ] Token refresh mechanism

---

## 🎯 Next Steps

1. **Backend Ready Hone Par:**
   - `USE_DUMMY_DATA = false` karo
   - API endpoint verify karo
   - Test with real credentials

2. **Additional Features:**
   - Forgot password implementation
   - Remember me with persistent token
   - Profile page for standalone users

3. **Security Hardening:**
   - Move to HTTP-only cookies
   - Add CSRF protection
   - Implement rate limiting

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** ✅ Dummy Data Working | ⏳ API Integration Pending


