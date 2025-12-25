'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    // Hidden fields to preserve data
    const [bookTitle, setBookTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
                setBookTitle(data.bookTitle || '');
                setDescription(data.description);
                setHeroImage(data.heroImage || '');
                setPreviewUrl(data.heroImage || '');
            });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let currentHeroImage = heroImage;

            // 1. Upload new image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    currentHeroImage = uploadData.url;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            // 2. Save settings
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, bookTitle, heroImage: currentHeroImage }),
            });

            if (res.ok) {
                router.refresh();
                alert('Настройки сайта сохранены');
                setHeroImage(currentHeroImage);
                setImageFile(null);
            }
        } catch (error) {
            console.error('Failed to save', error);
            alert('Ошибка при сохранении настроек');
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

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Общие сведения</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Название сайта (в браузере)</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Сайт Натальи"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Отображается во вкладке браузера и в поисковиках</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Главный экран</h2>
                    <div>
                        <label className="block text-sm font-medium mb-3">Фото главного экрана</label>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {(previewUrl || heroImage) && (
                                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-muted bg-muted shadow-inner">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewUrl || heroImage}
                                        alt="Current Hero"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground italic">
                                    Рекомендуется использовать портретное фото в высоком разрешении. Максимальный размер 5МБ.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-8 text-lg font-medium shadow-lg shadow-primary/20">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Сохранить все настройки
                    </Button>
                </div>
            </form>
        </div>
    );
}
