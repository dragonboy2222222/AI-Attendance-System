
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, MapPin, Clock, Users } from 'lucide-react'

interface ClassDetailsModalProps {
  classItem: {
    id: string
    name: string
    subject: string
    startTime: string
    endTime: string
    date: string
    students: number
    presentCount: number
  }
  onClose: () => void
}

export default function ClassDetailsModal({ classItem, onClose }: ClassDetailsModalProps) {
  const attendancePercentage = Math.round((classItem.presentCount / classItem.students) * 100)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{classItem.name}</CardTitle>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subject</p>
              <p className="font-semibold">{classItem.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="font-semibold">{classItem.date}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Class Duration</p>
                <p className="font-semibold text-sm">{classItem.startTime} - {classItem.endTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className="font-semibold text-sm">{classItem.presentCount} / {classItem.students} ({attendancePercentage}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-4 h-4 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-sm">Room A-201</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="w-full bg-border rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">Attendance Rate: {attendancePercentage}%</p>
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
