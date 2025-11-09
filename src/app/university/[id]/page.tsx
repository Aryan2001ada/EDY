'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaBook, FaSearch, FaArrowLeft } from 'react-icons/fa'

// Placeholder data - will be replaced with actual database queries
const PLACEHOLDER_COURSES = [
  { id: '1', courseCode: 'CS101', summary: 'Introduction to Computer Science', totalQuestions: 120 },
  { id: '2', courseCode: 'MATH200', summary: 'Calculus II', totalQuestions: 95 },
  { id: '3', courseCode: 'PHYS150', summary: 'Physics I', totalQuestions: 85 },
]

export default function UniversityPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = PLACEHOLDER_COURSES.filter((course) =>
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft />
          <span>Back to Universities</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            University Courses
          </h1>
          <p className="text-gray-600 text-lg">
            Browse available courses and start preparing for your exams
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course code..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-primary-600 focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaBook className="text-primary-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.courseCode}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {course.summary}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {course.totalQuestions} questions
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No courses found matching your search.
            </p>
          </div>
        )}

        {/* Placeholder Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This is placeholder data. Connect to your database to see real courses.
          </p>
        </div>
      </div>
    </div>
  )
}
