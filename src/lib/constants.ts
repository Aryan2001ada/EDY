// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    questionsPerCourse: 2, // First 2 skills only
    features: [
      'Access to basic questions',
      'Limited to 2 topics per course',
      'View course summaries',
    ],
  },
  PAID: {
    name: 'Premium',
    price: 9.99, // per month
    questionsPerCourse: -1, // unlimited
    features: [
      'Unlimited access to all questions',
      'All topics and skills',
      'Priority support',
      'Early access to new content',
      'Download study materials',
    ],
  },
} as const

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Question limits
export const QUESTIONS_PER_PAGE = 4 // As specified in requirements
export const MIN_RATING = 1
export const MAX_RATING = 5

// Admin role email (you can change this to your email)
export const ADMIN_EMAILS = [
  'admin@example.com',
  // Add your email here
]

// OAuth providers
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  UNIVERSITY: (id: string) => `/university/${id}`,
  COURSE: (id: string) => `/course/${id}`,
  ADMIN: '/admin',
  SIGNIN: '/auth/signin',
  PROFILE: '/profile',
} as const
