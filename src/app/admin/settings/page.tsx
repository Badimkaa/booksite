'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
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
                body: JSON.stringify({ title, description }),
            });

            if (res.ok) {
                router.refresh();
                alert('Настройки сохранены');
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
                <Link href="/admin">
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад в панель управления
                    </Button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold font-serif mb-8">Настройки сайта</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Название книги (сайта)</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Моя Книга"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Описание</label>
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
                    Сохранить настройки
                </Button>
            </form>
        </div>
    );
}
