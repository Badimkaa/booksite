
import { prisma } from '@/lib/prisma';
import type { ScheduleEvent } from '@/types';

export async function getSchedule(): Promise<ScheduleEvent[]> {
    return prisma.scheduleEvent.findMany({
        orderBy: { date: 'asc' }
    }) as Promise<ScheduleEvent[]>;
}

export async function getScheduleEventById(id: string): Promise<ScheduleEvent | null> {
    return prisma.scheduleEvent.findUnique({ where: { id } }) as Promise<ScheduleEvent | null>;
}

export async function saveScheduleEvent(event: ScheduleEvent): Promise<void> {
    await prisma.scheduleEvent.upsert({
        where: { id: event.id },
        update: {
            title: event.title,
            date: event.date,
            type: event.type,
            location: event.location,
            link: event.link,
            price: event.price,
        },
        create: {
            id: event.id,
            title: event.title,
            date: event.date,
            type: event.type,
            location: event.location,
            link: event.link,
            price: event.price,
        }
    });
}

export async function deleteScheduleEvent(id: string): Promise<void> {
    await prisma.scheduleEvent.delete({ where: { id } });
}
