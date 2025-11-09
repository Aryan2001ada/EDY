'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUniversity, FaBook, FaQuestionCircle, FaCalendar, FaStar, FaChartBar, FaHome } from 'react-icons/fa'

const navItems = [
  { href: '/admin', icon: FaHome, label: 'Dashboard' },
  { href: '/admin/universities', icon: FaUniversity, label: 'Universities' },
  { href: '/admin/courses', icon: FaBook, label: 'Courses' },
  { href: '/admin/questions', icon: FaQuestionCircle, label: 'Questions' },
  { href: '/admin/calendar', icon: FaCalendar, label: 'Calendar' },
  { href: '/admin/reviews', icon: FaStar, label: 'Reviews' },
  { href: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen p-6 fixed left-0 top-0">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-primary-400">
          ExamPrep Admin
        </Link>
      </div>

      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </nav>
  )
}
