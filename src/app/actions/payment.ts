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
    const params: Record<string, string> = {
        order_id: orderId,
        products_for_receipt: `${course.title}, ${amount} rub, 1 pc`,
        do: 'pay',
        urlReturn: `${NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
        urlSuccess: `${NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
        sys: 'natasha_site',
    };

    // Generate signature
    // Signature logic: HmacSHA256 of sorted params values joined by nothing?
    // Wait, Prodamus signature for LINK generation is often just passing params to the form.
    // The documentation says "Signature is formed based on the data of the incoming POST request". That's for Webhook.
    // For the LINK, we usually just send GET parameters.
    // Some integrations require signing the link, others don't.
    // Let's check the standard "Simple integration" (GET request).
    // Usually it's just `url?order_id=...&products=...`.
    // But to be safe and prevent tampering, we should sign it if Prodamus supports it on the GET endpoint.
    // However, Prodamus often works without signature for simple links, but then the user could change the price in the URL.
    // CRITICAL: We must ensure the price is correct.
    // Prodamus "Payment Form" usually takes `sum` or `products` in the URL.
    // Let's construct the URL with `products` array (encoded).

    // Actually, for the "Payment Form" integration, we construct a URL like:
    // https://demo.payform.ru/?do=link&order_id=123&...

    // Let's try to sign it to be safe.
    // The standard signature for Prodamus *requests* (not webhooks) is often:
    // hmac_sha256(params_sorted_by_key_and_joined, secret)
    // But I need to be sure.
    // Since I can't browse documentation deeply right now, I will use the standard params WITHOUT signature first, 
    // BUT I will verify the amount in the Webhook. The Webhook is the source of truth.
    // If the user changes the price in the URL, they pay less, but the Webhook will say "paid 1 ruble".
    // My Webhook logic must check if `amount_paid == course.price`.

    const queryString = new URLSearchParams(params).toString();
    redirect(`${PRODAMUS_URL}?${queryString}`);
}
