#!/usr/bin/env tsx
import { prisma } from '../src/lib/prisma';

async function cleanupPendingOrders() {
    try {
        // Calculate 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Delete pending orders older than 24 hours
        const result = await prisma.order.deleteMany({
            where: {
                status: 'pending',
                createdAt: {
                    lt: twentyFourHoursAgo
                }
            }
        });

        console.log(`✅ Cleanup completed: ${result.count} pending orders deleted`);
        console.log(`   Cutoff time: ${twentyFourHoursAgo.toISOString()}`);
    } catch (error) {
        console.error('❌ Error cleaning up pending orders:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupPendingOrders();
