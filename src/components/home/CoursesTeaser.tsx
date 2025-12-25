
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/types';

interface CoursesTeaserProps {
    courses: Course[];
}

export function CoursesTeaser({ courses }: CoursesTeaserProps) {
    return (
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
                        <div key={course.id} className="flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
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
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-2 font-serif">{course.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                    {course.description}
                                </p>
                                <div className="flex flex-col gap-3 mt-auto">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-lg">{course.price} ₽</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/courses/${course.slug}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">Подробнее</Button>
                                        </Link>
                                        <Link href={`/courses/${course.slug}`} className="flex-1">
                                            <Button size="sm" className="w-full">Купить</Button>
                                        </Link>
                                    </div>
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
    );
}
