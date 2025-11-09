'use server'

import { prisma } from '@/lib/prisma'
import { AdminStats } from '@/types'

export async function getAnalytics(): Promise<{ success: boolean; data?: AdminStats; error?: string }> {
  try {
    const [
      totalUniversities,
      totalCourses,
      totalQuestionPages,
      totalUsers,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.university.count(),
      prisma.course.count(),
      prisma.questionPage.count(),
      prisma.user.count(),
      prisma.user.count({
        where: {
          tier: 'PAID',
          subscriptionExpiresAt: {
            gte: new Date(),
          },
        },
      }),
    ])

    const stats: AdminStats = {
      totalUniversities,
      totalCourses,
      totalQuestions: totalQuestionPages * 4,
      totalUsers,
      activeSubscriptions,
      revenueThisMonth: activeSubscriptions * 9.99, // Placeholder calculation
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}

export async function getGrowthData() {
  try {
    // Get user registrations by month for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        tier: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group by month
    const monthlyData = users.reduce((acc: any[], user) => {
      const month = user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const existing = acc.find(item => item.month === month)

      if (existing) {
        existing.users++
        if (user.tier === 'PAID') existing.premium++
      } else {
        acc.push({
          month,
          users: 1,
          premium: user.tier === 'PAID' ? 1 : 0,
        })
      }

      return acc
    }, [])

    return { success: true, data: monthlyData }
  } catch (error) {
    console.error('Failed to fetch growth data:', error)
    return { success: false, error: 'Failed to fetch growth data' }
  }
}

export async function getCourseStats() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        university: true,
        _count: {
          select: {
            reviews: true,
            bookmarkedBy: true,
          },
        },
      },
      orderBy: {
        totalQuestions: 'desc',
      },
      take: 10,
    })

    return { success: true, data: courses }
  } catch (error) {
    console.error('Failed to fetch course stats:', error)
    return { success: false, error: 'Failed to fetch course stats' }
  }
}
