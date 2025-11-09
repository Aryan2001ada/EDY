'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function getReviews(courseId?: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        course: {
          include: {
            university: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })
    return { success: true, data: reviews }
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return { success: false, error: 'Failed to fetch reviews' }
  }
}

export async function toggleFeaturedReview(id: string, isFeatured: boolean) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { isFeatured },
    })

    revalidatePath('/admin/reviews')
    revalidatePath(`/course/${review.courseId}`)
    return { success: true, data: review }
  } catch (error) {
    console.error('Failed to toggle featured review:', error)
    return { success: false, error: 'Failed to toggle featured review' }
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      select: { courseId: true },
    })

    await prisma.review.delete({
      where: { id },
    })

    revalidatePath('/admin/reviews')
    if (review) {
      revalidatePath(`/course/${review.courseId}`)
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to delete review:', error)
    return { success: false, error: 'Failed to delete review' }
  }
}
