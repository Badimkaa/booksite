'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Edit, Eye, GripVertical, Plus } from 'lucide-react';
import { Chapter } from '@/types';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChapterListProps {
    initialChapters: Chapter[];
    bookTitle?: string;
}

function SortableChapterItem({ chapter }: { chapter: Chapter }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow group"
        >
            <div className="flex items-center gap-3">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
                    title="Перетащите для изменения порядка"
                >
                    <GripVertical className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="font-semibold text-lg">{chapter.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                        <span>
                            {chapter.published ? (
                                <span className="text-green-600 font-medium">Опубликовано</span>
                            ) : (
                                <span className="text-yellow-600 font-medium">Черновик</span>
                            )}
                        </span>
                        <span>•</span>
                        <span>{formatDate(chapter.updatedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <Link href={`/read/${chapter.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="Просмотреть">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={`/admin/edit/${chapter.id}`}>
                    <Button variant="outline" size="icon" title="Редактировать">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function ChapterList({ initialChapters }: ChapterListProps) {
    const [chapters, setChapters] = useState(initialChapters);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setChapters((items) => {
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
            const res = await fetch('/api/chapters/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds: chapters.map((c) => c.id) }),
            });

            if (!res.ok) throw new Error('Failed to save order');

            setHasChanges(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to reorder:', error);
            alert('Не удалось сохранить порядок глав');
        } finally {
            setIsSaving(false);
        }
    };

    const cancelChanges = () => {
        setChapters(initialChapters);
        setHasChanges(false);
    };

    const dndContextId = useId();
    if (chapters.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Пока нет ни одной главы. Начните писать!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-serif">Управление книгой</h1>
                <div className="flex gap-2">
                    {hasChanges ? (
                        <>
                            <Button variant="outline" onClick={cancelChanges} disabled={isSaving}>
                                Отмена
                            </Button>
                            <Button onClick={saveOrder} disabled={isSaving}>
                                {isSaving ? 'Сохранение...' : 'Сохранить порядок'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/admin/book/settings">
                                <Button variant="outline">Настройки</Button>
                            </Link>
                            <Link href="/admin/write">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Новая глава
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <DndContext
                id={dndContextId}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {chapters.map((chapter) => (
                            <SortableChapterItem key={chapter.id} chapter={chapter} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
