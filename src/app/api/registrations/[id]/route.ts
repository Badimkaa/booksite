import { NextResponse } from 'next/server';
import { updateRegistration } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, notes } = body;

        await updateRegistration(id, { status, notes });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating registration:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
