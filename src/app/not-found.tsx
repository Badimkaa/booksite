import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4 font-serif">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Страница не найдена</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                К сожалению, страница, которую вы ищете, не существует или была перемещена.
            </p>
            <Link href="/">
                <Button size="lg">
                    Вернуться на главную
                </Button>
            </Link>
        </div>
    );
}
