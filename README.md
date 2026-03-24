# haleel.org

Online learning platform for JHS and SHS students in Ghana. Practice BECE & WASSCE past questions, take mock exams, and track academic performance.

## Features

- **Dual Portal System**: Separate JHS (BECE) and SHS (WASSCE) portals
- **Practice Mode**: Subject-based practice with instant feedback and explanations
- **Mock Exams**: Timed exams simulating real BECE/WASSCE conditions
- **Progress Tracking**: Performance analytics, best/weak subjects, score history
- **Admin Panel**: Full question bank management (CRUD)
- **Mobile-First**: Responsive design optimized for mobile devices

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd haleel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL connection string and JWT secret.

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Seed the database:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@haleel.org | admin123 |
| JHS Student | jhs@haleel.org | student123 |
| SHS Student | shs@haleel.org | student123 |

## Project Structure

```
haleel/
  prisma/
    schema.prisma       # Database schema
    seed.ts             # Seed script with subjects & questions
  src/
    app/
      api/              # API routes (auth, subjects, questions, progress)
      admin/            # Admin panel pages
      jhs/              # JHS portal pages
      shs/              # SHS portal pages
      login/            # Login page
      signup/           # Signup page
      page.tsx          # Landing page
    components/         # Shared React components
    hooks/              # Custom React hooks
    lib/                # Utilities (db, auth)
```

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
