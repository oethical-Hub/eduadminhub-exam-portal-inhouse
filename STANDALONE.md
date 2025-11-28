# Standalone Authentication Implementation Guide

## 📋 Overview

This document outlines the recommended authentication strategies for **standalone mode** of the EduAdminHub Exam Portal. Unlike the integrated mode (which uses EduAdminHub's authentication), standalone mode requires its own secure authentication system.

---

## 🏗️ Backend Architecture for Standalone Mode

### **Current Setup:**

**Integrated Mode (EduAdminHub):**
- ✅ Uses EduAdminHub's existing backend: `https://api.eduadminhub.com/api`
- ✅ Authentication handled by EduAdminHub
- ✅ Multi-tenancy via `x-institution-id` header
- ✅ Shared database with EduAdminHub

**Standalone Mode:**
- ⚠️ **Requires separate backend** (different from EduAdminHub backend)
- ⚠️ Own authentication system
- ⚠️ Own database
- ⚠️ Independent deployment

---

### **Backend Architecture Options:**

#### **Option 1: Completely Separate Backend (Recommended) 🌟**

**Why Separate?**
- ✅ **Independent Deployment**: Standalone customers don't depend on EduAdminHub infrastructure
- ✅ **Data Isolation**: Complete separation of data (security & compliance)
- ✅ **Scalability**: Can scale independently based on standalone customer needs
- ✅ **Customization**: Can customize backend features without affecting EduAdminHub
- ✅ **Pricing Flexibility**: Different pricing models for standalone vs integrated

**Architecture:**
```
┌─────────────────────────────────────┐
│   Standalone Exam Portal Frontend  │
│   (Next.js - Port 3000)            │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
┌──────────────▼──────────────────────┐
│   Standalone Backend API             │
│   (Node.js/Express - Port 5000)     │
│   - Authentication                   │
│   - Exam Management                 │
│   - Question Bank                   │
│   - Results & Analytics             │
└──────────────┬──────────────────────┘
               │
               │ Database Queries
               │
┌──────────────▼──────────────────────┐
│   Standalone Database                │
│   (PostgreSQL/MongoDB)              │
│   - Users                           │
│   - Exams                           │
│   - Questions                       │
│   - Results                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   EduAdminHub Backend (Separate)     │
│   (Only for Integrated Mode)         │
└─────────────────────────────────────┘
```

**Implementation:**

1. **Create New Backend Service:**
```bash
# New backend project structure
exam-portal-backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── exam.controller.ts
│   │   ├── question.controller.ts
│   │   └── result.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── exam.routes.ts
│   │   └── question.routes.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Exam.ts
│   │   └── Question.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── exam.service.ts
│   └── config/
│       ├── database.ts
│       └── jwt.config.ts
├── package.json
└── .env
```

2. **Update Frontend API Configuration:**

**File: `src/lib/api.ts`**
```typescript
// Detect mode (standalone vs integrated)
const isStandaloneMode = process.env.NEXT_PUBLIC_MODE === "standalone";

// Different API URLs based on mode
export const API_BASE_URL = isStandaloneMode
  ? process.env.NEXT_PUBLIC_STANDALONE_API_URL || "http://localhost:5000/api/v1"
  : process.env.NEXT_PUBLIC_EDUADMIN_API_URL || "https://api.eduadminhub.com/api";

// API configuration
export const api = {
  get: <T = any>(endpoint: string, token?: string | null, institutionId?: string | null) => {
    // In standalone mode, institutionId is not needed
    if (isStandaloneMode) {
      return request<T>(endpoint, "GET", undefined, token, null);
    }
    return request<T>(endpoint, "GET", undefined, token, institutionId);
  },
  // ... other methods
};
```

3. **Environment Variables:**

**.env.local (Standalone Mode)**
```env
# Mode Configuration
NEXT_PUBLIC_MODE=standalone

# Standalone Backend API
NEXT_PUBLIC_STANDALONE_API_URL=http://localhost:5000/api/v1
# or production: https://api.exam-portal-standalone.com/api/v1

# No EduAdminHub integration needed
NEXT_PUBLIC_EDUADMIN_API_URL=
```

**.env.local (Integrated Mode)**
```env
# Mode Configuration
NEXT_PUBLIC_MODE=integrated

# EduAdminHub Backend API
NEXT_PUBLIC_EDUADMIN_API_URL=https://api.eduadminhub.com/api

# Standalone API not used
NEXT_PUBLIC_STANDALONE_API_URL=
```

---

#### **Option 2: Same Backend with Mode Detection (Not Recommended)**

**Why Not Recommended?**
- ⚠️ **Tight Coupling**: Standalone customers depend on EduAdminHub infrastructure
- ⚠️ **Data Mixing**: Risk of data leakage between modes
- ⚠️ **Scaling Issues**: Can't scale independently
- ⚠️ **Security Concerns**: Shared infrastructure increases attack surface

**If You Must Use This Approach:**
```typescript
// Backend route with mode detection
app.post("/api/auth/login", async (req, res) => {
  const { mode, email, password } = req.body;
  
  if (mode === "standalone") {
    // Use standalone authentication
    // Query standalone database
    const user = await StandaloneUser.findOne({ email });
    // ... standalone logic
  } else {
    // Use EduAdminHub authentication
    // Query EduAdminHub database
    const user = await EduAdminUser.findOne({ email });
    // ... integrated logic
  }
});
```

---

#### **Option 3: Microservices Architecture (Enterprise) 🏢**

**Best for Large Scale:**
```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│              (Routes requests to services)               │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
    ┌──────────▼──────────┐    ┌──────────▼──────────┐
    │  Auth Service       │    │  Exam Service       │
    │  (Port 5001)        │    │  (Port 5002)        │
    └─────────────────────┘    └─────────────────────┘
               │                           │
    ┌──────────▼──────────┐    ┌──────────▼──────────┐
    │  Question Service  │    │  Result Service    │
    │  (Port 5003)        │    │  (Port 5004)        │
    └─────────────────────┘    └─────────────────────┘
```

**Pros:**
- ✅ Independent scaling per service
- ✅ Technology flexibility per service
- ✅ Better fault isolation
- ✅ Team autonomy

**Cons:**
- ⚠️ More complex deployment
- ⚠️ Requires service mesh/API gateway
- ⚠️ Higher infrastructure costs

---

### **Recommended Backend Tech Stack for Standalone:**

#### **Backend Framework:**
- **Node.js + Express** (Recommended)
  - Same language as frontend (TypeScript)
  - Large ecosystem
  - Fast development

- **Alternative Options:**
  - NestJS (Enterprise-grade, TypeScript-first)
  - Fastify (High performance)
  - Python + FastAPI (If team prefers Python)

#### **Database:**
- **PostgreSQL** (Recommended)
  - Relational data (users, exams, questions)
  - ACID compliance
  - JSON support for flexible schemas

- **Alternative:**
  - MongoDB (If you prefer NoSQL)
  - MySQL (If team is familiar)

#### **Authentication:**
- **JWT** (JSON Web Tokens)
- **bcrypt** for password hashing
- **passport.js** for OAuth strategies

#### **Additional Services:**
- **Redis** - Session storage, caching
- **RabbitMQ/SQS** - Message queue (for async tasks)
- **AWS S3/Cloud Storage** - File storage (exam files, images)

---

### **Backend API Structure:**

**Base URL:** `https://api.exam-portal-standalone.com/api/v1`

**Endpoints:**

```
Authentication:
POST   /auth/register          # Register new user (admin only)
POST   /auth/login              # Login
POST   /auth/logout              # Logout
POST   /auth/refresh             # Refresh token
POST   /auth/forgot-password     # Request password reset
POST   /auth/reset-password      # Reset password
POST   /auth/verify-otp          # Verify MFA OTP

Users:
GET    /users                    # List users (admin)
GET    /users/:id                # Get user details
PUT    /users/:id                # Update user
DELETE /users/:id                # Delete user

Exams:
GET    /exams                    # List exams
GET    /exams/:id                # Get exam details
POST   /exams                    # Create exam
PUT    /exams/:id                # Update exam
DELETE /exams/:id                # Delete exam
POST   /exams/:id/start          # Start exam
POST   /exams/:id/submit          # Submit exam

Questions:
GET    /questions                # List questions
GET    /questions/:id            # Get question details
POST   /questions                # Create question
PUT    /questions/:id            # Update question
DELETE /questions/:id            # Delete question

Results:
GET    /results                  # List results
GET    /results/:examId          # Get exam results
GET    /results/:examId/:userId  # Get user's result
POST   /results                  # Create result (auto-grading)
```

---

### **Database Schema (Standalone):**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'teacher', 'student'
  name VARCHAR(255),
  mfa_secret VARCHAR(255), -- For TOTP
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exams Table
CREATE TABLE exams (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  class VARCHAR(50),
  duration INTEGER, -- in minutes
  total_marks INTEGER,
  passing_marks INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(50), -- 'draft', 'scheduled', 'active', 'completed'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  exam_id UUID REFERENCES exams(id),
  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- 'mcq', 'true-false', 'descriptive', etc.
  marks INTEGER,
  options JSONB, -- For MCQ options
  correct_answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Results Table
CREATE TABLE results (
  id UUID PRIMARY KEY,
  exam_id UUID REFERENCES exams(id),
  user_id UUID REFERENCES users(id),
  total_marks INTEGER,
  obtained_marks INTEGER,
  percentage DECIMAL(5,2),
  status VARCHAR(50), -- 'passed', 'failed', 'pending'
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **Deployment Architecture:**

**Standalone Mode:**
```
┌─────────────────────────────────────┐
│   Frontend (Vercel/Netlify)        │
│   exam-portal-standalone.com        │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────┐
│   Backend API (AWS/Heroku/DigitalOcean)│
│   api.exam-portal-standalone.com    │
│   - Node.js/Express                  │
│   - Port 5000                        │
└──────────────┬──────────────────────┘
               │
               │
┌──────────────▼──────────────────────┐
│   Database (AWS RDS/Managed DB)      │
│   - PostgreSQL                       │
│   - Automated backups                │
└─────────────────────────────────────┘
```

**Integrated Mode (EduAdminHub):**
```
┌─────────────────────────────────────┐
│   Frontend (Same or Different)      │
│   exam.eduadminhub.com              │
└──────────────┬──────────────────────┘
               │
               │
┌──────────────▼──────────────────────┐
│   EduAdminHub Backend                │
│   api.eduadminhub.com                │
└──────────────┬──────────────────────┘
               │
               │
┌──────────────▼──────────────────────┐
│   EduAdminHub Database              │
└─────────────────────────────────────┘
```

---

### **Configuration Management:**

**Frontend Configuration:**

**File: `src/config/mode.ts`**
```typescript
export type AppMode = "standalone" | "integrated";

export const APP_MODE: AppMode = 
  (process.env.NEXT_PUBLIC_MODE as AppMode) || "integrated";

export const isStandalone = APP_MODE === "standalone";
export const isIntegrated = APP_MODE === "integrated";

export const API_CONFIG = {
  standalone: {
    baseUrl: process.env.NEXT_PUBLIC_STANDALONE_API_URL || 
             "http://localhost:5000/api/v1",
    requiresInstitutionId: false,
  },
  integrated: {
    baseUrl: process.env.NEXT_PUBLIC_EDUADMIN_API_URL || 
             "https://api.eduadminhub.com/api",
    requiresInstitutionId: true,
  },
};

export const getApiConfig = () => API_CONFIG[APP_MODE];
```

**Update API Client:**

**File: `src/lib/api.ts`**
```typescript
import { getApiConfig, isStandalone } from "@/config/mode";

const config = getApiConfig();

export const API_BASE_URL = config.baseUrl;

async function request<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null,
  institutionId?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Only add institution ID in integrated mode
  if (!isStandalone && institutionId) {
    headers["x-institution-id"] = institutionId;
  }

  // ... rest of request logic
}
```

---

### **Migration Strategy:**

**Phase 1: Build Standalone Backend**
- [ ] Create new backend project
- [ ] Implement authentication
- [ ] Implement exam/question APIs
- [ ] Set up database
- [ ] Deploy to staging

**Phase 2: Update Frontend**
- [ ] Add mode detection
- [ ] Update API client
- [ ] Test both modes
- [ ] Update environment variables

**Phase 3: Testing**
- [ ] Test standalone mode end-to-end
- [ ] Test integrated mode (ensure no breaking changes)
- [ ] Load testing
- [ ] Security audit

**Phase 4: Deployment**
- [ ] Deploy standalone backend
- [ ] Update frontend configuration
- [ ] Monitor both systems
- [ ] Gradual rollout

---

### **Cost Considerations:**

**Standalone Backend Costs:**
- Server hosting: $20-100/month (depending on scale)
- Database: $15-50/month
- CDN/Storage: $10-30/month
- **Total: ~$45-180/month** (for small-medium scale)

**Benefits:**
- ✅ Independent scaling
- ✅ Data isolation
- ✅ Customization freedom
- ✅ Better security posture

---

## 🔐 Authentication Options

### 1. **JWT-Based Authentication (Current Implementation) ✅**

**Status:** Already Implemented

**How it works:**
- Username/Email + Password login
- JWT tokens issued by backend
- Tokens stored in HTTP-only cookies (recommended) or localStorage
- Token refresh mechanism for extended sessions

**Pros:**
- ✅ Stateless (scales well)
- ✅ Already implemented
- ✅ Works with REST APIs
- ✅ Mobile-friendly

**Cons:**
- ⚠️ Token revocation requires blacklist
- ⚠️ Need secure token storage

**Security Best Practices:**
```typescript
// Recommended: Use HTTP-only cookies instead of localStorage
// This prevents XSS attacks from accessing tokens

// Backend should set:
Set-Cookie: authToken=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600

// Frontend should:
// - Not store tokens in localStorage (use cookies only)
// - Implement token refresh before expiry
// - Clear tokens on logout
```

---

### 2. **OAuth 2.0 / OpenID Connect (Recommended for Enterprise) 🌟**

**Status:** To be Implemented

**Supported Providers:**
- Google Workspace (for schools)
- Microsoft Azure AD (for educational institutions)
- Apple School Manager
- Custom OAuth2 provider

**Implementation Steps:**

#### 2.1 Install Required Packages
```bash
npm install next-auth@beta
# or
npm install @auth/core @auth/nextjs
```

#### 2.2 Configure NextAuth.js

**File: `src/lib/auth-config.ts`**
```typescript
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    
    // Microsoft Azure AD
    AzureADProvider({
      clientId: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      tenantId: process.env.AZURE_TENANT_ID!,
    }),
    
    // Traditional Username/Password (fallback)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call your backend API
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        
        if (res.ok) {
          const user = await res.json();
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
```

#### 2.3 Create API Route

**File: `src/app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

#### 2.4 Update Login Page

**File: `src/app/login/components/LoginPage.tsx`**
```typescript
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/exam-portal/dashboard" });
  };
  
  const handleMicrosoftLogin = () => {
    signIn("azure-ad", { callbackUrl: "/exam-portal/dashboard" });
  };
  
  // ... existing username/password form
}
```

**Pros:**
- ✅ Industry standard (OAuth 2.0)
- ✅ Single Sign-On (SSO) support
- ✅ No password storage needed
- ✅ Works with enterprise identity providers
- ✅ Better security (tokens managed by provider)

**Cons:**
- ⚠️ Requires OAuth provider setup
- ⚠️ Additional dependency (NextAuth.js)
- ⚠️ More complex initial setup

---

### 3. **Multi-Factor Authentication (MFA) 🔒**

**Status:** Recommended Addition

**Implementation Options:**

#### 3.1 TOTP (Time-based One-Time Password)
- Use libraries: `otplib`, `qrcode`
- Generate QR codes for Google Authenticator / Authy
- Verify codes on login

#### 3.2 SMS OTP
- Send OTP via SMS service (Twilio, AWS SNS)
- Verify before allowing login

#### 3.3 Email OTP
- Send OTP to registered email
- Verify before allowing login

**Example Implementation:**
```typescript
// Enable MFA for user
async function enableMFA(userId: string) {
  const secret = authenticator.generateSecret();
  const otpAuthUrl = authenticator.keyuri(
    user.email,
    "EduAdminHub Exam Portal",
    secret
  );
  
  // Store secret (encrypted) in database
  // Return QR code URL to frontend
  return { secret, qrCodeUrl: otpAuthUrl };
}

// Verify MFA on login
async function verifyMFA(userId: string, token: string) {
  const userSecret = await getUserSecret(userId);
  return authenticator.verify({ token, secret: userSecret });
}
```

---

## 🛡️ Security Best Practices

### 1. **Password Policies**

```typescript
// Enforce strong passwords
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  preventCommonPasswords: true, // Check against common password list
};

