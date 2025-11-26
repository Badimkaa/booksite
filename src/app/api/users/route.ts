
import { NextResponse } from 'next/server';
import { getUsers, saveUser, deleteUser, getUser } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

async function isSuperAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === 'SUPER_ADMIN';
    } catch {
        return false;
    }
}

export async function GET() {
    if (!(await isSuperAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await getUsers();
    // Don't return password hashes
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    return NextResponse.json(safeUsers);
}

export async function POST(request: Request) {
    if (!(await isSuperAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { username, password, role } = await request.json();

        if (!username || !password || !role) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await getUser(username);
        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            username,
            passwordHash,
            role,
            createdAt: new Date(),
        };

        await saveUser(newUser);

        const { passwordHash: _, ...safeUser } = newUser;
        return NextResponse.json(safeUser);
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await isSuperAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ success: true });
}
