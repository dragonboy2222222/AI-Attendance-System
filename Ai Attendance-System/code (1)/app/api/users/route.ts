import { db } from '@/lib/db';

export async function GET() {
  try {
    return Response.json({ users: db.users });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newUser = {
      id: Math.max(...db.users.map(u => u.id), 0) + 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
