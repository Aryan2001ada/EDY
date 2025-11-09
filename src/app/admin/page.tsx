'use client'

import { useEffect, useState } from 'react'
import { FaUniversity, FaBook, FaQuestionCircle, FaUsers, FaChartLine, FaCalendar, FaStar, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import { getAnalytics } from '@/actions/analytics'
import { AdminStats } from '@/types'

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const result = await getAnalytics()
    if (result.success && result.data) {
      setStats(result.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the ExamPrep Admin Console
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUniversity className="text-blue-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalUniversities}</span>
            </div>
            <p className="text-gray-600 font-medium">Universities</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-green-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <p className="text-gray-600 font-medium">Courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaQuestionCircle className="text-purple-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</span>
            </div>
            <p className="text-gray-600 font-medium">Questions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-orange-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-yellow-600 text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</span>
            </div>
            <p className="text-gray-600 font-medium">Active Subscriptions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl font-bold">$</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">${stats.revenueThisMonth.toFixed(0)}</span>
            </div>
            <p className="text-gray-600 font-medium">Monthly Revenue</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/universities"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUniversity className="text-blue-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Universities</h3>
            <p className="text-sm text-gray-600">
              Add and manage universities, set exam deadlines
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-green-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Courses & Skills</h3>
            <p className="text-sm text-gray-600">
              Manage courses and organize topics by skills
            </p>
          </Link>

          <Link
            href="/admin/questions"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaQuestionCircle className="text-purple-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Question Bank</h3>
            <p className="text-sm text-gray-600">
              Create and edit questions with rich text, LaTeX, and code
            </p>
          </Link>

          <Link
            href="/admin/calendar"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-orange-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Exam Calendar</h3>
            <p className="text-sm text-gray-600">
              Track and manage exam deadlines
            </p>
          </Link>

          <Link
            href="/admin/reviews"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reviews</h3>
            <p className="text-sm text-gray-600">
              Curate and feature student reviews
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-red-600 text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">
              View platform insights and performance metrics
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
