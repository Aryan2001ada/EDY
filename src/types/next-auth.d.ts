import { UserTier } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      tier?: UserTier
      subscriptionExpiresAt?: Date | null
    }
  }

  interface User {
    tier: UserTier
    subscriptionExpiresAt?: Date | null
  }
}
