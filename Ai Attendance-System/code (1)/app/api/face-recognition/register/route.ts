import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, imageData } = body;

    if (!studentId || !imageData) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Call Python face recognition service to encode the face
    // For now, we'll store a mock encoding
    const mockEncoding = imageData.substring(0, 100); // Mock encoding

    const student = db.users.find(u => u.id === studentId);
    if (!student) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    student.faceEncoding = mockEncoding;

    return Response.json({
      message: 'Face registered successfully',
      studentId,
    });
  } catch (error) {
    console.error('Error registering face:', error);
    return Response.json({ error: 'Failed to register face' }, { status: 500 });
  }
}
