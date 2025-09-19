'use client'

import { useState, useEffect } from 'react'
import { signIn, getProviders, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Github, Mail, Eye, EyeOff } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Theme handled automatically by Tailwind dark: classes
  
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  useEffect(() => {
    if (errorParam) {
      setError('Authentication failed. Please try again.')
    }
  }, [errorParam])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Please try again.')
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl })
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white">
            You are already signed in. Redirecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Sign in to continue your Sentry Academy journey
            </p>
          </div>

          <div className="rounded-2xl p-8 backdrop-blur-sm border bg-white/75 border-purple-400/40 dark:bg-slate-900/40 dark:border-purple-500/30">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-700">
                {error}
              </div>
            )}

            {/* Social Sign In */}
            {providers && (
              <div className="space-y-3 mb-6">
                {providers.google && (
                  <button
                    onClick={() => handleProviderSignIn('google')}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-600"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                )}

                {providers.github && (
                  <button
                    onClick={() => handleProviderSignIn('github')}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] bg-gray-900 hover:bg-gray-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600"
                  >
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center text-gray-400 dark:text-gray-500">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/75 text-gray-500 dark:bg-slate-900/40 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => {/* For demo purposes, you can implement sign up later */}}
                className="font-medium hover:underline text-purple-600 dark:text-purple-400"
              >
                Contact your administrator
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}