import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, studentId, locationLat, locationLng, faceVerified, image } = body;

    if (!classId || !studentId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already marked for this class
    const existing = db.attendanceRecords.find(
      a => a.classId === classId && a.studentId === studentId
    );

    if (existing) {
      return Response.json(
        { error: 'Attendance already marked for this class' },
        { status: 400 }
      );
    }

    const classData = db.classes.find(c => c.id === classId);
    if (!classData) {
      return Response.json({ error: 'Class not found' }, { status: 404 });
    }

    // Calculate duration and status
    const checkInTime = new Date();
    const classStartTime = new Date(classData.startTime);
    const durationMinutes = Math.floor(
      (checkInTime.getTime() - classStartTime.getTime()) / (1000 * 60)
    );
    
    let status = 'present';
    if (durationMinutes > classData.durationMinutes + 15) {
      status = 'absent';
    } else if (durationMinutes > 15) {
      status = 'late';
    }

    const attendance = {
      id: Math.max(...db.attendanceRecords.map(a => a.id), 0) + 1,
      classId,
      studentId,
      checkInTime: checkInTime.toISOString(),
      faceVerified: faceVerified || false,
      locationLat: locationLat || 0,
      locationLng: locationLng || 0,
      durationMinutes,
      status,
    };

    db.attendanceRecords.push(attendance);

    return Response.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return Response.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
