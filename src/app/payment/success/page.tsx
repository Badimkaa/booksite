import { getOrder } from '@/lib/orders';
import { getCourse } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface SuccessPageProps {
    searchParams: Promise<{
        order_id: string;
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const { order_id, ...otherParams } = await searchParams;

    if (!order_id) {
        return <div>Invalid order</div>;
    }

    let order = await getOrder(order_id);

    if (!order) {
        return <div>Order not found</div>;
    }

    // Try to validate payment via redirect params if not already paid
    if (order.status !== 'paid' && otherParams._payform_sign) {
        const PRODAMUS_SECRET_KEY = process.env.PRODAMUS_SECRET_KEY;
        if (PRODAMUS_SECRET_KEY) {
            const signature = otherParams._payform_sign as string;
            const paramsToSign: any = { order_id, ...otherParams };
            delete paramsToSign._payform_sign;

            // Prodamus might send stringified numbers, ensure we match the type if needed.
            // But usually query params are strings.

            // We need to try signing with ALL params, and if that fails, maybe just _payform params?
            // Let's try ALL params first as that's standard for signed redirects.

            // Import dynamically to avoid circular deps if any, or just use what we have.
            // We need createProdamusSignature from '@/lib/prodamus'
            // And saveOrder from '@/lib/orders'

            const { createProdamusSignature } = await import('@/lib/prodamus');
            const { saveOrder } = await import('@/lib/orders');

            const calculatedSignature = createProdamusSignature(paramsToSign, PRODAMUS_SECRET_KEY);

            if (calculatedSignature === signature) {
                if (otherParams._payform_status === 'success') {
                    order.status = 'paid';
                    order.updatedAt = new Date();
                    await saveOrder(order);
                    console.log(`Order ${order_id} marked as paid via redirect signature`);
                }
            } else {
                console.warn('Redirect signature mismatch', { calculated: calculatedSignature, received: signature });
            }
        }
    }

    // Re-fetch order if we might have updated it (or just use the modified object)
    // Actually we modified the `order` object in memory above, so we can just use it.

    const course = await getCourse(order.courseId);

    return (
        <div className="container mx-auto max-w-md py-20 px-4 text-center">
            {order.status === 'paid' ? (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif">Оплата прошла успешно!</h1>
                    <p className="text-muted-foreground">
                        Спасибо за покупку курса "{course?.title}".
                    </p>

                    <div className="bg-muted/30 p-6 rounded-lg border text-left">
                        <h3 className="font-medium mb-2">Ваш доступ:</h3>
                        <div className="whitespace-pre-wrap text-sm">
                            {course?.accessContent || 'Ссылка на материалы была отправлена вам на почту.'}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/courses">
                            <Button variant="outline">Вернуться к курсам</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif">Обработка платежа...</h1>
                    <p className="text-muted-foreground">
                        Мы проверяем статус вашей оплаты. Это может занять до 1-2 минут.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Пожалуйста, обновите страницу через минуту.
                    </p>

                    <div className="pt-4">
                        <Link href={`/payment/success?order_id=${order_id}`}>
                            <Button variant="outline">Обновить статус</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
