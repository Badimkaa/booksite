
import { prisma } from '@/lib/prisma';
import type { Registration } from '@/types';

export async function getRegistrations(): Promise<Registration[]> {
    return prisma.registration.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function saveRegistration(registration: Registration): Promise<void> {
    await prisma.registration.create({
        data: {
            id: registration.id,
            eventId: registration.eventId,
            eventTitle: registration.eventTitle,
            name: registration.name,
            email: registration.email,
            contact: registration.contact,
            message: registration.message,
            status: registration.status,
            notes: registration.notes,
        }
    });
}

export async function updateRegistration(id: string, data: { status?: string; notes?: string }): Promise<void> {
    await prisma.registration.update({
        where: { id },
        data
    });
}

export async function getActiveRegistrationsCount(): Promise<number> {
    return prisma.registration.count({
        where: {
            status: {
                in: ['new', 'processing']
            }
        }
    });
}
