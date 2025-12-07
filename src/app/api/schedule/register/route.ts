import { NextResponse } from 'next/server';
import { saveRegistration } from '@/lib/db';
import { Registration } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventId, eventTitle, name, email, contact, message } = body;

        if (!eventId || !name || !email || !contact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRegistration: Registration = {
            id: uuidv4(),
            eventId,
            eventTitle,
            name,
            email,
            contact,
            message,
            status: 'new',
            notes: null,
            createdAt: new Date(),
        };

        await saveRegistration(newRegistration);

        // Send Telegram notification
        const telegramMessage = `
🎉 <b>Новая запись на мероприятие</b>

📌 <b>Мероприятие:</b> ${eventTitle}
👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Контакт:</b> ${contact}
${message ? `💬 <b>Сообщение:</b> ${message}` : ''}
        `.trim();

        await sendTelegramMessage(telegramMessage);

        return NextResponse.json({ success: true, registration: newRegistration });
    } catch (error) {
        console.error('Error saving registration:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
