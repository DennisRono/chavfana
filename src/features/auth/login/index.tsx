'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sprout, Phone, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import { toast } from 'sonner'
import Link from 'next/link'
import { login, register } from '@/store/actions/auth'
import { LoginCredentials, RegisterData } from '@/types/auth'

const LoginView = () => {
  const loading = false
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone_number'>(
    'email'
  )
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    password: '',
  })

  const dispatch = useAppDispatch<AppDispatch>()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    dispatch(
      login({
        ...(formData.email !== '' && loginMethod === 'email'
          ? { email: formData.email }
          : {}),
        ...(formData.phone_number !== '' && loginMethod === 'phone_number'
          ? { phone_number: formData.phone_number }
          : {}),
        password: formData.password,
      } as LoginCredentials)
    )
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    dispatch(
      register({
        ...(formData.email !== '' ? { email: formData.email } : {}),
        ...(formData.phone_number !== ''
          ? { phone_number: formData.phone_number }
          : {}),
        first_name: formData.first_name,
        last_name: formData.last_name,
        password1: formData.password1,
        password2: formData.password2,
      } as RegisterData)
    )
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link className="p-3 bg-primary rounded-full" href="/">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </Link>
          </div>
          <CardTitle className="text-2xl">
            Farm Information Management
          </CardTitle>
          <p className="text-muted-foreground">Manage your farm efficiently</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={loginMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={
                      loginMethod === 'phone_number' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setLoginMethod('phone_number')}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={loginMethod}>
                    {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                  </Label>
                  <Input
                    id={loginMethod}
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={
                      loginMethod === 'email'
                        ? 'Enter your email'
                        : 'Enter your phone_number number'
                    }
                    value={
                      loginMethod === 'email'
                        ? formData.email
                        : formData.phone_number
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [loginMethod]: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={loginMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLoginMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={
                      loginMethod === 'phone_number' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setLoginMethod('phone_number')}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`register-${loginMethod}`}>
                    {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                  </Label>
                  <Input
                    id={`register-${loginMethod}`}
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={
                      loginMethod === 'email'
                        ? 'Enter your email'
                        : 'Enter your phone_number number'
                    }
                    value={
                      loginMethod === 'email'
                        ? formData.email
                        : formData.phone_number
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [loginMethod]: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password1: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.password2}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password2: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Registering...' : 'Register Farm'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginView
