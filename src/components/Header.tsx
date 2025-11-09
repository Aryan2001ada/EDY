'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FaUser, FaSignOutAlt, FaBookmark } from 'react-icons/fa'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              ExamPrep
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Universities
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <div className="flex items-center gap-4">
                {session.user.tier === 'PAID' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Premium
                  </span>
                )}
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  title="Profile"
                >
                  <FaBookmark className="text-xl" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
