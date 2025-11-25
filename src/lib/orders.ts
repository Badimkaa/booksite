import fs from 'fs/promises';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const ordersFilePath = path.join(dataDirectory, 'orders.json');

export interface Order {
    id: string;
    courseId: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    createdAt: string;
    updatedAt: string;
    customerEmail?: string;
    customerPhone?: string;
}

async function ensureOrdersFile() {
    try {
        await fs.access(ordersFilePath);
    } catch {
        await fs.writeFile(ordersFilePath, '[]');
    }
}

export async function getOrders(): Promise<Order[]> {
    await ensureOrdersFile();
    const fileContents = await fs.readFile(ordersFilePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function saveOrder(order: Order): Promise<void> {
    const orders = await getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
        orders[index] = order;
    } else {
        orders.push(order);
    }
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
}

export async function getOrder(id: string): Promise<Order | undefined> {
    const orders = await getOrders();
    return orders.find((o) => o.id === id);
}
