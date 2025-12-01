'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

// Schema
const formSchema = z.object({
    stateOneWord: z.string().min(1, "Это поле обязательно"),
    bodyMessage: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    mainFeeling: z.array(z.string()).min(1, "Выберите хотя бы один вариант"),
    butterflyStage: z.string().nullable().refine(val => val !== null && val.length > 0, { message: "Выберите вариант" }),
    relations: z.string().nullable().optional(),
    familySupport: z.string().nullable().optional(),
    supportNeeded: z.array(z.string()).optional(),
    preferredFormat: z.array(z.string()).optional(),
    contactLevel: z.array(z.string()).optional(),
    personalMessage: z.string().optional(),
    telegram: z.string().min(1, "Это поле обязательно"),
});

type FormData = z.infer<typeof formSchema>;

// Questions Data
const questions = {
    bodyMessage: [
        "Оно полно энергии, я чувствую силу и гибкость",
        "Оно просит тишины и покоя, хочется свернуться калачиком",
        "Чувствую напряжение или «заморозку» (плечи, челюсть, таз)",
        "Оно болит / кричит, привлекая к себе внимание",
        "Я почти не чувствую его. Живу «в голове»",
        "Другое"
    ],
    mainFeeling: [
        "Благодарность и любовь",
        "Тревога и страх перед будущим",
        "Усталость и апатия (ничего не хочется)",
        "Одиночество и боль (проживаю потерю/разрыв)",
        "Интерес и предвкушение нового",
        "Пустота (состояние «Ничто»)"
    ],
    butterflyStage: [
        "Гусеница: Я накапливаю опыт, много работаю, действую, ищу, пробую, но пока двигаюсь немного вслепую",
        "Куколка (Распад): Старое разрушилось, мне больно, одиноко и тесно. Привычные схемы не работают, я теряю старую идентичность",
        "Ничто (Пустота): Я в точке «ноль». Я не чувствую себя, я потерялась. Кажется, что ничего не происходит, но я учусь сдаваться этой тишине",
        "Рождение Бабочки: Я чувствую прилив новых сил. Я расправляю крылья, проявляюсь, принимаю свою природу и готова лететь",
        "Зависла между циклами: Чувствую, что пора меняться, но держусь за старое из последних сил"
    ],
    relations: [
        "Я в гармоничном союзе, учимся любить и слышать друг друга",
        "Я в поиске, мое сердце открыто",
        "Я переживаю расставание / кризис в отношениях",
        "Я сознательно выбираю быть одной сейчас (соло-путешествие к себе)",
        "Чувствую, что путаю роли (я «мама» для своего мужчины или родителей)"
    ],
    familySupport: [
        "Да",
        "Частично",
        "Нет, чувствую разрыв",
        "Никогда об этом не думала",
        "Другое"
    ],
    supportNeeded: [
        "Телесная: Практики, чтобы вернуть чувствительность, снять зажимы, заземлиться.",
        "Духовная/Ментальная: Медитации, смыслы, понимание «зачем это всё», разговор с Богом.",
        "Эмоциональная/Сестринство: Теплый круг, возможность выговориться и быть услышанной без осуждения.",
        "Навигация: Мне нужен вектор, подсказка, куда двигаться дальше",
        "Тишина: Мне нужно просто побыть одной, чтобы никто не трогал"
    ],
    preferredFormat: [
        "Живой женский круг / встреча",
        "Совместная онлайн-медитация или дыхательная практика",
        "Наставничество и путь в поддержке",
        "Разбор ситуаций (вопрос-ответ) в канале",
        "Серия постов/подкастов на конкретную тему (напиши ниже)",
        "Просто читать твои тексты — этого уже достаточно"
    ],
    contactLevel: [
        "Хочу поговорить лично",
        "Готова написать, но без звонка",
        "Хочу просто побыть в канале",
        "Пока не готова к личному контакту"
    ]
};

