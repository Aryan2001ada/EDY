'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaUniversity, FaCalendar, FaSearch } from 'react-icons/fa'

// Placeholder data - will be replaced with actual database queries
const PLACEHOLDER_UNIVERSITIES = [
  { id: '1', name: 'Stanford University', examDeadlineDate: '2024-12-15', courseCount: 45 },
  { id: '2', name: 'MIT', examDeadlineDate: '2024-12-20', courseCount: 38 },
  { id: '3', name: 'UC Berkeley', examDeadlineDate: '2024-12-18', courseCount: 52 },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUniversities = PLACEHOLDER_UNIVERSITIES.filter((uni) =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Universities
          </h1>
          <p className="text-gray-600 text-lg">
            Select your university to view available courses and exam materials
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search universities..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-primary-600 focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <Link
              key={university.id}
              href={`/university/${university.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaUniversity className="text-primary-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {university.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaCalendar className="text-gray-400" />
                    <span>Exam Deadline: {university.examDeadlineDate}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {university.courseCount} courses available
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No universities found matching your search.
            </p>
          </div>
        )}

        {/* Placeholder Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This is placeholder data. Connect to your database to see real universities.
          </p>
        </div>
      </div>
    </div>
  )
}
