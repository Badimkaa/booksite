import { NextResponse } from 'next/server';
import { getChapters, saveChapter, deleteChapter } from '@/lib/db';
import { Chapter } from '@/types';
import { v4 as uuidv4 } from 'uuid';

import { slugify } from 'transliteration';

export async function GET() {
    const chapters = await getChapters();
    return NextResponse.json(chapters);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { id, title, content, published, excerpt } = body;

    // Transliterate title to English slug
    const slug = slugify(title);

    const chapter: Chapter = {
        id: id || uuidv4(),
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        published: published || false,
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await saveChapter(chapter);
    return NextResponse.json(chapter);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        await deleteChapter(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
