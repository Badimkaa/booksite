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
    console.log('Initiating payment for course:', courseId);

    try {
        if (!PRODAMUS_URL || !PRODAMUS_SECRET_KEY) {
            console.error('Missing Prodamus configuration:', {
                hasUrl: !!PRODAMUS_URL,
                hasSecret: !!PRODAMUS_SECRET_KEY
            });
            throw new Error('Prodamus configuration missing');
        }

        const course = await getCourseById(courseId);
        if (!course || !course.price || !course.isActive) {
            console.error('Course not found or invalid:', { courseId, hasCourse: !!course, price: course?.price, isActive: course?.isActive });
            throw new Error('Course is not available for purchase');
        }

        const orderId = uuidv4();
        const amount = course.price;

        console.log('Creating order:', orderId);

        // Create pending order
        const order: Order = {
            id: orderId,
            courseId: course.id,
            amount,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            customerEmail: null,
            customerPhone: null,
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
        const paymentUrl = `${PRODAMUS_URL}?${queryString}`;

        console.log('Redirecting to payment provider...');
        redirect(paymentUrl);
    } catch (error) {
        // Re-throw redirect errors (they are internal Next.js mechanism)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Payment initiation failed:', error);
        throw error;
    }
}
