/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkApplications() {
    try {
        const count = await prisma.mentorshipApplication.count();
        console.log(`\nTotal Applications: ${count}`);

        if (count > 0) {
            const latest = await prisma.mentorshipApplication.findFirst({
                orderBy: { createdAt: 'desc' }
            });
            console.log('\nLatest Application:');
            console.log(JSON.stringify(latest, null, 2));
        } else {
            console.log('No applications found yet.');
        }
    } catch (error) {
        console.error('Error checking applications:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkApplications();
