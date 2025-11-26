import { prisma } from '@/lib/prisma';
import { Order } from '@prisma/client';

export type { Order };

export async function getOrders(): Promise<Order[]> {
    return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { course: true }
    });
}

export async function saveOrder(order: Partial<Order> & { id: string; courseId: string; amount: number; status: string }): Promise<void> {
    await prisma.order.upsert({
        where: { id: order.id },
        update: {
            status: order.status,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
        },
        create: {
            id: order.id,
            courseId: order.courseId,
            amount: order.amount,
            status: order.status,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
        }
    });
}

export async function getOrder(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
        where: { id },
        include: { course: true }
    });
}
