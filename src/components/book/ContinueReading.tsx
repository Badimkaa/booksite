
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';

export default function ContinueReading() {
    const [lastRead, setLastRead] = useState<{ slug: string; title: string } | null>(null);

    useEffect(() => {
        const slug = localStorage.getItem('lastReadSlug');
        const title = localStorage.getItem('lastReadTitle');
        if (slug && title) {
            setLastRead({ slug, title });
        }
    }, []);

    if (!lastRead) return null;

    return (
        <div className="flex justify-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href={`/read/${lastRead.slug}`}>
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Продолжить: {lastRead.title}
                </Button>
            </Link>
        </div>
    );
}
