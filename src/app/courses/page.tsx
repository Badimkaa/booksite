import Link from 'next/link';
import { getCourses } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { initiatePayment } from '@/app/actions/payment';
import { generatePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata({
        title: 'Курсы для женщин',
        description: 'Программы, созданные с любовью и заботой о вашем здоровье. Курсы по телесной терапии, женскому здоровью и саморазвитию.',
        url: '/courses',
    });
}

export default async function CoursesPage() {
    const allCourses = await getCourses();
    const courses = allCourses.filter(course => course.isActive !== false);

    return (
        <div className="min-h-screen bg-background font-serif py-16 md:py-24">
            <div className="container mx-auto px-4">
                <header className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Мои Курсы</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Программы, созданные с любовью и заботой о вашем здоровье.
                        Выберите то, что откликается вам сейчас.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div key={course.id} className="flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
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
                            <div className="p-8 flex flex-col flex-1">
                                <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
                                <p className="text-muted-foreground mb-6 line-clamp-3">
                                    {course.description}
                                </p>

                                <div className="mt-auto space-y-6">
                                    <ul className="space-y-2">
                                        {course.features.slice(0, 3).map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4 border-t">
                                        {course.price ? (
                                            <div className="space-y-3">
                                                <div className="font-bold text-lg">
                                                    {course.price.toLocaleString('ru-RU')} ₽
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link href={`/courses/${course.slug}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            Подробнее
                                                        </Button>
                                                    </Link>
                                                    <form action={initiatePayment.bind(null, course.id)} className="flex-1">
                                                        <Button type="submit" size="sm" className="w-full">
                                                            Купить
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">
                                                Бесплатно / Скоро
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
