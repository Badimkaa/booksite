import { NextResponse } from 'next/server';
import { getComments, saveComment } from '@/lib/db';
import { Comment } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
        return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 });
    }

    const comments = await getComments(chapterId);
    return NextResponse.json(comments);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chapterId, content, username } = body;

        if (!chapterId || !content || !username) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Optional: Check authentication if needed
        // const cookieStore = await cookies();
        // const isAuthenticated = cookieStore.get('auth_token')?.value === 'authenticated';
        // if (!isAuthenticated) { ... }

        const newComment: Comment = {
            id: uuidv4(),
            chapterId,
            userId: null,
            username,
            content,
            createdAt: new Date(),
        };

        await saveComment(newComment);

        return NextResponse.json(newComment);
    } catch (error) {
        console.error('Error saving comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 });
        }

        // Check authentication
        const isAuth = await isAuthenticated();

        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await import('@/lib/db').then(mod => mod.deleteComment(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
