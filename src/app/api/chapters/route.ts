import { NextResponse } from 'next/server';
import { getChapters, saveChapter, deleteChapter } from '@/lib/db';
import { Chapter } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { slugify } from 'transliteration';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

export async function GET() {
    const chapters = await getChapters();
    return NextResponse.json(chapters);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { id, title, content, published, excerpt } = body;

    // Get current user
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let username = 'Unknown';

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        username = payload.username as string;
    } catch (e) {
        console.error('Token verification failed', e);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Transliterate title to English slug
    const slug = slugify(title);

    const chapter: Chapter = {
        id: id || uuidv4(),
        title,
        slug,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
        published: published || false,
        videoUrl: body.videoUrl || null,
        telegramLink: body.telegramLink || null,
        views: 0,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        updatedAt: new Date(),
        lastModifiedBy: username,
    };

    await saveChapter(chapter);
    return NextResponse.json(chapter);
}

export async function DELETE(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await jwtVerify(token, JWT_SECRET);
    } catch (e) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        await deleteChapter(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
