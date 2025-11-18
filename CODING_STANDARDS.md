# Coding Standards & Best Practices

## 📋 Project Coding Standards

This document outlines the coding standards, do's and don'ts for the EduAdminHub Exam Portal project.

---

## 🎨 CSS & Styling Standards

### ✅ DO's

#### 1. **Use Global CSS Classes**
- Define reusable utility classes in `src/styles/globals.css`
- Create component-specific classes when needed
- Use Tailwind's `@apply` directive for custom classes

**Example:**
```css
/* globals.css */
.card-container {
  @apply border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition;
}

.stats-card {
  @apply flex flex-row items-center justify-between space-y-0 pb-2;
}
```

#### 2. **Reuse CSS Classes**
- Create reusable class names for common patterns
- Use semantic class names that describe purpose
- Group related styles together

**Example:**
```css
/* Reusable classes */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
```

#### 3. **Use Tailwind Utilities Sparingly**
- Only use inline Tailwind classes for one-off styles
- Prefer custom CSS classes for repeated patterns
- Keep inline classes minimal (max 3-4 utilities)

**Good:**
```tsx
<div className="card-container">
  <h2 className="text-2xl font-bold">Title</h2>
</div>
```

**Bad:**
```tsx
<div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Title</h2>
</div>
```

#### 4. **Organize CSS by Component/Section**
- Group related styles together
- Use comments to separate sections
- Follow BEM-like naming convention when needed

**Example:**
```css
/* ===== Dashboard Styles ===== */
.dashboard-container {
  @apply space-y-8;
}

.dashboard-header {
  @apply mb-6;
}

.dashboard-title {
  @apply text-3xl font-bold mb-2;
}

/* ===== Card Styles ===== */
.card-base {
  @apply border border-gray-200 rounded-lg p-4 bg-white;
}
```

---

### ❌ DON'Ts

#### 1. **Don't Write Excessive Inline Tailwind Classes**
- Avoid long chains of Tailwind utilities in JSX
- Don't repeat the same Tailwind classes across multiple components
- Don't mix too many utilities in a single className

**Bad:**
```tsx
<div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 min-h-screen">
```

**Good:**
```css
/* globals.css */
.page-container {
  @apply flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 min-h-screen;
}
```

```tsx
<div className="page-container">
```

#### 2. **Don't Duplicate Styles**
- Don't copy-paste the same Tailwind classes everywhere
- Don't create similar classes with slight variations
- Don't use inline styles when CSS classes can be used

#### 3. **Don't Mix Inline Styles with Tailwind**
- Avoid using `style` prop with Tailwind classes
- Don't use CSS-in-JS when Tailwind/CSS can handle it

**Bad:**
```tsx
<div className="p-4" style={{ backgroundColor: '#fff' }}>
```

**Good:**
```tsx
<div className="card-container">
```

---

## 🏗️ Component Structure Standards

### ✅ DO's

#### 1. **Separate Component Logic from Pages**
- Keep page.tsx files minimal (only imports and calls)
- Move component code to `components/` folder
- Follow the pattern: `page.tsx` → imports → `components/ComponentName.tsx`

**Example Structure:**
```
src/app/exam-portal/student-dashboard/
├── page.tsx                    (Simple import & call)
└── components/
    └── StudentDashboard.tsx    (Complete component code)
```

#### 2. **Use TypeScript Types**
- Define interfaces for props
- Use proper type annotations
- Avoid `any` types

**Example:**
```typescript
interface StudentDashboardProps {
  studentId: string;
  onUpdate?: () => void;
}

export default function StudentDashboard({ studentId, onUpdate }: StudentDashboardProps) {
  // Component code
}
```

#### 3. **Organize Imports**
- Group imports: React → Next.js → Third-party → Local
- Use absolute paths with `@/` alias
- Keep imports clean and organized

**Example:**
```typescript
// React
import { useState, useEffect } from "react";

// Next.js
import Link from "next/link";

// Third-party
import { toast } from "react-toastify";

// Local components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Local utilities
import { api } from "@/lib/api";
```

---

### ❌ DON'Ts

#### 1. **Don't Write Complete Code in page.tsx**
- Don't put all component logic in page files
- Don't mix page routing with component logic

