'use client'

import { useEffect, useState } from 'react'
import { FaStar, FaTrash, FaTrophy } from 'react-icons/fa'
import { getReviews, toggleFeaturedReview, deleteReview } from '@/actions/reviews'
import { Review, User, Course } from '@prisma/client'

type ReviewWithRelations = Review & {
  user: Pick<User, 'name' | 'email' | 'image'>
  course: Course & {
    university: { name: string }
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>([])
  const [filter, setFilter] = useState<'all' | 'featured' | 'pending'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    setLoading(true)
    const result = await getReviews()
    if (result.success && result.data) {
      setReviews(result.data as ReviewWithRelations[])
    }
    setLoading(false)
  }

  async function handleToggleFeatured(id: string, currentStatus: boolean) {
    const result = await toggleFeaturedReview(id, !currentStatus)
    if (result.success) {
      loadReviews()
    } else {
      alert(result.error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review? This cannot be undone.')) {
      return
    }

    const result = await deleteReview(id)
    if (result.success) {
      loadReviews()
    } else {
      alert(result.error)
    }
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'featured') return review.isFeatured
    if (filter === 'pending') return !review.isFeatured
    return true
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Curation</h1>
          <p className="text-gray-600 mt-2">Manage and feature student reviews</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'featured'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Featured ({reviews.filter((r) => r.isFeatured).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Not Featured ({reviews.filter((r) => !r.isFeatured).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                review.isFeatured ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    {review.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaTrophy />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="font-semibold text-gray-900">{review.course.courseCode}</p>
                    <p className="text-sm text-gray-600">{review.course.university.name}</p>
                  </div>

                  <p className="text-gray-700 mb-3">{review.text}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By: {review.user.name || review.user.email}</span>
                    <span>•</span>
                    <span>{new Date(review.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleToggleFeatured(review.id, review.isFeatured)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      review.isFeatured
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {review.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors flex items-center gap-2 justify-center"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'No reviews yet.'
                  : filter === 'featured'
                  ? 'No featured reviews yet.'
                  : 'No pending reviews.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
