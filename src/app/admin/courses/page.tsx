'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaBook } from 'react-icons/fa'
import { getCourses, createCourse, updateCourse, deleteCourse, createSkill, deleteSkill } from '@/actions/courses'
import { getUniversities } from '@/actions/universities'
import { Course, University, Skill } from '@prisma/client'

type CourseWithRelations = Course & {
  university: University
  skills?: (Skill & { _count: { questionPages: number } })[]
  _count: { skills: number; reviews: number }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithRelations[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [coursesResult, universitiesResult] = await Promise.all([
      getCourses(),
      getUniversities(),
    ])

    if (coursesResult.success && coursesResult.data) {
      setCourses(coursesResult.data as CourseWithRelations[])
    }
    if (universitiesResult.success && universitiesResult.data) {
      setUniversities(universitiesResult.data)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = editingCourse
      ? await updateCourse(editingCourse.id, formData)
      : await createCourse(formData)

    if (result.success) {
      setIsModalOpen(false)
      setEditingCourse(null)
      loadData()
    } else {
      alert(result.error)
    }
    setSubmitting(false)
  }

  async function handleSkillSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await createSkill(formData)

    if (result.success) {
      setIsSkillModalOpen(false)
      setSelectedCourseId(null)
      loadData()
    } else {
      alert(result.error)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course? All skills and questions will be deleted.')) {
      return
    }

    const result = await deleteCourse(id)
    if (result.success) {
      loadData()
    } else {
      alert(result.error)
    }
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm('Delete this skill? All associated questions will be deleted.')) {
      return
    }

    const result = await deleteSkill(id)
    if (result.success) {
      loadData()
    } else {
      alert(result.error)
    }
  }

  function openModal(course?: Course) {
    setEditingCourse(course || null)
    setIsModalOpen(true)
  }

  function openSkillModal(courseId: string) {
    setSelectedCourseId(courseId)
    setIsSkillModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses & Skills</h1>
          <p className="text-gray-600 mt-2">Manage courses and their topics</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaBook className="text-primary-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{course.courseCode}</h3>
                        <span className="text-sm text-gray-500">{course.university.name}</span>
                      </div>
                      {course.summary && (
                        <p className="text-gray-600 mb-3">{course.summary}</p>
                      )}
                      <div className="flex gap-3">
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {course._count.skills} skills
                        </span>
                        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {course.totalQuestions} questions
                        </span>
                        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          {course._count.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openSkillModal(course.id)}
                      className="text-green-600 hover:text-green-800 px-3 py-2 border border-green-600 rounded-lg text-sm"
                      title="Add Skill"
                    >
                      Add Skill
                    </button>
                    <button
                      onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                      className="text-primary-600 hover:text-primary-800 px-3 py-2 border border-primary-600 rounded-lg text-sm"
                    >
                      {expandedCourse === course.id ? 'Hide' : 'Show'} Skills
                    </button>
                    <button
                      onClick={() => openModal(course)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Skills List */}
                {expandedCourse === course.id && course.skills && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Skills:</h4>
                    {course.skills.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {course.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{skill.name}</p>
                              <p className="text-sm text-gray-500">
                                {skill._count.questionPages} pages ({skill._count.questionPages * 4} questions)
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                              title="Delete Skill"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No skills added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">No courses found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourse ? 'Edit Course' : 'Add Course'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <select
                  name="universityId"
                  defaultValue={editingCourse?.universityId}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  defaultValue={editingCourse?.courseCode}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., CS101"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  defaultValue={editingCourse?.summary || ''}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Brief description of the course"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingCourse(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add Skill</h2>

            <form onSubmit={handleSkillSubmit}>
              <input type="hidden" name="courseId" value={selectedCourseId || ''} />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Variables & Data Types"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsSkillModalOpen(false)
                    setSelectedCourseId(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
