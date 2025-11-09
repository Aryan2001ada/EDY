'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch, FaUniversity, FaBook, FaStar } from 'react-icons/fa'
import Link from 'next/link'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Ace Your University Exams
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Access thousands of exam questions organized by university and course code.
              Study smarter, not harder.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by university or course code..."
                  className="w-full px-6 py-4 pr-12 text-lg rounded-lg border-2 border-gray-300 focus:border-primary-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <FaSearch />
                </button>
              </div>
            </form>

            <div className="mt-8">
              <Link
                href="/browse"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse All Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ExamPrep?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the most comprehensive exam preparation platform for university students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaUniversity className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Universities</h3>
              <p className="text-gray-600">
                Access exam materials from universities across the country
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaBook className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized by Course</h3>
              <p className="text-gray-600">
                Find questions easily organized by course code and skill
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaStar className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
              <p className="text-gray-600">
                Unlock unlimited access with our premium subscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Exam Prep Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of students who are already acing their exams
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  )
}
