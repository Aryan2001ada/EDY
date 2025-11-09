'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle } from 'react-icons/fa'
import { getQuestionPages, createQuestionPage, updateQuestionPage, deleteQuestionPage } from '@/actions/questions'
import { getCourses, getSkills } from '@/actions/courses'
import QuestionEditor from '@/components/admin/QuestionEditor'
import { Question } from '@/types'
import { QuestionPage, Skill, Course } from '@prisma/client'

type QuestionPageWithRelations = QuestionPage & {
  skill: Skill & {
    course: Course & {
      university: { name: string }
    }
  }
}

export default function QuestionsPage() {
  const [questionPages, setQuestionPages] = useState<QuestionPageWithRelations[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [selectedSkillId, setSelectedSkillId] = useState<string>('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<QuestionPageWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      loadSkills(selectedCourseId)
    } else {
      setSkills([])
      setSelectedSkillId('')
    }
  }, [selectedCourseId])

  async function loadData() {
    setLoading(true)
    const [pagesResult, coursesResult] = await Promise.all([
      getQuestionPages(),
      getCourses(),
    ])

    if (pagesResult.success && pagesResult.data) {
      setQuestionPages(pagesResult.data as QuestionPageWithRelations[])
    }
    if (coursesResult.success && coursesResult.data) {
      setCourses(coursesResult.data)
    }
    setLoading(false)
  }

  async function loadSkills(courseId: string) {
    const result = await getSkills(courseId)
    if (result.success && result.data) {
      setSkills(result.data)
    }
  }

  async function handleSave(questions: Question[]) {
    if (!selectedSkillId) {
      alert('Please select a skill')
      return
    }

    setSubmitting(true)

    const result = editingPage
      ? await updateQuestionPage(editingPage.id, { skillId: selectedSkillId, questions })
      : await createQuestionPage({ skillId: selectedSkillId, questions })

    if (result.success) {
      setIsEditorOpen(false)
      setEditingPage(null)
      setSelectedCourseId('')
      setSelectedSkillId('')
      loadData()
    } else {
      alert(result.error)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question page? This cannot be undone.')) {
      return
    }

    const result = await deleteQuestionPage(id)
    if (result.success) {
      loadData()
    } else {
      alert(result.error)
    }
  }

  function openEditor(page?: QuestionPageWithRelations) {
    if (page) {
      setEditingPage(page)
      setSelectedCourseId(page.skill.course.id)
      setSelectedSkillId(page.skill.id)
    } else {
      setEditingPage(null)
    }
    setIsEditorOpen(true)
  }

  return (
    <div>
      {!isEditorOpen ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
              <p className="text-gray-600 mt-2">Manage exam questions with rich text, LaTeX, and code</p>
            </div>
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus />
              Add Question Page
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {questionPages.map((page) => (
                <div key={page.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FaQuestionCircle className="text-primary-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{page.skill.name}</h3>
                        <p className="text-sm text-gray-600">
                          {page.skill.course.courseCode} - {page.skill.course.university.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(page.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditor(page)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(page.questions as Question[]).map((q, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Q{index + 1}: {q.question.replace(/<[^>]*>/g, '').slice(0, 80)}...
                        </p>
                        <p className="text-xs text-green-600">
                          Correct: {String.fromCharCode(65 + q.correctAnswer)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {questionPages.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600">No questions yet. Create your first question page!</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {editingPage ? 'Edit Question Page' : 'Create Question Page'}
          </h1>

          {!editingPage && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseCode} - {course.university.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Skill *
                  </label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    disabled={!selectedCourseId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Choose a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <QuestionEditor
              initialQuestions={editingPage ? (editingPage.questions as Question[]) : undefined}
              onSave={handleSave}
              onCancel={() => {
                setIsEditorOpen(false)
                setEditingPage(null)
                setSelectedCourseId('')
                setSelectedSkillId('')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
