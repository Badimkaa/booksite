import Link from 'next/link';
import { getChapters, getSettings } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import ChapterList from '@/components/admin/ChapterList';

export const dynamic = 'force-dynamic';

export default async function BookAdminPage() {
    const chapters = await getChapters();
    const settings = await getSettings();

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            {/* Header moved to ChapterList */}

            <ChapterList initialChapters={chapters} />
        </div>
    );
}
