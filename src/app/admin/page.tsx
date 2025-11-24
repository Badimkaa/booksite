import Link from 'next/link';
import { getChapters, getCourses, getSchedule } from '@/lib/db';
import { BookOpen, GraduationCap, Calendar, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [chapters, courses, schedule] = await Promise.all([
        getChapters(),
        getCourses(),
        getSchedule()
    ]);

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
        }
    ];

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            <h1 className="text-3xl font-bold font-serif mb-8">Дашборд</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href} className="block group">
                        <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-all hover:border-primary/50">
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
                    <h2 className="text-xl font-bold mb-4">Последние изменения в книге</h2>
                    <div className="space-y-4">
                        {chapters.slice(-3).reverse().map(chapter => (
                            <div key={chapter.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <span className="font-medium truncate max-w-[200px]">{chapter.title}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(chapter.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
