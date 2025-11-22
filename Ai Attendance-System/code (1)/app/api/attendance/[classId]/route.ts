import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const classId = parseInt(params.classId);
    const records = db.attendanceRecords.filter(a => a.classId === classId);

    // Enrich with student names
    const enrichedRecords = records.map(record => {
      const student = db.users.find(u => u.id === record.studentId);
      return {
        ...record,
        studentName: student?.name || 'Unknown',
      };
    });

    return Response.json({ attendance: enrichedRecords });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
