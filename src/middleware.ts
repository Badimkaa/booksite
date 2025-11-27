
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET || 'default-secret-change-me';

if (process.env.NODE_ENV === 'production' && secret === 'default-secret-change-me') {
    throw new Error('JWT_SECRET must be set in production environment');
}

const JWT_SECRET = new TextEncoder().encode(secret);

export async function middleware(request: NextRequest) {
    // Check if the request is for the admin area
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            // Check for Super Admin access for users page
            if (request.nextUrl.pathname.startsWith('/admin/users')) {
                if (payload.role !== 'SUPER_ADMIN') {
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            }

            return NextResponse.next();
        } catch (error) {
            // Token is invalid or expired
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/upload',
        '/api/users/:path*'
    ],
};
