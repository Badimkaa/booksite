import { NextResponse } from 'next/server';
import { getOrder, saveOrder } from '@/lib/orders';
import { createProdamusSignature, parseProdamusBody } from '@/lib/prodamus';

const PRODAMUS_SECRET_KEY = process.env.PRODAMUS_SECRET_KEY;

// TODO: Configure this URL in Prodamus dashboard: https://<YOUR_DOMAIN>/api/payment/webhook
export async function POST(request: Request) {
    if (!PRODAMUS_SECRET_KEY) {
        console.error('PRODAMUS_SECRET_KEY not set');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const body = await request.text(); // Get raw body
        const signature = request.headers.get('Sign');

        console.log('Payment Webhook Received:', {
            url: request.url,
            method: request.method,
            signatureHeader: signature,
            bodyLength: body.length,
            bodyPreview: body.substring(0, 500) // Log first 500 chars
        });

        if (!signature) {
            console.error('Missing signature in webhook request');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Parse body to nested object
        const data = parseProdamusBody(body);

        // Log parsed data for debugging (be careful with PII in prod, but helpful now)
        console.log('Parsed Webhook Data:', JSON.stringify(data, null, 2));

        // Verify signature
        // We must recreate the signature from the parsed data using the same logic as sending
        const calculatedSignature = createProdamusSignature(data, PRODAMUS_SECRET_KEY);

        if (calculatedSignature !== signature) {
            console.error('Invalid signature', {
                calculated: calculatedSignature,
                received: signature,
                secretKeyLength: PRODAMUS_SECRET_KEY.length
            });
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        const { order_id, payment_status, sum, customer_email, customer_phone } = data;

        // Check if payment is successful
        if (payment_status === 'success') {
            const order = await getOrder(order_id);
            if (order) {
                // Verify amount
                if (Math.abs(parseFloat(sum) - order.amount) < 1.0) {
                    order.status = 'paid';
                    order.updatedAt = new Date();
                    if (customer_email) order.customerEmail = customer_email;
                    if (customer_phone) order.customerPhone = customer_phone;

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
