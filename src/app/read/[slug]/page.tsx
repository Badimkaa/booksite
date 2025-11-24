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

                <div className="prose prose-lg dark:prose-invert mx-auto whitespace-pre-wrap leading-loose text-lg text-foreground/90">
                    {chapter.content}
                </div>

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
