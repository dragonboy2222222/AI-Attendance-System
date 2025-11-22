'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Plus, Users, Clock, Eye } from 'lucide-react'
import CreateClassModal from './create-class-modal'
import ClassDetailsModal from './class-details-modal'

interface Class {
  id: number
  name: string
  description: string
  adminId: number
  startTime: string
  durationMinutes: number
  status: string
  locationLat: number
  locationLng: number
  createdAt: string
}

export default function AdminDashboard({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [classes, setClasses] = useState<Class[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async (classData: any) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 1, // Mock admin ID
          name: classData.name,
          description: classData.description,
          durationMinutes: classData.durationMinutes,
          locationLat: classData.locationLat || 0,
          locationLng: classData.locationLng || 0,
        }),
      })
      const newClass = await response.json()
      setClasses([...classes, newClass])
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating class:', error)
    }
  }

  const handleViewDetails = (classItem: Class) => {
    setSelectedClass(classItem)
    setIsDetailsModalOpen(true)
  }

  const averageAttendance = classes.length > 0
    ? Math.round(
      classes.reduce((acc, c) => acc + (c.presentCount / c.students) * 100, 0) / classes.length
    )
    : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/80 text-sm">Welcome, {userName}</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Classes</p>
                  <p className="text-3xl font-bold text-primary">{classes.length}</p>
                </div>
                <Users className="w-10 h-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Duration</p>
                  <p className="text-3xl font-bold text-accent">
                    {classes.reduce((acc, c) => acc + c.durationMinutes, 0)}m
                  </p>
                </div>
                <Clock className="w-10 h-10 text-accent/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Classes</p>
                  <p className="text-3xl font-bold text-secondary">
                    {classes.filter(c => c.status === 'ongoing').length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-secondary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Class
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Classes</CardTitle>
            <CardDescription>Manage and monitor your classes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading classes...</p>
            ) : classes.length === 0 ? (
              <p className="text-center text-muted-foreground">No classes created yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-2 font-semibold">Class Name</th>
                      <th className="text-left py-3 px-2 font-semibold">Description</th>
                      <th className="text-left py-3 px-2 font-semibold">Duration (min)</th>
                      <th className="text-left py-3 px-2 font-semibold">Status</th>
                      <th className="text-left py-3 px-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classItem) => (
                      <tr key={classItem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 font-medium">{classItem.name}</td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">{classItem.description}</td>
                        <td className="py-3 px-2">{classItem.durationMinutes}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            classItem.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {classItem.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(classItem)}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {isCreateModalOpen && (
        <CreateClassModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateClass}
        />
      )}

      {isDetailsModalOpen && selectedClass && (
        <ClassDetailsModal
          classItem={selectedClass}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  )
}
