import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    const studentIds = db.classEnrollments
      .filter(e => e.classId === classId)
      .map(e => e.studentId);

    const students = db.users.filter(u => studentIds.includes(u.id) && u.role === 'student');

    return Response.json({ students });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return Response.json(
        { error: 'Missing studentId' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existing = db.classEnrollments.find(
      e => e.classId === classId && e.studentId === studentId
    );

    if (existing) {
      return Response.json(
        { error: 'Student already enrolled' },
        { status: 400 }
      );
    }

    db.classEnrollments.push({ classId, studentId });

    return Response.json(
      { message: 'Student enrolled successfully' },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: 'Failed to enroll student' }, { status: 500 });
  }
}
