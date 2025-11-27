import { prisma } from '../src/lib/prisma';

async function main() {
    const orderId = '20646003-7b3b-43a5-b0b4-97e0feb57d55';
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        console.log('Order not found');
    } else {
        console.log('Order found:', order);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
