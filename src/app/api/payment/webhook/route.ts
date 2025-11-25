import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getOrder, saveOrder } from '@/lib/orders';

const PRODAMUS_SECRET_KEY = process.env.PRODAMUS_SECRET_KEY;

export async function POST(request: Request) {
    if (!PRODAMUS_SECRET_KEY) {
        console.error('PRODAMUS_SECRET_KEY not set');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.text(); // Get raw body for signature verification
        const signature = request.headers.get('Sign');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify signature
        // Prodamus signature: HMAC-SHA256 of the request body using the secret key
        const hmac = createHmac('sha256', PRODAMUS_SECRET_KEY);
        hmac.update(body);
        const calculatedSignature = hmac.digest('hex');

        if (calculatedSignature !== signature) {
            console.error('Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // Parse body
        // Prodamus sends data as URL-encoded form data or JSON?
        // Usually POST with form data. Let's parse the text body as URLSearchParams if it looks like it, or JSON.
        // The documentation says "POST request".
        // Let's assume URL-encoded first (standard for webhooks).
        let data: any = {};
        try {
            // Try JSON first
            data = JSON.parse(body);
        } catch {
            // Fallback to URLSearchParams
            const params = new URLSearchParams(body);
            params.forEach((value, key) => {
                data[key] = value;
            });
        }

        const { order_id, order_status, products_len, payment_status, sum } = data;

        // Check if payment is successful
        // payment_status: 'success'
        if (payment_status === 'success') {
            const order = await getOrder(order_id);
            if (order) {
                // Verify amount (optional but recommended)
                // Note: 'sum' from Prodamus might be string "4990.00"
                if (Math.abs(parseFloat(sum) - order.amount) < 1.0) {
                    order.status = 'paid';
                    order.updatedAt = new Date().toISOString();
                    // Save customer info if available
                    if (data.customer_email) order.customerEmail = data.customer_email;
                    if (data.customer_phone) order.customerPhone = data.customer_phone;

                    await saveOrder(order);
                    console.log(`Order ${order_id} marked as paid`);
                } else {
                    console.warn(`Order ${order_id} paid amount mismatch: expected ${order.amount}, got ${sum}`);
                }
            } else {
                console.warn(`Order ${order_id} not found`);
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
