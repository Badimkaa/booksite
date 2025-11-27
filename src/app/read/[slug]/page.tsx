import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getChapter, getChapters } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import ProgressSaver from '@/components/book/ProgressSaver';
import ViewCounter from '@/components/book/ViewCounter';
import CommentsSection from '@/components/book/CommentsSection';
import { generatePageMetadata, generateArticleSchema } from '@/lib/metadata';
import { StructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';

interface ReadPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const chapter = await getChapter(decodedSlug);

    if (!chapter) {
        return {};
    }

    // Extract first 160 characters from content as description
    const plainText = chapter.content.replace(/<[^>]*>/g, '').substring(0, 160);

    return generatePageMetadata({
        title: chapter.title,
        description: plainText,
        url: `/read/${chapter.slug}`,
        type: 'article',
    });
}


export default async function ReadPage({ params }: ReadPageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const chapter = await getChapter(decodedSlug);

    // if (chapter) {
    //     await incrementChapterViews(chapter.id);
    // }

    const isAuth = await isAuthenticated();

    if (!chapter || (!chapter.published && !isAuthenticated)) {
        notFound();
    }

    const allChapters = await getChapters();
    const publishedChapters = allChapters.filter(c => c.published);
    const currentIndex = publishedChapters.findIndex(c => c.id === chapter.id);

    const prevChapter = currentIndex > 0 ? publishedChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < publishedChapters.length - 1 ? publishedChapters[currentIndex + 1] : null;

    const structuredData = generateArticleSchema({
        headline: chapter.title,
        description: chapter.content.replace(/<[^>]*>/g, '').substring(0, 160),
        author: 'Наталья',
        datePublished: new Date(chapter.createdAt).toISOString(),
        dateModified: chapter.updatedAt ? new Date(chapter.updatedAt).toISOString() : new Date(chapter.createdAt).toISOString(),
    });

    return (
        <div className="min-h-screen bg-background font-serif">
            <StructuredData data={structuredData} />
            <nav className="sticky top-[57px] md:top-[53px] z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
                <div className="container mx-auto max-w-3xl flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <Home className="mr-2 h-4 w-4" />
                            Оглавление
                        </Button>
                    </Link>
                    <span className="text-sm font-sans text-muted-foreground hidden md:inline-block">
                        {chapter.title}
                    </span>
                    <div className="flex gap-2">
                        {prevChapter && (
                            <Link href={`/read/${prevChapter.slug}`}>
                                <Button variant="ghost" size="sm" title="Предыдущая глава">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {nextChapter && (
                            <Link href={`/read/${nextChapter.slug}`}>
                                <Button variant="ghost" size="sm" title="Следующая глава">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {!chapter.published && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <span className="text-sm font-medium">Это черновик. Глава видна только администраторам.</span>
                    <div className="flex gap-2">
                        <Link href="/admin/book">
                            <Button variant="outline" size="sm" className="h-8 border-yellow-300 hover:bg-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100">
                                Назад
                            </Button>
                        </Link>
                        <Link href={`/admin/edit/${chapter.id}`}>
                            <Button variant="outline" size="sm" className="h-8 border-yellow-300 hover:bg-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100">
                                Редактировать
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            <article className="container mx-auto max-w-2xl py-16 px-4">
                <ProgressSaver slug={decodedSlug} title={chapter.title} />
                <ViewCounter chapterId={chapter.id} />
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{chapter.title}</h1>
                    <div className="text-muted-foreground font-sans text-sm">
                        {formatDate(chapter.createdAt)}
                    </div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert mx-auto whitespace-pre-wrap leading-loose text-lg text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                />

                {chapter.videoUrl && (
                    <div className="mt-12 aspect-video rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            src={chapter.videoUrl}
                            title={`Видео к главе ${chapter.title}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                {chapter.telegramLink && (
                    <div className="mt-12 flex justify-center">
                        <a href={chapter.telegramLink} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="gap-2">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                                Обсудить в Telegram
                            </Button>
                        </a>
                    </div>
                )}

                <div className="mt-20 pt-8 border-t flex justify-between items-center font-sans">
                    {prevChapter ? (
                        <Link href={`/read/${prevChapter.slug}`} className="group text-left">
                            <div className="text-sm text-muted-foreground mb-1">Предыдущая</div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                                {prevChapter.title}
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextChapter ? (
                        <Link href={`/read/${nextChapter.slug}`} className="group text-right">
                            <div className="text-sm text-muted-foreground mb-1">Следующая</div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                                {nextChapter.title}
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                <CommentsSection chapterId={chapter.id} isAdmin={isAuth} />
            </article>
        </div>
    );
}
