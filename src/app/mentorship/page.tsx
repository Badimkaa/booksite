import { MentorshipForm } from '@/components/mentorship/MentorshipForm';
import { MentorshipInfo } from '@/components/mentorship/MentorshipInfo';

export const metadata = {
    title: 'Твой Путь | Наталья',
    description: 'Навигатор состояния и бережное возвращение к себе.',
};

export default function MentorshipPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Твой Путь: <span className="text-primary">Навигатор Состояния</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                        Бережное возвращение к себе
                    </p>

                    <div className="max-w-3xl mx-auto mt-12 p-8 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm animate-in fade-in zoom-in duration-700 delay-300">
                        <p className="text-lg md:text-xl leading-relaxed italic text-foreground/80">
                            «Я подхожу к женщине комплексно: эмоции, тело, движение, место в родовой системе — всё влияет на всё.
                            Мы не &quot;чиним&quot; тело, мы бережно возвращаемся домой».
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro Text */}
            <section className="py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Ты чувствуешь, что старые схемы больше не работают? Тело просит тишины или, наоборот, кричит о внимании?
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Чтобы понять, куда двигаться дальше, не нужно бежать быстрее. Нужно остановиться и заметить себя.
                        Погрузиться в свое состояние и честно ответить: &quot;Что я чувствую прямо сейчас?&quot;.
                    </p>
                    <p className="text-lg font-medium text-primary">
                        Это не просто опрос. Это практика-рефлексия, первый шаг к диалогу с телом.
                    </p>
                </div>
            </section>

            {/* Questionnaire Section */}
            <section id="questionnaire" className="py-8 bg-muted/10">
                <div className="container mx-auto px-4">
                    <MentorshipForm />
                </div>
            </section>

            {/* Product Info Section */}
            <MentorshipInfo />
        </main>
    );
}
