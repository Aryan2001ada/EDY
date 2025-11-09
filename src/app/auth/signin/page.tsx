'use client'

import { signIn } from 'next-auth/react'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your exam prep materials
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <FaGoogle className="text-xl" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn('facebook', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#166FE5] transition-colors"
          >
            <FaFacebook className="text-xl" />
            Continue with Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
