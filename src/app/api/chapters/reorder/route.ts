
import { NextResponse } from 'next/server';
import { reorderChapters } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderedIds } = body;

        if (!Array.isArray(orderedIds)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        await reorderChapters(orderedIds);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json(
            { error: 'Failed to reorder chapters' },
            { status: 500 }
        );
    }
}
