import Link from 'next/link';
import { getCourses } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CoursesAdminPage() {
    const courses = await getCourses();

    return (
        <div className="container mx-auto max-w-4xl py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление курсами</h1>
                <Link href="/admin/courses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить курс
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {courses.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-card border rounded-lg">
                        Нет активных курсов. Создайте первый!
                    </div>
                ) : (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${course.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {course.isActive !== false ? 'Активен' : 'Скрыт'}
                                    </span>
                                    <span>•</span>
                                    {course.price} ₽ • {course.features.length} модулей
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/admin/courses/${course.id}`}>
                                    <Button variant="outline" size="icon" title="Редактировать">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
