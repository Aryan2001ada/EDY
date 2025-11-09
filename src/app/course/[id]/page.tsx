'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaStar, FaBookmark, FaLock } from 'react-icons/fa'
import { useSession } from 'next-auth/react'

// Placeholder data
const PLACEHOLDER_COURSE = {
  id: '1',
  courseCode: 'CS101',
  summary: 'Introduction to Computer Science - Learn the fundamentals of programming, data structures, and algorithms.',
  totalQuestions: 120,
  universityId: '1',
  universityName: 'Stanford University',
  skills: [
    { id: '1', name: 'Variables & Data Types', questionCount: 30 },
    { id: '2', name: 'Control Flow', questionCount: 25 },
    { id: '3', name: 'Functions', questionCount: 35 },
    { id: '4', name: 'Arrays & Lists', questionCount: 30 },
  ],
}

const PLACEHOLDER_REVIEWS = [
  {
    id: '1',
    userName: 'John Doe',
    rating: 5,
    text: 'Excellent resource! Helped me ace my exam.',
    isFeatured: true,
    submittedAt: '2024-11-01',
  },
  {
    id: '2',
    userName: 'Jane Smith',
    rating: 4,
    text: 'Great questions, very similar to the actual exam.',
    isFeatured: false,
    submittedAt: '2024-10-28',
  },
]

export default function CoursePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/university/${PLACEHOLDER_COURSE.universityId}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft />
          <span>Back to {PLACEHOLDER_COURSE.universityName}</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {PLACEHOLDER_COURSE.courseCode}
              </h1>
              <p className="text-gray-600 text-lg">
                {PLACEHOLDER_COURSE.universityName}
              </p>
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaBookmark className="text-xl" />
            </button>
          </div>

          <p className="text-gray-700 mb-4">{PLACEHOLDER_COURSE.summary}</p>

          <div className="flex items-center gap-4">
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium">
              {PLACEHOLDER_COURSE.totalQuestions} Total Questions
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600">(4.8)</span>
            </div>
          </div>
        </div>

        {/* Skills/Topics */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Skills & Topics
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {PLACEHOLDER_COURSE.skills.map((skill, index) => (
              <div
                key={skill.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-600 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {skill.questionCount} questions
                    </p>
                  </div>
                  {session?.user?.tier === 'FREE' && index >= 2 ? (
                    <FaLock className="text-gray-400" />
                  ) : (
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                      Practice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {session?.user?.tier === 'FREE' && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Upgrade to Premium</strong> to unlock all {PLACEHOLDER_COURSE.totalQuestions} questions!
              </p>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Student Reviews
          </h2>

          <div className="space-y-4">
            {PLACEHOLDER_REVIEWS.map((review) => (
              <div
                key={review.id}
                className={`border rounded-lg p-4 ${
                  review.isFeatured ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{review.submittedAt}</span>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This is placeholder data. Connect to your database to see real course information.
          </p>
        </div>
      </div>
    </div>
  )
}
