'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaUniversity } from 'react-icons/fa'
import { getUniversities, createUniversity, updateUniversity, deleteUniversity } from '@/actions/universities'
import { University } from '@prisma/client'

type UniversityWithCount = University & {
  _count: { courses: number }
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityWithCount[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadUniversities()
  }, [])

  async function loadUniversities() {
    setLoading(true)
    const result = await getUniversities()
    if (result.success && result.data) {
      setUniversities(result.data as UniversityWithCount[])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = editingUniversity
      ? await updateUniversity(editingUniversity.id, formData)
      : await createUniversity(formData)

    if (result.success) {
      setIsModalOpen(false)
      setEditingUniversity(null)
      loadUniversities()
    } else {
      alert(result.error)
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this university? All associated courses will be deleted.')) {
      return
    }

    const result = await deleteUniversity(id)
    if (result.success) {
      loadUniversities()
    } else {
      alert(result.error)
    }
  }

  function openModal(university?: University) {
    setEditingUniversity(university || null)
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Universities</h1>
          <p className="text-gray-600 mt-2">Manage universities and exam deadlines</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Add University
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">University</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Exam Deadline</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Courses</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {universities.map((university) => (
                <tr key={university.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FaUniversity className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{university.name}</p>
                        <p className="text-sm text-gray-500">ID: {university.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {university.examDeadlineDate
                      ? new Date(university.examDeadlineDate).toLocaleDateString()
                      : 'Not set'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {university._count.courses} courses
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(university)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(university.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {universities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No universities found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingUniversity ? 'Edit University' : 'Add University'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Name *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUniversity?.name}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Stanford University"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Deadline
                </label>
                <input
                  type="date"
                  name="examDeadlineDate"
                  defaultValue={
                    editingUniversity?.examDeadlineDate
                      ? new Date(editingUniversity.examDeadlineDate).toISOString().split('T')[0]
                      : ''
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingUniversity(null)
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
                  {submitting ? 'Saving...' : editingUniversity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
