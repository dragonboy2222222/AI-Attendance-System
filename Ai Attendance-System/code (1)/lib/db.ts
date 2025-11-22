// Mock database - Replace with actual PostgreSQL client when integrating
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
  faceEncoding?: string;
  createdAt: string;
}

interface Class {
  id: number;
  adminId: number;
  name: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  locationLat: number;
  locationLng: number;
  status: 'pending' | 'ongoing' | 'completed';
  createdAt: string;
}

interface Attendance {
  id: number;
  classId: number;
  studentId: number;
  checkInTime: string;
  checkOutTime?: string;
  faceVerified: boolean;
  locationLat: number;
  locationLng: number;
  durationMinutes: number;
  status: 'present' | 'absent' | 'late';
}

// Mock data storage
let users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'John Student',
    email: 'john@example.com',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
];

let classes: Class[] = [
  {
    id: 1,
    adminId: 1,
    name: 'Mathematics 101',
    description: 'Introduction to Calculus',
    startTime: new Date().toISOString(),
    durationMinutes: 60,
    locationLat: 40.7128,
    locationLng: -74.006,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

let classEnrollments: { classId: number; studentId: number }[] = [];
let attendanceRecords: Attendance[] = [];

export const db = {
  users,
  classes,
  classEnrollments,
  attendanceRecords,
};
