'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import AttendancePageModal from './attendance-page-modal'
import AttendanceStatsModal from './attendance-stats-modal'

interface JoinedClass {
  id: number
  classId: number
  name: string
  description: string
  durationMinutes: number
  status: string
  attendance: boolean
}

interface ClassItem {
  id: number
  name: string
  description: string
  adminId: number
  startTime: string
  durationMinutes: number
  status: string
}

export default function StudentDashboard({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [joinedClasses, setJoinedClasses] = useState<JoinedClass[]>([])
  const [availableClasses, setAvailableClasses] = useState<ClassItem[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [studentStats, setStudentStats] = useState({ totalClasses: 0, presentCount: 0, attendancePercentage: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const classesRes = await fetch('/api/classes')
      const classesData = await classesRes.json()
      
      // Get student attendance stats
      const statsRes = await fetch('/api/attendance/student/2') // Mock student ID
      const statsData = await statsRes.json()

      setAvailableClasses(classesData.classes || [])
      setStudentStats(statsData.stats || {})
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = (classItem: ClassItem) => {
    setSelectedClass(classItem)
    setIsAttendanceModalOpen(true)
  }

  const handleMarkAttendance = async () => {
    if (selectedClass) {
      const newJoinedClass: JoinedClass = {
        id: Math.random(),
        classId: selectedClass.id,
        name: selectedClass.name,
        description: selectedClass.description,
        durationMinutes: selectedClass.durationMinutes,
        status: selectedClass.status,
        attendance: true,
      }
      setJoinedClasses([...joinedClasses, newJoinedClass])
      
      // Refetch stats
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Classes</h1>
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
                  <p className="text-muted-foreground text-sm">Classes Joined</p>
                  <p className="text-3xl font-bold text-primary">{studentStats.totalClasses}</p>
                </div>
                <BookOpen className="w-10 h-10 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Present</p>
                  <p className="text-3xl font-bold text-accent">
                    {studentStats.presentCount}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-accent/30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsStatsModalOpen(true)}>
                <div>
                  <p className="text-muted-foreground text-sm">Attendance %</p>
                  <p className="text-3xl font-bold text-secondary">{studentStats.attendancePercentage}%</p>
                </div>
                <Clock className="w-10 h-10 text-secondary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Classes</CardTitle>
                <CardDescription>New classes you can join</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-center text-muted-foreground">Loading classes...</p>
                ) : availableClasses.length > 0 ? (
                  availableClasses.map((classItem) => (
                    <div key={classItem.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="mb-3">
                        <h3 className="font-semibold">{classItem.name}</h3>
                        <p className="text-xs text-muted-foreground">{classItem.description}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Duration: {classItem.durationMinutes} minutes
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleJoinClass(classItem)}
                        className="w-full"
                      >
                        Join Class
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No available classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>My Joined Classes</CardTitle>
                <CardDescription>Your current and past classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {joinedClasses.length > 0 ? (
                  joinedClasses.map((classItem) => (
                    <div key={classItem.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{classItem.name}</h3>
                          <p className="text-xs text-muted-foreground">{classItem.description}</p>
                        </div>
                        {classItem.attendance && (
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Duration: {classItem.durationMinutes} minutes
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">No classes joined yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {isAttendanceModalOpen && selectedClass && (
        <AttendancePageModal
          classItem={selectedClass}
          onClose={() => setIsAttendanceModalOpen(false)}
          onMarkAttendance={handleMarkAttendance}
          userName={userName}
          studentId={2}
        />
      )}

      {isStatsModalOpen && (
        <AttendanceStatsModal
          classes={joinedClasses}
          onClose={() => setIsStatsModalOpen(false)}
          userName={userName}
          attendancePercentage={studentStats.attendancePercentage}
        />
      )}
    </div>
  )
}
