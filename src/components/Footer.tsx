'use client';

import Link from 'next/link';
import { SOCIAL_LINKS } from '@/config/social';
import { Send, ArrowUp } from 'lucide-react';
import { Button } from './ui/Button';

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t bg-muted/30 pt-16 pb-8 font-sans">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-4 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight mb-4 block hover:text-primary transition-colors w-fit">
                            Наталья
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm mb-6">
                            Телесный терапевт, женский наставник. Помогаю обрести гармонию души и тела, найти свой путь и раскрыть внутренний потенциал.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={SOCIAL_LINKS.TELEGRAM}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-background p-2 rounded-full border hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-1 shadow-sm"
                                aria-label="Telegram"
                            >
                                <Send className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Навигация</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/book" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">Книга</Link>
                            <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">Курсы</Link>
                            <Link href="/mentorship" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">Наставничество</Link>
                            <Link href="/schedule" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">Расписание</Link>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Контакты</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">Связаться со мной</Link>
                            <a href={SOCIAL_LINKS.TELEGRAM} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200">
                                Telegram канал
                            </a>
                            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors w-fit hover:translate-x-1 duration-200 text-xs mt-4">
                                Вход для администратора
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Наталья. Все права защищены.</p>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollToTop}
                        className="group hover:bg-transparent hover:text-primary"
                    >
                        Наверх
                        <ArrowUp className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
