import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { initiatePayment } from '@/app/actions/payment';
import { generatePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

interface CoursePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        return {};
    }

    return generatePageMetadata({
        title: course.title,
        description: course.description,
        url: `/courses/${course.slug}`,
        image: course.image || undefined,
        type: 'website',
    });
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background font-serif py-12 md:py-20">
            <div className="container mx-auto px-4">
                <Link href="/courses" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Все курсы
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {course.description}
                        </p>

                        <div className="bg-muted/30 p-8 rounded-2xl border">
                            <h3 className="text-xl font-bold mb-6">Что вы получите:</h3>
                            <ul className="space-y-4">
                                {course.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                        <span className="text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {course.details && (
                            <div className="mt-16">
                                <div className="bg-secondary/10 rounded-3xl p-8 md:p-10 border border-secondary/20 relative overflow-hidden">
                                    {/* Decorative background element */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                                    <h2 className="text-2xl md:text-3xl font-bold mb-8 font-serif text-foreground relative z-10">
                                        Подробнее о программе
                                    </h2>
                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-p:text-muted-foreground prose-li:text-muted-foreground relative z-10"
                                        dangerouslySetInnerHTML={{ __html: course.details }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-24">
                        <div className="bg-card rounded-2xl overflow-hidden shadow-lg border p-1">
                            <div className="aspect-video bg-muted relative rounded-xl overflow-hidden mb-6">
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
                            <div className="p-6 pt-0 text-center">
                                <div className="text-3xl font-bold mb-6">{course.price} ₽</div>
                                <form action={initiatePayment.bind(null, course.id)}>
                                    <Button type="submit" size="lg" className="w-full text-lg h-14 mb-4">
                                        Купить курс
                                    </Button>
                                </form>
                                <p className="text-sm text-muted-foreground">
                                    Доступ к материалам открывается сразу после оплаты
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
