'use server';

import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { getCourseById } from '@/lib/db';
import { saveOrder, Order } from '@/lib/orders';

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

    // 1. Sort keys recursively
    const sortedData = sortObjectKeys(data);

    // 2. Convert to JSON (no spaces, ensure ASCII is false)
    // IMPORTANT: PHP json_encode escapes slashes by default (e.g. "/" -> "\/").
    // JS JSON.stringify does not. We must emulate PHP behavior for the signature to match.
    const jsonString = JSON.stringify(sortedData).replace(/\//g, '\\/');

    // 3. Sign
    const hmac = createHmac('sha256', PRODAMUS_SECRET_KEY);
    hmac.update(jsonString);
    const signature = hmac.digest('hex');

    // 4. Flatten for URL
    const flatParams = flattenObject(data);
    flatParams.signature = signature;

    const queryString = new URLSearchParams(flatParams).toString();
    redirect(`${PRODAMUS_URL}?${queryString}`);
}

function sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObjectKeys(obj[key]);
                return acc;
            }, {} as any);
    }
    return obj;
}

function flattenObject(obj: any, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? `${prefix}[${k}]` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre));
        } else if (Array.isArray(obj[k])) {
            obj[k].forEach((v: any, i: number) => {
                Object.assign(acc, flattenObject(v, `${pre}[${i}]`));
            });
        } else {
            acc[pre] = obj[k];
        }
        return acc;
    }, {});
}
