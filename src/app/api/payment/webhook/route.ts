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
        if (typeof data !== 'object' || data === null) {
            console.error('Parsed data is not an object:', data);
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }
        // We must recreate the signature from the parsed data using the same logic as sending
        const calculatedSignature = createProdamusSignature(data as Record<string, unknown>, PRODAMUS_SECRET_KEY);

        if (calculatedSignature !== signature) {
            console.error('Invalid signature', {
                calculated: calculatedSignature,
                received: signature,
                secretKeyLength: PRODAMUS_SECRET_KEY.length
            });
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        const { order_id, order_num, payment_status, sum, customer_email, customer_phone } = data as { [key: string]: string };

        // Prodamus returns our custom UUID in 'order_num', and their internal ID in 'order_id'.
        // We need to look up by our UUID.
        const targetOrderId = order_num || order_id;

        // Check if payment is successful
        if (payment_status === 'success') {
            const order = await getOrder(targetOrderId);
            if (order) {
                // Verify amount
                if (Math.abs(parseFloat(sum) - order.amount) < 1.0) {
                    order.status = 'paid';
                    order.updatedAt = new Date();
                    if (customer_email) order.customerEmail = customer_email;
                    if (customer_phone) order.customerPhone = customer_phone;

                    await saveOrder(order);
                    console.log(`Order ${targetOrderId} marked as paid`);
                } else {
                    console.warn(`Order ${targetOrderId} paid amount mismatch: expected ${order.amount}, got ${sum}`);
                }
            } else {
                console.warn(`Order ${targetOrderId} not found (looked for order_num: ${order_num}, order_id: ${order_id})`);
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
