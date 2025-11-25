import { getOrder } from '@/lib/orders';
import { getCourse } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface SuccessPageProps {
    searchParams: Promise<{
        order_id: string;
    }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const { order_id } = await searchParams;

    if (!order_id) {
        return <div>Invalid order</div>;
    }

    const order = await getOrder(order_id);

    if (!order) {
        return <div>Order not found</div>;
    }

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
                        <form>
                            <Button type="submit" variant="outline">Обновить статус</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
