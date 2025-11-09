import { University, Course, Skill, QuestionPage, Review, User, UserTier } from '@prisma/client'

// Extended types with relations
export type UniversityWithCourses = University & {
  courses: Course[]
}

export type CourseWithRelations = Course & {
  university: University
  skills: Skill[]
  reviews: Review[]
  _count?: {
    bookmarkedBy: number
  }
}

export type SkillWithQuestions = Skill & {
  questionPages: QuestionPage[]
}

export type ReviewWithUser = Review & {
  user: {
    name: string | null
    image: string | null
  }
}

// Question structure (stored in JSON)
export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option (0-3)
  explanation?: string
}

// Search params
export interface SearchParams {
  search?: string
  university?: string
  courseCode?: string
}

// Pagination
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Subscription status
export interface SubscriptionStatus {
  isActive: boolean
  expiresAt: Date | null
  tier: UserTier
}

// Stats for admin
export interface AdminStats {
  totalUniversities: number
  totalCourses: number
  totalQuestions: number
  totalUsers: number
  activeSubscriptions: number
  revenueThisMonth: number
}
