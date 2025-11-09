'use client'

import { useEffect, useState } from 'react'
import { FaUniversity, FaBook, FaQuestionCircle, FaUsers, FaChartLine, FaDollarSign } from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getAnalytics, getGrowthData, getCourseStats } from '@/actions/analytics'
import { AdminStats } from '@/types'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [growthData, setGrowthData] = useState<any[]>([])
  const [courseStats, setCourseStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [statsResult, growthResult, courseStatsResult] = await Promise.all([
      getAnalytics(),
      getGrowthData(),
      getCourseStats(),
    ])

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data)
    }
    if (growthResult.success && growthResult.data) {
      setGrowthData(growthResult.data)
    }
    if (courseStatsResult.success && courseStatsResult.data) {
      setCourseStats(courseStatsResult.data)
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data.</p>
      </div>
    )
  }

  const tierData = [
    { name: 'Free', value: stats.totalUsers - stats.activeSubscriptions },
    { name: 'Premium', value: stats.activeSubscriptions },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
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
              <FaDollarSign className="text-red-600 text-xl" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              ${stats.revenueThisMonth.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 font-medium">Monthly Revenue</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth</h2>
          {growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="premium" stroke="#8b5cf6" strokeWidth={2} name="Premium Users" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Not enough data yet</p>
          )}
        </div>

        {/* User Tier Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Courses by Questions</h2>
        {courseStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">University</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Questions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reviews</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bookmarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courseStats.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.courseCode}</td>
                    <td className="px-6 py-4 text-gray-600">{course.university.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {course.totalQuestions}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {course._count.reviews}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {course._count.bookmarkedBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No courses yet</p>
        )}
      </div>
    </div>
  )
}
