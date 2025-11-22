'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, LogIn } from 'lucide-react'
import AdminDashboard from '@/components/admin-dashboard'
import StudentDashboard from '@/components/student-dashboard'

type UserRole = 'admin' | 'student' | null

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>(null)
  const [name, setName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && role) {
      setIsLoggedIn(true)
    }
  }

  if (isLoggedIn && role === 'admin') {
    return <AdminDashboard userName={name} onLogout={() => { setIsLoggedIn(false); setRole(null); setName(''); }} />
  }

  if (isLoggedIn && role === 'student') {
    return <StudentDashboard userName={name} onLogout={() => { setIsLoggedIn(false); setRole(null); setName(''); }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              A
            </div>
            <h1 className="text-2xl font-bold text-primary">AttendanceHub</h1>
          </div>
          <CardDescription>Smart attendance with face recognition</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Select Your Role</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-xs text-muted-foreground">Create & manage classes</div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={() => setRole('student')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-medium">Student</div>
                    <div className="text-xs text-muted-foreground">Join & track attendance</div>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={!name.trim() || !role}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
