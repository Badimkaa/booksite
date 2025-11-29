import { getTestimonials } from '@/lib/db';
import { Quote } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="min-h-screen bg-background font-serif py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Отзывы</h1>
                    <p className="text-xl text-muted-foreground">
                        Истории изменений и результаты моих клиентов.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow relative">
                            <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center text-lg font-bold text-primary">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.program}</div>
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic">
                                &quot;{testimonial.text}&quot;
                            </p>
                            <div className="mt-4 text-xs text-muted-foreground text-right">
                                {formatDate(testimonial.date)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
