import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByUsername } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const user = await getUserByUsername(username);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await new SignJWT({
            sub: user.id,
            username: user.username,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return NextResponse.json({ success: true });
}
