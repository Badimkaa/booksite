
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';

export default function ContinueReading({ firstChapterSlug }: { firstChapterSlug?: string }) {
    const [lastRead, setLastRead] = useState<{ slug: string; title: string } | null>(null);

    useEffect(() => {
        const slug = localStorage.getItem('lastReadSlug');
        const title = localStorage.getItem('lastReadTitle');
        if (slug && title) {
            setTimeout(() => setLastRead({ slug, title }), 0);
        }
    }, []);

    if (!lastRead && !firstChapterSlug) {
        return null;
    }

    if (lastRead) {
        return (
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link href={`/read/${lastRead.slug}`} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Продолжить: {lastRead.title}
                    </Button>
                </Link>

                {firstChapterSlug && (
                    <Link href={`/read/${firstChapterSlug}`} className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full text-lg px-8 py-6">
                            Начать сначала
                        </Button>
                    </Link>
                )}
            </div>
        );
    }

    if (!firstChapterSlug) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href={`/read/${firstChapterSlug}`}>
                <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Начать читать
                </Button>
            </Link>
        </div>
    );
}
