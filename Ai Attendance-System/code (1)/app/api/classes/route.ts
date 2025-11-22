import { db } from '@/lib/db';

export async function GET() {
  try {
    return Response.json({ classes: db.classes });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, name, description, durationMinutes, locationLat, locationLng } = body;

    if (!adminId || !name || !durationMinutes) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newClass = {
      id: Math.max(...db.classes.map(c => c.id), 0) + 1,
      adminId,
      name,
      description: description || '',
      startTime: new Date().toISOString(),
      durationMinutes,
      locationLat: locationLat || 0,
      locationLng: locationLng || 0,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    db.classes.push(newClass);

    return Response.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return Response.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
