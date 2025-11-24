import { notFound } from 'next/navigation';
import { getChapterById } from '@/lib/db';
import { ChapterEditor } from '@/components/ChapterEditor';

interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPage({ params }: EditPageProps) {
    const { id } = await params;
    const chapter = await getChapterById(id);

    if (!chapter) {
        notFound();
    }

    return <ChapterEditor chapter={chapter} />;
}
