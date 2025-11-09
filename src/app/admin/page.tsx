'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FaUniversity, FaBook, FaQuestionCircle, FaUsers, FaChartLine } from 'react-icons/fa'
import Link from 'next/link'

// Placeholder stats
const STATS = {
  totalUniversities: 12,
  totalCourses: 156,
  totalQuestions: 3420,
  totalUsers: 1245,
  activeSubscriptions: 342,
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'universities' | 'courses' | 'questions'>('overview')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You must be signed in to access the admin panel.
          </p>
          <Link
            href="/auth/signin"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage universities, courses, and exam questions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FaUniversity className="text-primary-600 text-2xl" />
              <span className="text-3xl font-bold text-gray-900">
                {STATS.totalUniversities}
              </span>
            </div>
            <p className="text-gray-600">Universities</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FaBook className="text-primary-600 text-2xl" />
              <span className="text-3xl font-bold text-gray-900">
                {STATS.totalCourses}
              </span>
            </div>
            <p className="text-gray-600">Courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FaQuestionCircle className="text-primary-600 text-2xl" />
              <span className="text-3xl font-bold text-gray-900">
                {STATS.totalQuestions}
              </span>
            </div>
            <p className="text-gray-600">Questions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-primary-600 text-2xl" />
              <span className="text-3xl font-bold text-gray-900">
                {STATS.totalUsers}
              </span>
            </div>
            <p className="text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-primary-600 text-2xl" />
              <span className="text-3xl font-bold text-gray-900">
                {STATS.activeSubscriptions}
              </span>
            </div>
            <p className="text-gray-600">Subscriptions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('universities')}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'universities'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Universities
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'questions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Questions
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition-colors text-left">
                  <h3 className="font-semibold mb-1">Add University</h3>
                  <p className="text-sm text-primary-100">
                    Create a new university entry
                  </p>
                </button>
                <button className="bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition-colors text-left">
                  <h3 className="font-semibold mb-1">Add Course</h3>
                  <p className="text-sm text-primary-100">
                    Add a new course to a university
                  </p>
                </button>
                <button className="bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition-colors text-left">
                  <h3 className="font-semibold mb-1">Add Questions</h3>
                  <p className="text-sm text-primary-100">
                    Upload new exam questions
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'universities' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Universities
                </h2>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Add New
                </button>
              </div>
              <p className="text-gray-600">
                University management interface will be implemented here.
              </p>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Courses
                </h2>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Add New
                </button>
              </div>
              <p className="text-gray-600">
                Course management interface will be implemented here.
              </p>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Questions
                </h2>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Upload Questions
                </button>
              </div>
              <p className="text-gray-600">
                Question management interface will be implemented here.
              </p>
            </div>
          )}
        </div>

        {/* Placeholder Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            <strong>Note:</strong> This is a placeholder admin interface. Full CRUD functionality will be implemented in the next phase.
          </p>
        </div>
      </div>
    </div>
  )
}
