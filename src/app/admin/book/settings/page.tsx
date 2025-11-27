'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function BookSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [bookTitle, setBookTitle] = useState('');
    const [description, setDescription] = useState('');
    // We need to keep track of site title to not overwrite it with empty string
    const [siteTitle, setSiteTitle] = useState('');

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setSiteTitle(data.title);
                setBookTitle(data.bookTitle || '');
                setDescription(data.description);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: siteTitle, // Preserve site title
                    description,
                    bookTitle
                }),
            });

            if (res.ok) {
                router.refresh();
                alert('Настройки книги сохранены');
            }
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <div className="mb-8">
                <Link href="/admin/book">
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к книге
                    </Button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold font-serif mb-8">Настройки книги</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Название книги</label>
                    <Input
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="Моя Книга"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Отображается в шапке админки и на странице книги</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Описание книги</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
                        placeholder="Краткое описание..."
                        required
                    />
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                </Button>
            </form>
        </div>
    );
}
