'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

const cards = [
    {
        id: 1,
        title: "Тело",
        description: "Чувствую усталость, напряжение, хочу вернуть легкость и здоровье.",
        result: "Твое тело просит внимания. Начни с малого — курса по тазовому дну или лимфодренажа. Это база, которая вернет энергию.",
        link: "/courses"
    },
    {
        id: 2,
        title: "Состояние",
        description: "Много тревоги, мыслей, нет ресурса и вдохновения.",
        result: "Тебе нужна опора и заземление. Наставничество «Путь к себе» поможет обрести внутренний стержень и спокойствие.",
        link: "/mentorship"
    },
    {
        id: 3,
        title: "Отношения",
        description: "Сложно с собой, с партнером, с миром. Хочу любви и принятия.",
        result: "Все начинается с любви к себе. Приходи на личную консультацию, мы найдем ключ к твоему сердцу.",
        link: "https://t.me/username"
    }
];

export default function FeedbackPage() {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background font-serif py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Что сейчас откликается?</h1>
                <p className="text-xl text-muted-foreground mb-16">
                    Выбери карту, которая лучше всего описывает твое состояние, и получи подсказку.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => setSelectedCard(card.id)}
                            className={cn(
                                "cursor-pointer perspective-1000 h-80 relative group transition-all duration-500",
                                selectedCard === card.id ? "scale-105" : "hover:scale-105"
                            )}
                        >
                            <div className={cn(
                                "w-full h-full transition-all duration-700 preserve-3d relative shadow-xl rounded-2xl",
                                selectedCard === card.id ? "rotate-y-180" : ""
                            )}>
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden bg-card border-2 border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-2xl font-bold text-primary">
                                        {card.id}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                                    <p className="text-muted-foreground">{card.description}</p>
                                    <div className="mt-auto pt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Нажми, чтобы перевернуть
                                    </div>
                                </div>

                                {/* Back */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                                    <p className="text-lg mb-6 leading-relaxed">
                                        {card.result}
                                    </p>
                                    <a href={card.link} target={card.link.startsWith('http') ? "_blank" : "_self"}>
                                        <Button variant="secondary" size="sm">
                                            Узнать больше
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-muted/30 p-8 md:p-12 rounded-3xl border max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Хочешь обсудить лично?</h2>
                    <p className="text-muted-foreground mb-8">
                        Напиши мне в Telegram, и мы подберем формат работы, который подойдет именно тебе.
                    </p>
                    <a href="https://t.me/username" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Написать мне
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
