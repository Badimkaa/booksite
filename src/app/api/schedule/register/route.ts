import { NextResponse } from 'next/server';
import { saveRegistration } from '@/lib/db';
import { Registration } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventId, eventTitle, name, contact, message } = body;

        if (!eventId || !name || !contact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRegistration: Registration = {
            id: uuidv4(),
            eventId,
            eventTitle,
            name,
            contact,
            message,
            createdAt: new Date().toISOString(),
        };

        await saveRegistration(newRegistration);

        return NextResponse.json({ success: true, registration: newRegistration });
    } catch (error) {
        console.error('Error saving registration:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
