'use client';

import { Snowflake, Waves, TreeDeciduous } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function MentorshipInfo() {
    const points = [
        {
            icon: Snowflake,
            title: "Заморозка и Чувства",
            description: "Учимся проживать эмоции, чтобы они не застревали в теле (психосоматика, пищеварение, зажимы)."
        },
        {
            icon: Waves,
            title: "Жидкости и Поток",
            description: "Запускаем движение лимфы и энергии. Когда внутри свободно, жизнь течет легко."
        },
        {
            icon: TreeDeciduous,
            title: "Опора и Род",
            description: "Находим свое место в системе, чтобы перестать \"спасать всех\" и начать жить свою жизнь."
        }
    ];

    return (
        <section className="py-16 bg-secondary/20 rounded-3xl my-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            Персональное Наставничество: Путь Бабочки
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Глубокая работа для тех, кто готов к трансформации. Я работаю комплексно:
                            мы соединяем тело, эмоции и твое место в родовой системе.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {points.map((point, index) => (
                            <Card key={index} className="bg-background/50 border-none shadow-md hover:shadow-lg transition-all duration-300">
                                <CardHeader className="space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                        <point.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl font-serif text-center">
                                        {point.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-muted-foreground">
                                        {point.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-primary/5 rounded-xl p-8 text-center space-y-4 border border-primary/10">
                        <h3 className="text-xl font-bold font-serif">Формат работы</h3>
                        <p className="text-lg text-muted-foreground">
                            2-3 месяца личной работы. Вход только через анкету и собеседование.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
