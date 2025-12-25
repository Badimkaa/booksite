import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { appendToSheet } from '@/lib/google-sheets';

// Schema for validation
const applicationSchema = z.object({
    stateOneWord: z.string().min(1, "Это поле обязательно"),
    bodyMessage: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    mainFeeling: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    butterflyStage: z.string().nullable().refine(val => val !== null && val.length > 0, { message: "Выберите вариант" }),
    relations: z.string().nullable().optional(),
    familySupport: z.string().nullable().optional(),
    supportNeeded: z.array(z.string()).optional(),
    preferredFormat: z.array(z.string()).optional(),
    contactLevel: z.array(z.string()).optional(),
    personalMessage: z.string().optional(),
    telegram: z.string().min(1, "Это поле обязательно"),
});

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
                butterflyStage: data.butterflyStage || "",
                relations: data.relations || "Не указано",
                familySupport: data.familySupport || null,
                supportNeeded: JSON.stringify(data.supportNeeded || []),
                preferredFormat: JSON.stringify(data.preferredFormat || []),
                contactLevel: JSON.stringify(data.contactLevel || []),
                personalMessage: data.personalMessage || null,
                telegram: data.telegram || null,
            },
        });

        const safeData = {
            stateOneWord: data.stateOneWord,
            bodyMessage: data.bodyMessage,
            mainFeeling: data.mainFeeling,
            butterflyStage: data.butterflyStage || "",
            relations: data.relations || "Не указано",
            familySupport: data.familySupport || null,
            supportNeeded: data.supportNeeded || [],
            preferredFormat: data.preferredFormat || [],
            contactLevel: data.contactLevel || [],
            personalMessage: data.personalMessage || null,
            telegram: data.telegram || null,
        };

        // Send to Google Sheets
        await appendToSheet(safeData);

        return NextResponse.json({ success: true, id: application.id });
    } catch (error) {
        console.error('Error submitting mentorship application:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
