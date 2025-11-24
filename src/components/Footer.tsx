import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-muted/30 py-12 px-4 font-sans text-sm">
            <div className="container mx-auto grid gap-8 md:grid-cols-3 items-start">
                <div>
                    <h3 className="font-serif text-lg font-bold mb-4">Наталья</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xs">
                        Телесный терапевт, женский наставник. Помогаю обрести гармонию души и тела.
                    </p>
                </div>

                <div className="grid gap-2">
                    <h4 className="font-semibold mb-2">Навигация</h4>
                    <Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">Книга</Link>
                    <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Курсы</Link>
                    <Link href="/mentorship" className="text-muted-foreground hover:text-primary transition-colors">Наставничество</Link>
                    <Link href="/schedule" className="text-muted-foreground hover:text-primary transition-colors">Расписание</Link>
                </div>

                <div className="grid gap-2">
                    <h4 className="font-semibold mb-2">Контакты</h4>
                    <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors">Связаться со мной</Link>
                    <a href="https://t.me/username" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        Telegram канал
                    </a>
                    <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors mt-4 inline-block text-xs">
                        Вход для администратора
                    </Link>
                </div>
            </div>

            <div className="container mx-auto mt-12 pt-8 border-t text-center text-muted-foreground text-xs">
                <p>© {new Date().getFullYear()} Все права защищены.</p>
            </div>
        </footer>
    );
}
