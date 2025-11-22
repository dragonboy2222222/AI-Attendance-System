'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, MapPin, Smartphone, Camera } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AttendancePageModalProps {
  classItem: {
    id: number
    name: string
    description: string
    durationMinutes: number
  }
  onClose: () => void
  onMarkAttendance: () => void
  userName: string
  studentId: number
}

export default function AttendancePageModal({
  classItem,
  onClose,
  onMarkAttendance,
  userName,
  studentId,
}: AttendancePageModalProps) {
  const [faceDetected, setFaceDetected] = useState(false)
  const [geolocationEnabled, setGeolocationEnabled] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [canMarkAttendance, setCanMarkAttendance] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setGeolocationEnabled(true)
        },
        () => setGeolocationEnabled(false)
      )
    }
  }, [])

  const handleActivateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        
        // Simulate face detection after 2 seconds
        setTimeout(() => {
          setFaceDetected(true)
          setCanMarkAttendance(true)
        }, 2000)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const handleMarkAttendance = async () => {
    if (!canMarkAttendance) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: classItem.id,
          studentId: studentId || 2,
          locationLat: latitude || 0,
          locationLng: longitude || 0,
          faceVerified: faceDetected,
        }),
      })

      if (response.ok) {
        onMarkAttendance()
        onClose()
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Join Class & Mark Attendance</CardTitle>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold mb-2">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground">{classItem.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Duration: {classItem.durationMinutes} minutes
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/30 text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-2">Face Recognition</p>
              {cameraActive ? (
                <div className="space-y-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-32 h-32 mx-auto rounded-lg border-2 border-primary object-cover"
                  />
                  {faceDetected && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Face Detected
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={handleActivateCamera} variant="outline" size="sm">
                  Activate Camera
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Geolocation</p>
                  {geolocationEnabled ? (
                    <p className="text-xs text-muted-foreground break-all">
                      Verified: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                    </p>
                  ) : (
                    <p className="text-xs text-destructive">Not available</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Smartphone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Student Info</p>
                  <p className="text-xs text-muted-foreground">{userName}</p>
                </div>
              </div>
            </div>

            {!canMarkAttendance && (
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Please activate your camera and ensure your face is detected to mark attendance.
                </AlertDescription>
              </Alert>
            )}

            {canMarkAttendance && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  You're ready to mark attendance!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleMarkAttendance}
              disabled={!canMarkAttendance || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Marking...' : 'Mark Attendance'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
