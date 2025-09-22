# Sentry Academy - Development Guide

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd sentry-academy

# Install dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env.local

# Set up the database
pnpm db:generate
pnpm db:migrate

# Start development server
pnpm dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── concepts/          # Educational content
│   ├── courses/           # Course pages
│   └── learning-paths/    # Learning path routes
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── auth/              # Authentication components
│   └── forms/             # Form components
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   ├── db/                # Database schema & client
│   └── seo.ts             # SEO utilities
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── services/              # External services
├── types/                 # TypeScript types
└── utils/                 # Utility functions
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework

### Backend

- **Next.js Server Actions** - Backend API
- **Drizzle ORM** - Database ORM
- **Neon Postgres** - Serverless database
- **NextAuth.js** - Authentication

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🗄️ Database Setup

1. **Create a Neon Database**
   - Visit [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the database URL

2. **Configure Environment Variables**

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Run Migrations**
   ```bash
   pnpm db:generate  # Generate migration files
   pnpm db:migrate   # Apply migrations
   pnpm db:studio    # Open database studio (optional)
   ```

## 🧪 Scripts

```bash
# Development
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server

# Code Quality
pnpm lint           # Run ESLint
pnpm lint:fix       # Fix ESLint errors
pnpm format         # Format code with Prettier
pnpm format:check   # Check code formatting
pnpm type-check     # Run TypeScript checks

# Database
pnpm db:generate    # Generate database migrations (CI-aware)
pnpm db:migrate     # Run database migrations
pnpm db:seed        # Populate database with sample data
pnpm db:studio      # Open Drizzle Studio
pnpm db:health      # Check database connectivity
pnpm db:check       # Quick data validation
pnpm db:reset       # Reset database (drops all data!)
```

## 🎯 Development Workflow

1. **Branch Creation**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following TypeScript strict mode
   - Use consistent formatting (Prettier)
   - Follow component naming conventions

3. **Code Quality Checks**

   ```bash
   pnpm lint:fix       # Fix linting issues
   pnpm format         # Format code
   pnpm type-check     # Check types
   ```

4. **Testing Changes**
   ```bash
   pnpm build          # Test production build
   pnpm dev            # Test in development
   ```

## 📝 Code Style Guide

### TypeScript

- Use strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use proper types or `unknown`

### React Components

- Use functional components with hooks
- Prefer `const` declarations for components
- Use proper TypeScript interfaces for props
- Implement proper loading and error states

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` (e.g., `useUserData.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`

### Import Organization

```typescript
// 1. React and Next.js
import React from 'react'
import { NextPage } from 'next'

// 2. External libraries
import { Lucide } from 'lucide-react'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

// 4. Relative imports
import './styles.css'
```

## 🚦 Performance Guidelines

### Images

- Use `next/image` component for all images
- Provide proper `width` and `height` attributes
- Use `priority` for above-the-fold images
- Optimize image formats (WebP, AVIF)

### Code Splitting

- Use dynamic imports for heavy components
- Implement proper loading states
- Use React.Suspense for progressive loading

### Database

- Use proper indexing for queries
- Implement caching where appropriate
- Use server components for data fetching

## 🔧 Environment Variables

### Required

```env
DATABASE_URL=          # Neon Postgres connection string
NEXTAUTH_SECRET=       # Secret for NextAuth.js (32+ chars)
NEXTAUTH_URL=          # Base URL for auth callbacks
```

### Optional

```env
OPENAI_API_KEY=       # For AI-powered features
VERCEL_ANALYTICS_ID=  # Analytics tracking
SENTRY_DSN=           # Error monitoring
```

## 🐛 Debugging

### Development Tools

- **React DevTools** - Component debugging
- **Next.js DevTools** - Performance insights
- **Drizzle Studio** - Database inspection

### Common Issues

1. **Build Errors**
   - Run `pnpm type-check` for TypeScript errors
   - Check environment variables are set
   - Verify database connection

2. **Runtime Errors**
   - Check browser console for client errors
   - Review server logs for API errors
   - Use error boundaries for graceful failures

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Build

```bash
pnpm build
pnpm start
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Follow the development workflow above
2. Ensure all tests pass and code is properly formatted
3. Write clear commit messages
4. Update documentation when needed
5. Create pull requests with detailed descriptions

---

Need help? Check the existing documentation or ask the development team!
