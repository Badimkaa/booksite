import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, GraduationCap, Calendar, Settings, LayoutDashboard, Users, Home } from 'lucide-react';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { LogoutButton } from '@/components/admin/LogoutButton';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

async function getUserRole() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role;
    } catch {
        return null;
    }
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getUserRole();

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

                    {role === 'SUPER_ADMIN' && (
                        <Link href="/admin/users">
                            <Button variant="ghost" className="w-full justify-start gap-3">
                                <Users className="h-4 w-4" />
                                Пользователи
                            </Button>
                        </Link>
                    )}

                    <Link href="/admin/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="h-4 w-4" />
                            Настройки
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t space-y-2">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Home className="h-4 w-4" />
                            На сайт
                        </Button>
                    </Link>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
