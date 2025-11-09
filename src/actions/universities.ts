'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const universitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  examDeadlineDate: z.string().optional().nullable(),
})

export async function getUniversities() {
  try {
    const universities = await prisma.university.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    return { success: true, data: universities }
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    return { success: false, error: 'Failed to fetch universities' }
  }
}

export async function getUniversity(id: string) {
  try {
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            _count: {
              select: { skills: true },
            },
          },
        },
      },
    })
    return { success: true, data: university }
  } catch (error) {
    console.error('Failed to fetch university:', error)
    return { success: false, error: 'Failed to fetch university' }
  }
}

export async function createUniversity(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      examDeadlineDate: formData.get('examDeadlineDate') as string | null,
    }

    const validated = universitySchema.parse(data)

    const university = await prisma.university.create({
      data: {
        name: validated.name,
        examDeadlineDate: validated.examDeadlineDate
          ? new Date(validated.examDeadlineDate)
          : null,
      },
    })

    revalidatePath('/admin/universities')
    revalidatePath('/browse')
    return { success: true, data: university }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to create university:', error)
    return { success: false, error: 'Failed to create university' }
  }
}

export async function updateUniversity(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      examDeadlineDate: formData.get('examDeadlineDate') as string | null,
    }

    const validated = universitySchema.parse(data)

    const university = await prisma.university.update({
      where: { id },
      data: {
        name: validated.name,
        examDeadlineDate: validated.examDeadlineDate
          ? new Date(validated.examDeadlineDate)
          : null,
      },
    })

    revalidatePath('/admin/universities')
    revalidatePath('/browse')
    revalidatePath(`/university/${id}`)
    return { success: true, data: university }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to update university:', error)
    return { success: false, error: 'Failed to update university' }
  }
}

export async function deleteUniversity(id: string) {
  try {
    await prisma.university.delete({
      where: { id },
    })

    revalidatePath('/admin/universities')
    revalidatePath('/browse')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete university:', error)
    return { success: false, error: 'Failed to delete university' }
  }
}
