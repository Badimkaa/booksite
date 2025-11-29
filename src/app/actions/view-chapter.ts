'use server';

import { cookies } from 'next/headers';
import { incrementChapterViews } from '@/lib/db';

export async function registerView(chapterId: string) {
    const cookieStore = await cookies();
    const viewedChaptersCookie = cookieStore.get('viewed_chapters');

    let viewedChapters: string[] = [];

    if (viewedChaptersCookie) {
        try {
            viewedChapters = JSON.parse(viewedChaptersCookie.value);
        } catch {
            // Invalid cookie, ignore
        }
    }

    if (!viewedChapters.includes(chapterId)) {
        await incrementChapterViews(chapterId);
        viewedChapters.push(chapterId);

        // Update cookie
        cookieStore.set('viewed_chapters', JSON.stringify(viewedChapters), {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
    }
}
