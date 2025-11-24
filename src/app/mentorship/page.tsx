import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Star, Heart, Users, Calendar } from 'lucide-react';
import { SOCIAL_LINKS } from '@/config/social';

export default function MentorshipPage() {
    return (
        <div className="min-h-screen bg-background font-serif">
            {/* Hero */}
            <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-sans mb-6">
                        Старт следующего потока: 1 декабря
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Путь к себе
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-12 leading-relaxed max-w-2xl mx-auto">
                        3-х месячное глубокое погружение в работу с телом, сознанием и состоянием.
                        Верни себе себя в поддерживающем кругу единомышленниц.
                    </p>
                    <a href={SOCIAL_LINKS.TELEGRAM} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="secondary" className="text-lg px-10 h-14 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                            Заполнить анкету предзаписи
                        </Button>
                    </a>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            </section>

            {/* For whom */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Эта программа для тебя, если ты:</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            "Чувствуешь хроническую усталость и отсутствие энергии",
                            "Потеряла контакт со своим телом и желаниями",
                            "Живешь в постоянном стрессе и напряжении",
                            "Хочешь наладить отношения с собой и окружающими",
                            "Ищешь поддержку и безопасное пространство для роста",
                            "Готова к глубоким трансформациям и переменам"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-muted/30 rounded-2xl border hover:border-primary/30 transition-colors">
                                <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <p className="text-lg text-muted-foreground">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Structure */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Что тебя ждет внутри</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card p-8 rounded-2xl shadow-sm border text-center">
                            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Calendar className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">12 недель работы</h3>
                            <p className="text-muted-foreground">
                                Пошаговая система восстановления и трансформации. Еженедельные модули и задания.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-2xl shadow-sm border text-center">
                            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Групповые встречи</h3>
                            <p className="text-muted-foreground">
                                Еженедельные созвоны в Zoom с разборами, практиками и ответами на вопросы.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-2xl shadow-sm border text-center">
                            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Star className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Личное сопровождение</h3>
                            <p className="text-muted-foreground">
                                Обратная связь от меня по каждому заданию и поддержка в чате 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-background text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Готова начать свой путь?</h2>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                        Количество мест в группе ограничено для сохранения камерной и доверительной атмосферы.
                        Заполни анкету, чтобы попасть в список предзаписи.
                    </p>
                    <a href={SOCIAL_LINKS.TELEGRAM} target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="text-lg px-12 h-16 rounded-full">
                            Заполнить анкету
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
