
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SiteSettings } from '@/types';

interface HeroSectionProps {
    settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
    return (
        <section className="relative py-20 md:py-32 bg-muted/30 overflow-hidden">
            <div className="container px-4 mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-10 text-center md:text-left z-10">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-[0.12em] text-foreground uppercase leading-[1.1]">
                            Складнева Наташа.<br />
                            <span className="text-primary/90">Телом к себе</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto md:mx-0 italic opacity-80">
                            Ежедневные телесные практики для женщин: чувствительность, опора и спокойствие
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
                        <Link href="/mentorship">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                Начать путь к себе
                            </Button>
                        </Link>
                        <Link href="/courses">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-primary/20 hover:bg-primary/5 transition-all hover:border-primary/40">
                                Выбрать курс
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex-1 relative z-10">
                    <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mx-auto">
                        {/* Decorative background circle */}
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse -z-10" />

                        <div className="relative w-full h-full rounded-full border-4 border-white/50 dark:border-white/10 overflow-hidden shadow-2xl flex items-center justify-center bg-muted">
                            {settings.heroImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={settings.heroImage}
                                    alt="Наталья Складнева"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="text-center p-8 space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                                        <span className="text-primary text-2xl font-bold">Н</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">
                                        Место для вашего фото<br />
                                        (загрузите в админке)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
