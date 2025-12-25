
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function MentorshipTeaser() {
    return (
        <section className="py-20 bg-primary text-primary-foreground">
            <div className="container px-4 mx-auto text-center max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Наставничество &quot;Путь к себе&quot;</h2>
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
    );
}
