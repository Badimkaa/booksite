import Link from 'next/link';
import { getChapters, getCourses, getSchedule, getUsers } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen, Users, Calendar, Settings, LogOut, GraduationCap, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-me'
);

export const dynamic = 'force-dynamic';

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

export default async function AdminDashboard() {
    const role = await getUserRole();
    const [chapters, courses, schedule, users] = await Promise.all([
        getChapters(),
        getCourses(),
        getSchedule(),
        role === 'SUPER_ADMIN' ? getUsers() : Promise.resolve([])
    ]);

    const totalViews = chapters.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const stats = [
        {
            title: "Книга",
            value: chapters.length,
            label: "глав",
            icon: BookOpen,
            href: "/admin/book",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Прочтений",
            value: totalViews,
            label: "всего",
            icon: BookOpen, // Reusing icon, or could import Eye
            href: "/admin/book",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        },
        {
            title: "Курсы",
            value: courses.length,
            label: "активных",
            icon: GraduationCap,
            href: "/admin/courses",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Расписание",
            value: schedule.filter(e => new Date(e.date) > new Date()).length,
            label: "предстоящих",
            icon: Calendar,
            href: "/admin/schedule",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Заявки",
            value: (await import('@/lib/db').then(m => m.getRegistrations())).length,
            label: "новых",
            icon: Users, // Using Users icon for now, or could import Mail/Inbox
            href: "/admin/registrations",
            color: "text-pink-500",
            bg: "bg-pink-500/10"
        }
    ];

    if (role === 'SUPER_ADMIN') {
        stats.push({
            title: "Пользователи",
            value: users.length,
            label: "администраторов",
            icon: Users,
            href: "/admin/users",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        });
    }

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            <h1 className="text-3xl font-bold font-serif mb-8">Дашборд</h1>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href} className="block group">
                        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-all hover:border-primary/50 h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                            <div className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                {stat.title}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Последние изменения</h2>
                    <div className="space-y-4">
                        {chapters.slice(-3).reverse().map(chapter => (
                            <div key={chapter.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <div>
                                    <div className="font-medium truncate max-w-[200px]">{chapter.title}</div>
                                    {chapter.lastModifiedBy && (
                                        <div className="text-xs text-muted-foreground">
                                            by {chapter.lastModifiedBy}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {formatDate(chapter.updatedAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Популярные главы</h2>
                    <div className="space-y-4">
                        {[...chapters].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3).map(chapter => (
                            <div key={chapter.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <span className="font-medium truncate max-w-[200px]">{chapter.title}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <BookOpen className="h-3 w-3" />
                                    <span>{chapter.views || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
