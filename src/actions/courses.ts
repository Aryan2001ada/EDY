'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const courseSchema = z.object({
  universityId: z.string().min(1, 'University is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  summary: z.string().optional().nullable(),
})

const skillSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  name: z.string().min(1, 'Skill name is required'),
})

export async function getCourses(universityId?: string) {
  try {
    const courses = await prisma.course.findMany({
      where: universityId ? { universityId } : undefined,
      include: {
        university: true,
        _count: {
          select: { skills: true, reviews: true },
        },
      },
      orderBy: { courseCode: 'asc' },
    })
    return { success: true, data: courses }
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return { success: false, error: 'Failed to fetch courses' }
  }
}

export async function getCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        university: true,
        skills: {
          include: {
            _count: {
              select: { questionPages: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    })
    return { success: true, data: course }
  } catch (error) {
    console.error('Failed to fetch course:', error)
    return { success: false, error: 'Failed to fetch course' }
  }
}

export async function createCourse(formData: FormData) {
  try {
    const data = {
      universityId: formData.get('universityId') as string,
      courseCode: formData.get('courseCode') as string,
      summary: formData.get('summary') as string | null,
    }

    const validated = courseSchema.parse(data)

    const course = await prisma.course.create({
      data: {
        universityId: validated.universityId,
        courseCode: validated.courseCode,
        summary: validated.summary || null,
      },
      include: {
        university: true,
      },
    })

    revalidatePath('/admin/courses')
    revalidatePath(`/university/${validated.universityId}`)
    return { success: true, data: course }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to create course:', error)
    return { success: false, error: 'Failed to create course' }
  }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    const data = {
      universityId: formData.get('universityId') as string,
      courseCode: formData.get('courseCode') as string,
      summary: formData.get('summary') as string | null,
    }

    const validated = courseSchema.parse(data)

    const course = await prisma.course.update({
      where: { id },
      data: {
        courseCode: validated.courseCode,
        summary: validated.summary || null,
      },
      include: {
        university: true,
      },
    })

    revalidatePath('/admin/courses')
    revalidatePath(`/university/${course.universityId}`)
    revalidatePath(`/course/${id}`)
    return { success: true, data: course }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to update course:', error)
    return { success: false, error: 'Failed to update course' }
  }
}

export async function deleteCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      select: { universityId: true },
    })

    await prisma.course.delete({
      where: { id },
    })

    revalidatePath('/admin/courses')
    if (course) {
      revalidatePath(`/university/${course.universityId}`)
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to delete course:', error)
    return { success: false, error: 'Failed to delete course' }
  }
}

// Skills CRUD
export async function getSkills(courseId: string) {
  try {
    const skills = await prisma.skill.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { questionPages: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    return { success: true, data: skills }
  } catch (error) {
    console.error('Failed to fetch skills:', error)
    return { success: false, error: 'Failed to fetch skills' }
  }
}

export async function createSkill(formData: FormData) {
  try {
    const data = {
      courseId: formData.get('courseId') as string,
      name: formData.get('name') as string,
    }

    const validated = skillSchema.parse(data)

    const skill = await prisma.skill.create({
      data: validated,
    })

    revalidatePath('/admin/courses')
    revalidatePath(`/course/${validated.courseId}`)
    return { success: true, data: skill }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to create skill:', error)
    return { success: false, error: 'Failed to create skill' }
  }
}

export async function updateSkill(id: string, formData: FormData) {
  try {
    const data = {
      courseId: formData.get('courseId') as string,
      name: formData.get('name') as string,
    }

    const validated = skillSchema.parse(data)

    const skill = await prisma.skill.update({
      where: { id },
      data: { name: validated.name },
    })

    revalidatePath('/admin/courses')
    revalidatePath(`/course/${validated.courseId}`)
    return { success: true, data: skill }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Failed to update skill:', error)
    return { success: false, error: 'Failed to update skill' }
  }
}

export async function deleteSkill(id: string) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
      select: { courseId: true },
    })

    await prisma.skill.delete({
      where: { id },
    })

    revalidatePath('/admin/courses')
    if (skill) {
      revalidatePath(`/course/${skill.courseId}`)
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to delete skill:', error)
    return { success: false, error: 'Failed to delete skill' }
  }
}
