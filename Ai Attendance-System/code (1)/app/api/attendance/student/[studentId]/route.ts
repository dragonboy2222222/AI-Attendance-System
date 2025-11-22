import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = parseInt(params.studentId);
    const records = db.attendanceRecords.filter(a => a.studentId === studentId);

    // Calculate statistics
    const totalClasses = db.classEnrollments.filter(
      e => e.studentId === studentId
    ).length;

    const presentCount = records.filter(r => r.status === 'present').length;
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentCount / totalClasses) * 100) 
      : 0;

    // Enrich with class names
    const enrichedRecords = records.map(record => {
      const classData = db.classes.find(c => c.id === record.classId);
      return {
        ...record,
        className: classData?.name || 'Unknown',
        durationMinutes: classData?.durationMinutes || 0,
      };
    });

    return Response.json({
      attendance: enrichedRecords,
      stats: {
        totalClasses,
        presentCount,
        attendancePercentage,
      },
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch student attendance' }, { status: 500 });
  }
}