**Bad:**
```tsx
// page.tsx
export default function StudentDashboardPage() {
  const [data, setData] = useState([]);
  // ... 200 lines of component code
  return <div>...</div>;
}
```

**Good:**
```tsx
// page.tsx
import StudentDashboard from "./components/StudentDashboard";

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
```

#### 2. **Don't Use `any` Types**
- Always define proper types
- Use TypeScript's type system effectively

#### 3. **Don't Create Deeply Nested Components**
- Keep component hierarchy flat
- Extract reusable components

---

## 📁 File Organization Standards

### ✅ DO's

#### 1. **Follow Consistent Folder Structure**
```
src/
├── app/                    # Next.js App Router pages
│   └── exam-portal/
│       └── student-dashboard/
│           ├── page.tsx
│           └── components/
│               └── StudentDashboard.tsx
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   └── custom/           # Custom components
├── lib/                  # Utilities and helpers
├── styles/               # Global styles
│   └── globals.css
└── types/                # TypeScript type definitions
```

#### 2. **Name Files Consistently**
- Use PascalCase for components: `StudentDashboard.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for pages: `student-dashboard/`

#### 3. **Group Related Files**
- Keep component files with their related components
- Keep utility functions in appropriate folders

---

## 🔧 Code Quality Standards

### ✅ DO's

#### 1. **Write Clean, Readable Code**
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

#### 2. **Handle Errors Properly**
- Use try-catch blocks for async operations
- Show user-friendly error messages
- Log errors for debugging

#### 3. **Optimize Performance**
- Use React.memo for expensive components
- Use useMemo and useCallback when needed
- Avoid unnecessary re-renders

#### 4. **Follow React Best Practices**
- Use hooks correctly (Rules of Hooks)
- Clean up effects properly
- Avoid prop drilling

---

### ❌ DON'Ts

#### 1. **Don't Ignore TypeScript Errors**
- Fix all TypeScript errors before committing
- Don't use `@ts-ignore` unless absolutely necessary

#### 2. **Don't Commit Console Logs**
- Remove console.log statements in production code
- Use proper logging utilities if needed

#### 3. **Don't Create God Components**
- Break down large components into smaller ones
- Follow Single Responsibility Principle

---

## 🎯 CSS Class Naming Conventions

### Recommended Patterns

#### 1. **Component-Based Classes**
```css
.student-dashboard-container { }
.student-dashboard-header { }
.student-dashboard-stats { }
```

#### 2. **Utility Classes**
```css
.flex-center {
  @apply flex items-center justify-center;
}

.text-primary {
  @apply text-blue-600 dark:text-blue-400;
}
```

#### 3. **State-Based Classes**
```css
.btn-active {
  @apply bg-green-500 hover:bg-green-600 text-white;
}

.btn-inactive {
  @apply bg-gray-400 hover:bg-gray-500 text-white;
}
```

---

## 📝 Example: Before & After

### ❌ Before (Bad Practice)
```tsx
// page.tsx - Too much code
export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 min-h-screen">
      <div className="space-y-8 w-full max-w-6xl">
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Student Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
```

### ✅ After (Good Practice)

**globals.css:**
```css
.page-container {
  @apply flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 min-h-screen;
}

.dashboard-wrapper {
  @apply space-y-8 w-full max-w-6xl;
}

.card-base {
  @apply border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition;
}

.page-title {
  @apply text-3xl font-bold mb-2 text-gray-900 dark:text-white;
}
```

**components/StudentDashboard.tsx:**
```tsx
export default function StudentDashboard() {
  return (
    <div className="page-container">
      <div className="dashboard-wrapper">
        <div className="card-base">
          <h1 className="page-title">Student Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
```

**page.tsx:**
```tsx
import StudentDashboard from "./components/StudentDashboard";

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
```

---

## 🔄 Migration Checklist

When refactoring existing code:

- [ ] Extract inline Tailwind classes to CSS file
- [ ] Create reusable CSS classes
- [ ] Move component code to components folder
- [ ] Simplify page.tsx to just import and call
- [ ] Remove duplicate styles
- [ ] Update all references to use new classes
- [ ] Test all functionality after refactoring

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Best Practices](https://nextjs.org/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Last Updated:** January 2025  
**Version:** 1.0.0

