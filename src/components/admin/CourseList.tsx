'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Course } from '@/types';
import { useRouter } from 'next/navigation';

interface CourseListProps {
    initialCourses: Course[];
}

export default function CourseList({ initialCourses }: CourseListProps) {
    const [courses, setCourses] = useState(initialCourses);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const moveCourse = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= courses.length) return;

        const newCourses = [...courses];
        const [movedCourse] = newCourses.splice(index, 1);
        newCourses.splice(newIndex, 0, movedCourse);

        setCourses(newCourses);
        setHasChanges(true);
    };

    const saveOrder = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/courses/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds: courses.map((c) => c.id) }),
            });

            if (!res.ok) throw new Error('Failed to save order');

            setHasChanges(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to reorder:', error);
            alert('Не удалось сохранить порядок курсов');
        } finally {
            setIsSaving(false);
        }
    };

    const cancelChanges = () => {
        setCourses(initialCourses);
        setHasChanges(false);
    };

    if (courses.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Пока нет ни одного курса. Создайте первый!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hasChanges && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed">
                    <span className="text-sm font-medium">Порядок курсов изменен. Не забудьте сохранить!</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={cancelChanges} disabled={isSaving}>
                            Отмена
                        </Button>
                        <Button size="sm" onClick={saveOrder} disabled={isSaving}>
                            {isSaving ? 'Сохранение...' : 'Сохранить порядок'}
                        </Button>
                    </div>
                </div>
            )}

            {courses.map((course, index) => (
                <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                >
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                            <span>
                                {course.isActive ? (
                                    <span className="text-green-600 font-medium">Активен</span>
                                ) : (
                                    <span className="text-yellow-600 font-medium">Скрыт</span>
                                )}
                            </span>
                            <span>•</span>
                            <span>{course.price ? `${course.price} ₽` : 'Бесплатно'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveCourse(index, 'up')}
                                disabled={index === 0 || isSaving}
                                title="Поднять выше"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveCourse(index, 'down')}
                                disabled={index === courses.length - 1 || isSaving}
                                title="Опустить ниже"
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/courses/${course.slug}`} target="_blank">
                                <Button variant="ghost" size="sm">Просмотр</Button>
                            </Link>
                            <Link href={`/admin/courses/${course.id}`}>
                                <Button variant="outline" size="icon" title="Редактировать">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
