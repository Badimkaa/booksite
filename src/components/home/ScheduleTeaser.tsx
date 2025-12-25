
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { ScheduleEvent } from '@/types';

interface ScheduleTeaserProps {
    events: ScheduleEvent[];
}

export function ScheduleTeaser({ events }: ScheduleTeaserProps) {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 mx-auto max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Ближайшие встречи</h2>

                <div className="space-y-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border rounded-xl gap-4 hover:border-primary/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-primary font-medium mb-1">
                                            {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                                        <p className="text-muted-foreground text-sm">{event.type === 'online' ? 'Онлайн' : event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 md:self-center self-start mt-2 md:mt-0 w-full md:w-auto">
                                    {event.price && <span className="font-semibold ml-auto md:ml-0">{event.price} ₽</span>}
                                    <a href={event.link ?? undefined} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                                        <Button className="w-full md:w-auto">Записаться</Button>
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Расписание формируется. Следите за обновлениями!
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <Link href="/schedule">
                        <Button variant="outline">Полное расписание</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
