"use client"

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast"
import { useAuthStore } from "@/store/authStore"
import { Mail, Lock } from "lucide-react"

export default function SignInForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      toast.success('Login successful!')
      
      // Redirect based on user role
      setTimeout(() => {
        navigate('/shopkeeper/dashboard')
      }, 500)
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
      setErrors({ password: error.message || 'Invalid credentials' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md border bg-background">
      <CardContent className="p-6">
        <form onSubmit={handleSignIn} className="flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2 px-2 py-6">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1 px-2">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2 border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-ring">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Remember me & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            variant="default" 
            className="w-full h-12 text-base font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Social login buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="outline"
              className="w-full h-12 rounded-lg flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-lg flex items-center justify-center gap-3"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" width={20} height={20} />
              Continue with Apple
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-lg flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/303615/github-icon-1-logo.svg" alt="GitHub" width={20} height={20} />
              Continue with GitHub
            </Button>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account?{' '}
            <span 
              className="text-primary cursor-pointer hover:underline"
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
