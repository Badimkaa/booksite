import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, GraduationCap, Calendar, Settings, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/10">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span>Админка</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            Дашборд
                        </Button>
                    </Link>
                    <Link href="/admin/book">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <BookOpen className="h-4 w-4" />
                            Книга
                        </Button>
                    </Link>
                    <Link href="/admin/courses">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <GraduationCap className="h-4 w-4" />
                            Курсы
                        </Button>
                    </Link>
                    <Link href="/admin/schedule">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Calendar className="h-4 w-4" />
                            Расписание
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="h-4 w-4" />
                            Настройки
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start gap-3">
                            <LogOut className="h-4 w-4" />
                            На сайт
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
