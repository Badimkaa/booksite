
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';
import { SiteSettings, Chapter } from '@/types';

interface BookTeaserProps {
    settings: SiteSettings;
    publishedChapters: Chapter[];
}

export function BookTeaser({ settings, publishedChapters }: BookTeaserProps) {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 mx-auto">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">{settings.bookTitle || "Моя Книга"}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        &quot;{settings.description}&quot; — это не просто история, это терапевтическое путешествие.
                        Каждая глава открывает новые грани понимания себя.
                    </p>
                    <div className="pt-6">
                        <Link href={publishedChapters.length > 0 ? `/read/${publishedChapters[0].slug}` : '#'}>
                            <Button size="lg" variant="secondary" className="gap-2">
                                <BookOpen className="h-5 w-5" />
                                Читать книгу
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
