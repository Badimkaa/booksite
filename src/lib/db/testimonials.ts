
import { prisma } from '@/lib/prisma';
import type { Testimonial } from '@/types';

export async function getTestimonials(): Promise<Testimonial[]> {
    return prisma.testimonial.findMany({
        orderBy: { date: 'desc' }
    });
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
    await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {
            name: testimonial.name,
            text: testimonial.text,
            date: testimonial.date,
            program: testimonial.program,
            avatar: testimonial.avatar,
        },
        create: {
            id: testimonial.id,
            name: testimonial.name,
            text: testimonial.text,
            date: testimonial.date,
            program: testimonial.program,
            avatar: testimonial.avatar,
        }
    });
}

export async function deleteTestimonial(id: string): Promise<void> {
    await prisma.testimonial.delete({ where: { id } });
}
