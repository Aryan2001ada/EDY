# ExamPrep - University Exam Preparation Platform

A freemium SaaS platform for university students to access and practice exam questions, similar to BrainDump.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google & Facebook OAuth)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
EDY/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/
│   │   │   └── auth/         # NextAuth API routes
│   │   ├── auth/
│   │   │   └── signin/       # Sign in page
│   │   ├── browse/           # Browse universities
│   │   ├── course/
│   │   │   └── [id]/        # Course detail page
│   │   ├── university/
│   │   │   └── [id]/        # University courses page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx
│   ├── lib/                  # Utilities and configs
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # App constants
│   └── types/               # TypeScript types
│       ├── index.ts
│       └── next-auth.d.ts
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## Database Schema

### Core Entities

- **User**: Students with OAuth authentication and subscription tiers (FREE/PAID)
- **University**: Universities with exam deadlines
- **Course**: Courses linked to universities with course codes
- **Skill**: Topics/skills within each course
- **QuestionPage**: Pages containing 4 questions each
- **Review**: Course reviews by students
- **UserCourse**: Bookmarked courses for each user

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Google OAuth credentials
- Facebook OAuth credentials
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EDY
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then fill in your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/exam_prep_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Facebook OAuth
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. **Set up the database**
   ```bash
   # Create database migration
   npx prisma migrate dev --name init

   # Generate Prisma client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. Copy the App ID and App Secret to your `.env` file

## Database Management

### Prisma Studio

View and edit your database with Prisma Studio:
```bash
npx prisma studio
```

### Creating Migrations

After changing the schema:
```bash
npx prisma migrate dev --name your_migration_name
```

### Resetting the Database

```bash
npx prisma migrate reset
```

## Features

### For Students (FREE Tier)
- Browse universities and courses
- Access first 2 topics per course
- View course summaries and reviews
- Bookmark courses
- OAuth authentication

### For Students (PAID Tier)
- Unlimited access to all questions
- All topics and skills unlocked
- Priority support
- Early access to new content

### For Admin
- Add/edit universities
- Manage courses and skills
- Upload exam questions
- View platform statistics
- Manage user subscriptions

## Development Roadmap

### Phase 1: Setup ✅
- [x] Initialize Next.js project
- [x] Set up Prisma with PostgreSQL
- [x] Configure NextAuth.js
- [x] Create basic layout and pages
- [x] Set up TypeScript types

### Phase 2: Core Features (Next)
- [ ] Implement database CRUD operations
- [ ] Build admin management interface
- [ ] Create question practice pages
- [ ] Add search functionality
- [ ] Implement bookmark system

### Phase 3: Premium Features
- [ ] Integrate Stripe payments
- [ ] Add subscription management
- [ ] Implement access control by tier
- [ ] Add user dashboard/profile

### Phase 4: Enhancement
- [ ] Add analytics and reporting
- [ ] Implement question filtering
- [ ] Add progress tracking
- [ ] Create mobile-responsive design improvements
- [ ] Add email notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

This is a solo project. For questions or suggestions, please contact the administrator.

## License

Private - All rights reserved
