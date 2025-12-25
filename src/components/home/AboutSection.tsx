
import { Heart, Activity, Waves } from 'lucide-react';

export function AboutSection() {
    const roles = [
        {
            title: 'Телесный терапевт',
            desc: '«Из головы — в тело» через возвращение чувствительности и телесного знания.',
            icon: Waves,
            color: 'bg-blue-500/10 text-blue-600'
        },
        {
            title: 'Тренер-кинезиолог',
            desc: 'Мягкое восстановление тела: женское здоровье, спина, ТБС, послеродовое восстановление.',
            icon: Activity,
            color: 'bg-emerald-500/10 text-emerald-600'
        },
        {
            title: 'Расстановщик',
            desc: 'Специалист, работающий со структурными изменениями родовых программ.',
            icon: Heart,
            color: 'bg-rose-500/10 text-rose-600'
        }
    ];

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-sm font-sans font-bold tracking-[0.2em] text-primary uppercase">Обо мне</h2>
                    <p className="text-3xl md:text-4xl font-sans font-bold text-foreground">Путь к себе начинается с тела</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {roles.map((role, i) => (
                        <div
                            key={i}
                            className="group p-8 rounded-3xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <role.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-sans uppercase tracking-[0.05em]">{role.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {role.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
