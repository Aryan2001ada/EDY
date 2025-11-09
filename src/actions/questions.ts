'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Question } from '@/types'

const questionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).length(4, 'Must have exactly 4 options'),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
})

const questionPageSchema = z.object({
  skillId: z.string().min(1, 'Skill is required'),
  questions: z.array(questionSchema).length(4, 'Must have exactly 4 questions'),
})

export async function getQuestionPages(skillId?: string) {
  try {
    const questionPages = await prisma.questionPage.findMany({
      where: skillId ? { skillId } : undefined,
      include: {
        skill: {
          include: {
            course: {
              include: {
                university: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: questionPages }
  } catch (error) {
    console.error('Failed to fetch question pages:', error)
    return { success: false, error: 'Failed to fetch question pages' }
  }
}

export async function getQuestionPage(id: string) {
  try {
    const questionPage = await prisma.questionPage.findUnique({
      where: { id },
      include: {
        skill: {
          include: {
            course: {
              include: {
                university: true,
              },
            },
          },
        },
      },
    })
    return { success: true, data: questionPage }
  } catch (error) {
    console.error('Failed to fetch question page:', error)
    return { success: false, error: 'Failed to fetch question page' }
  }
}

export async function createQuestionPage(data: {
  skillId: string
  questions: Question[]
}) {
  try {
    const validated = questionPageSchema.parse(data)

    const questionPage = await prisma.questionPage.create({
      data: {
        skillId: validated.skillId,
        questions: validated.questions,
      },
    })

    // Update course total questions count
    const skill = await prisma.skill.findUnique({
      where: { id: validated.skillId },
      select: { courseId: true },
    })

    if (skill) {
      const totalQuestions = await prisma.questionPage.count({
        where: {
          skill: {
            courseId: skill.courseId,
          },
        },
      })

      await prisma.course.update({
        where: { id: skill.courseId },
        data: { totalQuestions: totalQuestions * 4 },
      })

      revalidatePath(`/course/${skill.courseId}`)
    }

    revalidatePath('/admin/questions')
    return { success: true, data: questionPage }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to create question page:', error)
    return { success: false, error: 'Failed to create question page' }
  }
}

export async function updateQuestionPage(
  id: string,
  data: {
    skillId: string
    questions: Question[]
  }
) {
  try {
    const validated = questionPageSchema.parse(data)

    const questionPage = await prisma.questionPage.update({
      where: { id },
      data: {
        questions: validated.questions,
      },
    })

    const skill = await prisma.skill.findUnique({
      where: { id: validated.skillId },
      select: { courseId: true },
    })

    if (skill) {
      revalidatePath(`/course/${skill.courseId}`)
    }

    revalidatePath('/admin/questions')
    return { success: true, data: questionPage }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to update question page:', error)
    return { success: false, error: 'Failed to update question page' }
  }
}

export async function deleteQuestionPage(id: string) {
  try {
    const questionPage = await prisma.questionPage.findUnique({
      where: { id },
      include: {
        skill: {
          select: { courseId: true },
        },
      },
    })

    await prisma.questionPage.delete({
      where: { id },
    })

    // Update course total questions count
    if (questionPage?.skill) {
      const totalQuestions = await prisma.questionPage.count({
        where: {
          skill: {
            courseId: questionPage.skill.courseId,
          },
        },
      })

      await prisma.course.update({
        where: { id: questionPage.skill.courseId },
        data: { totalQuestions: totalQuestions * 4 },
      })

      revalidatePath(`/course/${questionPage.skill.courseId}`)
    }

    revalidatePath('/admin/questions')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete question page:', error)
    return { success: false, error: 'Failed to delete question page' }
  }
}
