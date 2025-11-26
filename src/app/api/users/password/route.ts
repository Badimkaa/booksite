import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getUsers, saveUser } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, currentPassword, newPassword } = await request.json();

        if (!newPassword) {
            return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }

        // Scenario 1: Super Admin changing another user's password
        if (userId && userId !== currentUser.sub) {
            if (currentUser.role !== 'SUPER_ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            const users = await getUsers();
            const targetUser = users.find(u => u.id === userId);

            if (!targetUser) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10);
            targetUser.passwordHash = passwordHash;
            await saveUser(targetUser);

            return NextResponse.json({ success: true });
        }

        // Scenario 2: User changing their own password
        const users = await getUsers();
        const user = users.find(u => u.id === currentUser.sub);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!currentPassword) {
            return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = passwordHash;
        await saveUser(user);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