// Use bcrypt for password hashing (backend)
// bcrypt.hash(password, 12) // 12 rounds recommended
```

### 2. **Rate Limiting**

```typescript
// Implement rate limiting on login attempts
// Example: Max 5 attempts per 15 minutes per IP
const rateLimiter = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDuration: 30 * 60 * 1000, // 30 minutes block
};
```

### 3. **Session Management**

```typescript
// Recommended session settings
const sessionConfig = {
  maxAge: 24 * 60 * 60, // 24 hours
  refreshTokenMaxAge: 7 * 24 * 60 * 60, // 7 days
  autoRefresh: true, // Refresh token before expiry
  secure: true, // HTTPS only
  httpOnly: true, // Prevent JavaScript access
  sameSite: "strict", // CSRF protection
};
```

### 4. **Account Lockout**

```typescript
// Lock account after failed attempts
const accountLockout = {
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes
  notifyUser: true, // Email user about lockout
};
```

### 5. **Password Reset Flow**

```typescript
// Secure password reset
async function requestPasswordReset(email: string) {
  // 1. Generate secure token (crypto.randomBytes)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 3600000; // 1 hour
  
  // 2. Store token in database (hashed)
  await storeResetToken(email, hashToken(resetToken), expiresAt);
  
  // 3. Send email with reset link
  await sendResetEmail(email, resetToken);
  
  // 4. Don't reveal if email exists (security)
  return { success: true };
}
```

---

## 📦 Recommended Tech Stack

### Frontend (Next.js)
- ✅ **NextAuth.js** - OAuth 2.0 / OpenID Connect
- ✅ **JWT** - Token management
- ✅ **Zod** - Input validation
- ✅ **bcryptjs** - Password hashing (if needed client-side)

### Backend (Node.js/Express)
- ✅ **jsonwebtoken** - JWT generation/verification
- ✅ **bcrypt** - Password hashing
- ✅ **express-rate-limit** - Rate limiting
- ✅ **helmet** - Security headers
- ✅ **express-validator** - Input validation

### Database
- ✅ Store hashed passwords (bcrypt)
- ✅ Store refresh tokens
- ✅ Store MFA secrets (encrypted)
- ✅ Store session data (if using server-side sessions)

---

## 🚀 Implementation Roadmap

### Phase 1: Enhanced JWT (Current + Improvements)
- [x] JWT-based authentication
- [ ] Move tokens to HTTP-only cookies
- [ ] Implement token refresh mechanism
- [ ] Add password strength validation
- [ ] Add rate limiting

### Phase 2: OAuth 2.0 Integration
- [ ] Install NextAuth.js
- [ ] Configure Google OAuth
- [ ] Configure Microsoft Azure AD
- [ ] Update login UI with OAuth buttons
- [ ] Test SSO flow

### Phase 3: Multi-Factor Authentication
- [ ] Implement TOTP (Google Authenticator)
- [ ] Add SMS OTP option
- [ ] Add email OTP option
- [ ] MFA setup UI
- [ ] MFA verification on login

### Phase 4: Advanced Security
- [ ] Account lockout mechanism
- [ ] Suspicious activity detection
- [ ] Password history (prevent reuse)
- [ ] Security audit logs
- [ ] IP whitelisting (optional)

---

## 🔧 Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRY=3600 # 1 hour in seconds
JWT_REFRESH_EXPIRY=604800 # 7 days

# OAuth 2.0 (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth 2.0 (Microsoft Azure AD)
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id

# Database
DATABASE_URL=your-database-connection-string

# Email Service (for OTP/Password Reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# SMS Service (for OTP)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📝 API Endpoints (Backend)

### Authentication Endpoints

```typescript
// POST /api/auth/register
// Register new user (admin only in standalone mode)
{
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  name: string;
}