export function MentorshipForm() {
    const [isStarted, setIsStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bodyMessage: [],
            mainFeeling: [],
            supportNeeded: [],
            preferredFormat: [],
            contactLevel: []
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/mentorship/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to submit');

            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-serif font-bold">Благодарю за честность!</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Твоё сердце откликнулось — и это уже движение. <br />
                    Я изучу твой ответ и напишу тебе, если ты оставила контакт.
                </p>
                <div className="p-6 bg-secondary/20 rounded-xl border border-secondary">
                    <p className="text-lg font-medium mb-4">А пока, для поддержки твоего состояния:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/courses">
                            <Button variant="outline" className="w-full h-auto py-4 text-lg">
                                Посмотреть курсы
                            </Button>
                        </Link>
                        <Link href="/book">
                            <Button variant="outline" className="w-full h-auto py-4 text-lg">
                                Читать книгу
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Пройди диагностику состояния (10-15 минут), чтобы получить от меня персональный вектор:
                    какая практика, медитация или формат работы станут твоей опорой именно сейчас.
                </p>
                <Button
                    size="lg"
                    className="text-xl px-12 py-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    onClick={() => setIsStarted(true)}
                >
                    Пройти Анкету-Рефлексию
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

                {/* Блок 1 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 1. Состояние (Тело и Эмоции)</h3>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">
                            1. Если бы твое состояние сегодня можно было описать одним словом или образом, что бы это было? <span className="text-destructive">*</span>
                        </label>
                        <Input {...register('stateOneWord')} placeholder="Твой ответ..." className="text-lg p-6" />
                        {errors.stateOneWord && <p className="text-destructive text-sm">{errors.stateOneWord.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">
                            2. О чем сейчас говорит твое тело? (Можно несколько) <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                            {questions.bodyMessage.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="checkbox" value={option} {...register('bodyMessage')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.bodyMessage && <p className="text-destructive text-sm">{errors.bodyMessage.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">
                            3. Какое чувство сейчас фонит громче всего? (Можно несколько) <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                            {questions.mainFeeling.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="checkbox" value={option} {...register('mainFeeling')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.mainFeeling && <p className="text-destructive text-sm">{errors.mainFeeling.message}</p>}
                    </div>
                </section>

                {/* Блок 2 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 2. Этап Пути (Метафора Бабочки)</h3>
                    <div className="space-y-3">
                        <label className="text-lg font-medium">
                            4. Где ты ощущаешь себя прямо сейчас? <span className="text-destructive">*</span>
                        </label>
                        <div className="space-y-2">
                            {questions.butterflyStage.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="radio" value={option} {...register('butterflyStage')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.butterflyStage && <p className="text-destructive text-sm">{errors.butterflyStage.message}</p>}
                    </div>
                </section>

                {/* Блок 3 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 3. Отношения и Система</h3>
                    <div className="space-y-3">
                        <label className="text-lg font-medium">5. Как сейчас звучит тема отношений в твоей жизни?</label>
                        <div className="space-y-2">
                            {questions.relations.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="radio" value={option} {...register('relations')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.relations && <p className="text-destructive text-sm">{errors.relations.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">6. Чувствуешь ли ты поддержку своего рода сейчас? (По желанию)</label>
                        <div className="space-y-2">
                            {questions.familySupport.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="radio" value={option} {...register('familySupport')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Блок 4 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 4. Потребность и Поддержка</h3>
                    <div className="space-y-3">
                        <label className="text-lg font-medium">7. В какой поддержке ты нуждаешься прямо сейчас? (Можно несколько)</label>
                        <div className="space-y-2">
                            {questions.supportNeeded.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="checkbox" value={option} {...register('supportNeeded')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.supportNeeded && <p className="text-destructive text-sm">{errors.supportNeeded.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">8. Какой формат откликнулся бы твоему сердцу? (Можно несколько)</label>
                        <div className="space-y-2">
                            {questions.preferredFormat.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="checkbox" value={option} {...register('preferredFormat')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.preferredFormat && <p className="text-destructive text-sm">{errors.preferredFormat.message}</p>}
                    </div>
                </section>

                {/* Блок 5 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 5. Границы и готовность</h3>
                    <div className="space-y-3">
                        <label className="text-lg font-medium">9. Какой уровень контакта сейчас для тебя комфортен?</label>
                        <div className="space-y-2">
                            {questions.contactLevel.map((option) => (
                                <label key={option} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <input type="checkbox" value={option} {...register('contactLevel')} className="mt-1.5 w-5 h-5 min-w-5 accent-primary" />
                                    <span className="text-lg leading-relaxed">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.contactLevel && <p className="text-destructive text-sm">{errors.contactLevel.message}</p>}
                    </div>
                </section>

                {/* Блок 6 */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-primary">Блок 6. Открытое сердце</h3>
                    <div className="space-y-3">
                        <label className="text-lg font-medium">10. Есть ли что-то, чем ты хочешь поделиться лично со мной?</label>
                        <Textarea {...register('personalMessage')} placeholder="Твоя история или мысли..." className="min-h-[150px] text-lg p-6" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-lg font-medium">
                            11. Твой ник в Telegram (для связи) <span className="text-destructive">*</span>
                        </label>
                        <Input {...register('telegram')} placeholder="@username" className="text-lg p-6" />
                        {errors.telegram && <p className="text-destructive text-sm">{errors.telegram.message}</p>}
                    </div>
                </section>

                {error && <p className="text-destructive text-center font-medium">{error}</p>}

                <div className="pt-8">
                    <Button type="submit" size="lg" className="w-full text-xl py-8 rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Отправка...
                            </>
                        ) : (
                            'Отправить Анкету'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
