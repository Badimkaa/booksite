'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { useNavigationBlocker } from '@/hooks/use-navigation-blocker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const chapterSchema = z.object({
    title: z.string().min(1, 'Название обязательно'),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean(),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

interface ChapterEditorProps {
    chapter?: Chapter;
}

export function ChapterEditor({ chapter }: ChapterEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { isDirty },
        watch
    } = useForm<ChapterFormValues>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            title: chapter?.title || '',
            excerpt: chapter?.excerpt || '',
            content: chapter?.content || '',
            published: chapter?.published || false,
        },
    });

    const published = watch('published');

    // Use custom navigation blocker
    useNavigationBlocker(isDirty);

    // Warn on exit (browser refresh/close)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const onSubmit = async (data: ChapterFormValues) => {
        setIsLoading(true);

        try {
            const res = await fetch('/api/chapters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: chapter?.id,
                    ...data,
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold font-serif">
                        {chapter ? 'Редактирование главы' : 'Новая глава'}
                    </h1>
                    {isDirty && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-200 animate-pulse">
                            Не сохранено
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Название</label>
                    <Input
                        {...register('title')}
                        placeholder="Глава 1: Начало"
                        className="text-lg font-serif"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Краткое описание (для оглавления)</label>
                    <div className="min-h-[150px]">
                        <Controller
                            name="excerpt"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="О чем эта глава..."
                                    className="prose-p:my-1 min-h-[150px]"
                                />
                            )}
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
                            {...register('published')}
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
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value || ''}
                                onChange={field.onChange}
                                placeholder="Пишите вашу книгу здесь..."
                            />
                        )}
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
