import Link from 'next/link';
import { getChapters, getSettings } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { BookOpen, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ContinueReading from '@/components/book/ContinueReading';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
    const [chapters, settings] = await Promise.all([
        getChapters(),
        getSettings()
    ]);
    const publishedChapters = chapters.filter((c) => c.published);

    return (
        <div className="min-h-screen bg-background text-foreground font-serif py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        {settings.bookTitle || settings.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                        {settings.description}
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <ContinueReading firstChapterSlug={publishedChapters.length > 0 ? publishedChapters[0].slug : undefined} />
                    </div>
                </header>

                <main>
                    <h2 className="text-3xl font-bold mb-10 text-center">Оглавление</h2>

                    <div className="space-y-8">
                        {publishedChapters.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10">
                                Автор еще не опубликовал ни одной главы. Заходите позже!
                            </div>
                        ) : (
                            publishedChapters.map((chapter, index) => (
                                <Link
                                    key={chapter.id}
                                    href={`/read/${chapter.slug}`}
                                    className="block group"
                                >
                                    <div className="flex items-baseline justify-between border-b pb-4 group-hover:border-primary transition-colors">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                                                <span className="text-muted-foreground mr-4 text-lg font-normal">
                                                    {index + 1}.
                                                </span>
                                                {chapter.title}
                                            </h3>
                                            {chapter.excerpt && (
                                                <div
                                                    className="mt-2 text-muted-foreground font-sans text-base prose prose-sm dark:prose-invert max-w-none prose-p:my-1"
                                                    dangerouslySetInnerHTML={{ __html: chapter.excerpt }}
                                                />
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground ml-4 whitespace-nowrap">
                                            {formatDate(chapter.createdAt)}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