// POST /api/auth/login
// Login with credentials
{
  email: string;
  password: string;
}
Response: {
  accessToken: string;
  refreshToken: string;
  user: { id, email, role, name };
}

// POST /api/auth/refresh
// Refresh access token
{
  refreshToken: string;
}
Response: {
  accessToken: string;
}

// POST /api/auth/logout
// Logout (invalidate tokens)
Headers: { Authorization: "Bearer <token>" }

// POST /api/auth/forgot-password
// Request password reset
{
  email: string;
}

// POST /api/auth/reset-password
// Reset password with token
{
  token: string;
  newPassword: string;
}

// POST /api/auth/verify-otp
// Verify MFA OTP
{
  userId: string;
  otp: string;
}

// POST /api/auth/enable-mfa
// Enable MFA for user
Headers: { Authorization: "Bearer <token>" }
Response: {
  qrCodeUrl: string; // QR code for authenticator app
  secret: string; // Backup codes
}
```

---

## 🎯 Recommended Approach for Standalone Mode

### **Best Option: Hybrid Approach** 🌟

1. **Primary:** OAuth 2.0 (Google/Microsoft) for enterprise customers
2. **Fallback:** Username/Password with JWT for smaller organizations
3. **Optional:** MFA for enhanced security

**Why this approach?**
- ✅ Supports both enterprise (SSO) and small organizations
- ✅ Better security with OAuth
- ✅ Flexible deployment options
- ✅ Industry-standard practices

### Implementation Priority:

1. **Immediate:** Enhance current JWT implementation
   - Move to HTTP-only cookies
   - Add token refresh
   - Add rate limiting

2. **Short-term:** Add OAuth 2.0
   - Google OAuth
   - Microsoft Azure AD
   - Update login UI

3. **Medium-term:** Add MFA
   - TOTP support
   - Optional for users

4. **Long-term:** Advanced security
   - Account lockout
   - Security audit logs
   - Anomaly detection

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## ⚠️ Security Checklist

- [ ] Use HTTPS only (production)
- [ ] Store tokens in HTTP-only cookies (not localStorage)
- [ ] Implement CSRF protection
- [ ] Validate all inputs (frontend + backend)
- [ ] Hash passwords with bcrypt (12+ rounds)
- [ ] Implement rate limiting
- [ ] Add account lockout
- [ ] Use secure session management
- [ ] Log security events
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling (don't leak info)

---

## 🆘 Support

For implementation questions or security concerns, please refer to:
- Project documentation
- Security team review
- OAuth provider documentation

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0.0

