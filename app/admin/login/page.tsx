"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 md:p-4">
      <Card className="w-full max-w-md p-6 md:p-8 bg-white/95 backdrop-blur shadow-2xl rounded-lg md:rounded-xl">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="w-14 md:w-16 h-14 md:h-16 bg-amber-600 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <Lock className="w-7 md:w-8 h-7 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-xs md:text-base text-gray-600 mt-2">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2">
              Admin Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="h-10 md:h-12 text-xs md:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="h-10 md:h-12 pr-10 md:pr-12 text-xs md:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 md:w-5 h-4 md:h-5" />
                ) : (
                  <Eye className="w-4 md:w-5 h-4 md:h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs md:text-sm text-amber-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 md:h-12 bg-amber-600 hover:bg-amber-700 text-white text-sm md:text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
