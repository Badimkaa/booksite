
'use client';

import { useEffect } from 'react';

interface ProgressSaverProps {
    slug: string;
    title: string;
}

export default function ProgressSaver({ slug, title }: ProgressSaverProps) {
    useEffect(() => {
        localStorage.setItem('lastReadSlug', slug);
        localStorage.setItem('lastReadTitle', title);
        localStorage.setItem('lastReadDate', new Date().toISOString());
    }, [slug, title]);

    return null;
}
