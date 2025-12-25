import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';

export async function GET() {
    const settings = await getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title, description, bookTitle, heroImage } = body;
    console.log('Settings API received:', { title, description, bookTitle, heroImage });

    if (title === undefined) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await saveSettings({
        title,
        description: description || '',
        bookTitle: bookTitle !== undefined ? bookTitle : 'Моя Книга',
        heroImage: heroImage
    });
    return NextResponse.json({ success: true });
}
