import Link from 'next/link';
import { Button } from './ui/Button';
import { Menu } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight hover:text-primary transition-colors">
                    Наталья
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="/book" className="hover:text-primary transition-colors">
                        Книга
                    </Link>
                    <Link href="/courses" className="hover:text-primary transition-colors">
                        Курсы
                    </Link>
                    <Link href="/mentorship" className="hover:text-primary transition-colors">
                        Наставничество
                    </Link>
                    <Link href="/schedule" className="hover:text-primary transition-colors">
                        Расписание
                    </Link>
                    <Link href="/feedback" className="hover:text-primary transition-colors">
                        Контакты
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/mentorship">
                        <Button variant="default" size="sm" className="hidden md:inline-flex">
                            Путь к себе
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Меню</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
