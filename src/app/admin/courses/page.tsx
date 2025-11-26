import Link from 'next/link';
import { getCourses } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import CourseList from '@/components/admin/CourseList';

export const dynamic = 'force-dynamic';

export default async function CoursesAdminPage() {
    const courses = await getCourses();

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление курсами</h1>
                <Link href="/admin/courses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить курс
                    </Button>
                </Link>
            </div>

            <CourseList initialCourses={courses} />
        </div>
    );
}
