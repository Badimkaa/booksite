'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface ChapterEditorProps {
    chapter?: Chapter;
}

export function ChapterEditor({ chapter }: ChapterEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(chapter?.title || '');
    const [excerpt, setExcerpt] = useState(chapter?.excerpt || '');
    const [content, setContent] = useState(chapter?.content || '');
    const [published, setPublished] = useState(chapter?.published || false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/chapters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: chapter?.id,
                    title,
                    excerpt,
                    content,
                    published,
                    createdAt: chapter?.createdAt,
                }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!chapter?.id) return;

        if (!confirm('Вы уверены, что хотите удалить эту главу?')) {
            return;
        }

        setIsLoading(true);
        try {
            await fetch(`/api/chapters?id=${chapter.id}`, { method: 'DELETE' });
            router.push('/admin');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete', error);
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-6 max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold font-serif">
                {chapter ? 'Редактирование главы' : 'Новая глава'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Название</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Глава 1: Начало"
                        required
                        className="text-lg font-serif"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Краткое описание (для оглавления)</label>
                    <div className="min-h-[150px]">
                        <RichTextEditor
                            content={excerpt}
                            onChange={setExcerpt}
                            placeholder="О чем эта глава..."
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Если оставить пустым, описание будет создано автоматически из начала текста.
                    </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 mt-0.5"
                        />
                        <div className="flex-1">
                            <label htmlFor="published" className="text-sm font-medium block mb-1">
                                Опубликовать главу
                            </label>
                            <p className="text-xs text-muted-foreground">
                                {published
                                    ? "Глава будет видна всем читателям после сохранения"
                                    : "Глава сохранится как черновик. Вы сможете продолжить писать позже"}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Текст главы</label>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Пишите вашу книгу здесь..."
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    {chapter && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            Удалить
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Сохранить
                    </Button>
                </div>
            </form>
        </div>
    );
}
