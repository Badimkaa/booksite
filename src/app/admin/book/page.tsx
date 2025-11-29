import { getChapters } from '@/lib/db';
import ChapterList from '@/components/admin/ChapterList';

export const dynamic = 'force-dynamic';

export default async function BookAdminPage() {
    const chapters = await getChapters();

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            {/* Header moved to ChapterList */}

            <ChapterList initialChapters={chapters} />
        </div>
    );
}
