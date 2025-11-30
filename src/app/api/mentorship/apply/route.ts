import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { google } from 'googleapis';
import path from 'path';

// Schema for validation
const applicationSchema = z.object({
    stateOneWord: z.string().min(1, "Это поле обязательно"),
    bodyMessage: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    mainFeeling: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    butterflyStage: z.string().min(1, "Выберите вариант"),
    relations: z.string().min(1, "Выберите вариант"),
    familySupport: z.string().optional(),
    supportNeeded: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    preferredFormat: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    contactLevel: z.array(z.string()).min(1, "Выберите вариант"),
    personalMessage: z.string().optional(),
    telegram: z.string().optional(),
});

const SPREADSHEET_ID = '1ZNlkMRc8e5dezGpsYAceXdfMbW9YlqXE6G6FMv2jF0A';
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

async function appendToSheet(data: any) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare row data
        const row = [
            new Date().toLocaleString('ru-RU'), // Timestamp
            data.stateOneWord,
            data.bodyMessage.join(', '),
            data.mainFeeling.join(', '),
            data.butterflyStage,
            data.relations,
            data.familySupport || '-',
            data.supportNeeded.join(', '),
            data.preferredFormat.join(', '),
            data.contactLevel.join(', '),
            data.personalMessage || '-',
            data.telegram || '-'
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1', // Appends to the first sheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });
    } catch (error) {
        console.error('Google Sheets Error:', error);
        // We don't throw here to ensure DB save is not rolled back if Sheets fails
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const result = applicationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;

        // Save to Database
        const application = await prisma.mentorshipApplication.create({
            data: {
                name: data.stateOneWord, // Using first answer as "name/title" for now
                stateOneWord: data.stateOneWord,
                bodyMessage: JSON.stringify(data.bodyMessage),
                mainFeeling: JSON.stringify(data.mainFeeling),
                butterflyStage: data.butterflyStage,
                relations: data.relations,
                familySupport: data.familySupport || null,
                supportNeeded: JSON.stringify(data.supportNeeded),
                preferredFormat: JSON.stringify(data.preferredFormat),
                contactLevel: JSON.stringify(data.contactLevel),
                personalMessage: data.personalMessage || null,
                telegram: data.telegram || null,
            },
        });

        // Send to Google Sheets
        await appendToSheet(data);

        return NextResponse.json({ success: true, id: application.id });
    } catch (error) {
        console.error('Error submitting mentorship application:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
