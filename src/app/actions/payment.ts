'use server';

import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { getCourseById } from '@/lib/db';
import { saveOrder, Order } from '@/lib/orders';
import { createProdamusSignature, flattenObject } from '@/lib/prodamus';

const PRODAMUS_URL = process.env.PRODAMUS_URL;
const PRODAMUS_SECRET_KEY = process.env.PRODAMUS_SECRET_KEY;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function initiatePayment(courseId: string) {
    if (!PRODAMUS_URL || !PRODAMUS_SECRET_KEY) {
        throw new Error('Prodamus configuration missing');
    }

    const course = await getCourseById(courseId);
    if (!course || !course.price) {
        throw new Error('Course not found or price not set');
    }

    const orderId = uuidv4();
    const amount = course.price;

    // Create pending order
    const order: Order = {
        id: orderId,
        courseId: course.id,
        amount,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await saveOrder(order);

    // Prepare Prodamus parameters
    const data = {
        order_id: orderId,
        do: 'pay',
        urlReturn: `${NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
        urlSuccess: `${NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
        sys: 'natasha_site',
        products: [
            {
                name: course.title,
                price: amount.toString(),
                quantity: '1',
            }
        ],
        paid_content: course.accessContent || `Спасибо за покупку курса "${course.title}"!`,
    };

    // 1. Create signature
    const signature = createProdamusSignature(data, PRODAMUS_SECRET_KEY);

    // 2. Flatten for URL
    const flatParams = flattenObject(data);
    flatParams.signature = signature;

    const queryString = new URLSearchParams(flatParams).toString();
    redirect(`${PRODAMUS_URL}?${queryString}`);
}
