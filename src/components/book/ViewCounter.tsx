'use client';

import { useEffect, useRef } from 'react';
import { registerView } from '@/app/actions/view-chapter';

export default function ViewCounter({ chapterId }: { chapterId: string }) {
    const hasRegistered = useRef(false);

    useEffect(() => {
        if (!hasRegistered.current) {
            registerView(chapterId);
            hasRegistered.current = true;
        }
    }, [chapterId]);

    return null;
}
