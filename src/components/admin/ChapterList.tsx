'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Chapter } from '@/types';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils'; // Added import

interface ChapterListProps {
    initialChapters: Chapter[];
}

export default function ChapterList({ initialChapters }: ChapterListProps) {
    const [chapters, setChapters] = useState(initialChapters);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const moveChapter = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= chapters.length) return;

        const newChapters = [...chapters];
        const [movedChapter] = newChapters.splice(index, 1);
        newChapters.splice(newIndex, 0, movedChapter);

        setChapters(newChapters);
        setHasChanges(true);
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

    if (chapters.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Пока нет ни одной главы. Начните писать!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hasChanges && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed">
                    <span className="text-sm font-medium">Порядок глав изменен. Не забудьте сохранить!</span>
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

            {chapters.map((chapter, index) => (
                <div
                    key={chapter.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                >
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
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveChapter(index, 'up')}
                                disabled={index === 0 || isSaving}
                                title="Поднять выше"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveChapter(index, 'down')}
                                disabled={index === chapters.length - 1 || isSaving}
                                title="Опустить ниже"
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
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
                </div>
            ))}
        </div>
    );
}
