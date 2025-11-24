import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getChapter, getChapters } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface ReadPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ReadPage({ params }: ReadPageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const chapter = await getChapter(decodedSlug);

    if (!chapter || !chapter.published) {
        notFound();
    }

    const allChapters = await getChapters();
    const publishedChapters = allChapters.filter(c => c.published);
    const currentIndex = publishedChapters.findIndex(c => c.id === chapter.id);

    const prevChapter = currentIndex > 0 ? publishedChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < publishedChapters.length - 1 ? publishedChapters[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-background font-serif">
            <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
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

            <article className="container mx-auto max-w-2xl py-16 px-4">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{chapter.title}</h1>
                    <div className="text-muted-foreground font-sans text-sm">
                        {new Date(chapter.createdAt).toLocaleDateString()}
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
            </article>
        </div>
    );
}
