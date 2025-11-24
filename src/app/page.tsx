import Link from 'next/link';
import { getChapters, getSettings } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [chapters, settings] = await Promise.all([
    getChapters(),
    getSettings()
  ]);
  const publishedChapters = chapters.filter((c) => c.published);

  return (
    <div className="min-h-screen bg-background text-foreground font-serif">
      <header className="py-20 px-4 text-center border-b bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {settings.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
            {settings.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href={publishedChapters.length > 0 ? `/read/${publishedChapters[0].slug}` : '#'}>
              <Button size="lg" className="text-lg px-8 py-6" disabled={publishedChapters.length === 0}>
                <BookOpen className="mr-2 h-5 w-5" />
                Начать читать
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl py-16 px-4">
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
                      <p className="mt-2 text-muted-foreground line-clamp-2 font-sans text-base">
                        {chapter.excerpt}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground font-sans ml-4 whitespace-nowrap">
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t mt-20 font-sans">
        <p>© {new Date().getFullYear()} Автор Книги. Все права защищены.</p>
        <Link href="/login" className="hover:underline mt-2 inline-block">
          Вход для автора
        </Link>
      </footer>
    </div>
  );
}
