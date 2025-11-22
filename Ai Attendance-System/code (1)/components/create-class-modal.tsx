'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface CreateClassModalProps {
  onClose: () => void
  onCreate: (classData: any) => void
}

export default function CreateClassModal({ onClose, onCreate }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: '60',
    locationLat: '40.7128',
    locationLng: '-74.006',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      onCreate({
        name: formData.name,
        description: formData.description,
        durationMinutes: parseInt(formData.durationMinutes),
        locationLat: parseFloat(formData.locationLat),
        locationLng: parseFloat(formData.locationLng),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create New Class</CardTitle>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Physics 101"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Introduction to Physics"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                value={formData.durationMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationLat">Latitude</Label>
                <Input
                  id="locationLat"
                  name="locationLat"
                  placeholder="40.7128"
                  value={formData.locationLat}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationLng">Longitude</Label>
                <Input
                  id="locationLng"
                  name="locationLng"
                  placeholder="-74.006"
                  value={formData.locationLng}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
