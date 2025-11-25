import Link from 'next/link';
import { getChapters, getSettings, getCourses, getSchedule } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [chapters, settings, courses, schedule] = await Promise.all([
    getChapters(),
    getSettings(),
    getCourses(),
    getSchedule()
  ]);
  const publishedChapters = chapters.filter((c) => c.published);
  const upcomingEvents = schedule.filter(e => new Date(e.date) > new Date()).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/30 overflow-hidden">
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
              {settings.title || "Наталья [Фамилия]"}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Телесный терапевт, женский наставник
            </p>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
              Помогаю женщинам обрести гармонию души и тела, восстановить здоровье и найти путь к себе.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href="/mentorship">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Начать путь к себе
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Выбрать курс
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-md aspect-[3/4] md:aspect-square bg-muted rounded-2xl overflow-hidden shadow-2xl rotate-3">
            {/* Placeholder for photo */}
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-muted-foreground">
              <span className="text-lg">Фото Натальи</span>
            </div>
          </div>
        </div>
      </section>

      {/* Book Teaser */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Моя Книга</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              "{settings.description}" — это не просто история, это терапевтическое путешествие.
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

      {/* Courses Teaser */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Популярные курсы</h2>
              <p className="text-muted-foreground">Программы для вашего здоровья и красоты</p>
            </div>
            <Link href="/courses" className="hidden md:flex items-center text-primary hover:underline">
              Все курсы <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                <div className="aspect-video bg-muted relative">
                  {course.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.image}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                      Image
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2 font-serif">{course.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-semibold">{course.price} ₽</span>
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm">Подробнее</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/courses">
              <Button variant="ghost">Смотреть все курсы</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mentorship Teaser */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Наставничество "Путь к себе"</h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            3-х месячное глубокое погружение в работу с телом и сознанием.
            Персональное сопровождение и поддержка группы единомышленниц.
          </p>
          <Link href="/mentorship">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Узнать подробности и записаться
            </Button>
          </Link>
        </div>
      </section>

      {/* Schedule Teaser */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Ближайшие встречи</h2>

          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border rounded-xl gap-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-primary font-medium mb-1">
                        {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      <p className="text-muted-foreground text-sm">{event.type === 'online' ? 'Онлайн' : event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:self-center self-start mt-2 md:mt-0 w-full md:w-auto">
                    {event.price && <span className="font-semibold ml-auto md:ml-0">{event.price} ₽</span>}
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                      <Button className="w-full md:w-auto">Записаться</Button>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Расписание формируется. Следите за обновлениями!
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link href="/schedule">
              <Button variant="outline">Полное расписание</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
