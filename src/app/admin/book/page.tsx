import Link from 'next/link';
import { getChapters } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import ChapterList from '@/components/admin/ChapterList';

export const dynamic = 'force-dynamic';

export default async function BookAdminPage() {
    const chapters = await getChapters();

    return (
        <div className="container mx-auto max-w-4xl py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление книгой</h1>
                <div className="flex gap-2">
                    <Link href="/admin/settings">
                        <Button variant="outline">Настройки</Button>
                    </Link>
                    <Link href="/admin/write">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Новая глава
                        </Button>
                    </Link>
                </div>
            </div>

            <ChapterList initialChapters={chapters} />
        </div>
    );
}
