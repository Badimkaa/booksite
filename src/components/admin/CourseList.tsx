'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Edit, GripVertical } from 'lucide-react';
import { Course } from '@/types';
import { useRouter } from 'next/navigation';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CourseListProps {
    initialCourses: Course[];
}

function SortableCourseCard({ course }: { course: Course }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        willChange: 'transform',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border relative group"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing bg-background/80 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Перетащите для изменения порядка"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Course Image */}
            <div className="aspect-video bg-muted relative">
                {course.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={course.image}
                        alt={course.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                        Изображение
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${course.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {course.isActive ? 'Активен' : 'Скрыт'}
                    </span>
                </div>
            </div>

            {/* Course Content */}
            <div className="p-8 flex flex-col">
                <h3 className="text-2xl font-bold mb-3 font-serif">{course.title}</h3>
                <p className="text-muted-foreground text-base line-clamp-3 mb-6 flex-1">
                    {course.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t">
                    <span className="font-semibold">
                        {course.price ? `${course.price} ₽` : 'Бесплатно'}
                    </span>
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
        </div>
    );
}

export default function CourseList({ initialCourses }: CourseListProps) {
    const [courses, setCourses] = useState(initialCourses);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setCourses((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                setHasChanges(true);
                return newItems;
            });
        }
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
            <div className="text-center py-10 text-muted-foreground bg-card border rounded-lg">
                Пока нет ни одного курса. Создайте первый!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Save Banner */}
            {hasChanges && (
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            💡 Порядок курсов изменен. Не забудьте сохранить!
                        </span>
                    </div>
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

            {/* Drag and Drop Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={courses.map(c => c.id)} strategy={rectSortingStrategy}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <SortableCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>


        </div>
    );
}
