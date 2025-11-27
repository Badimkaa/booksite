import Link from 'next/link';
import { getSchedule, getRegistrations } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Calendar, MapPin, Video, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ScheduleAdminPage() {
    const [schedule, registrations] = await Promise.all([
        getSchedule(),
        getRegistrations()
    ]);

    // Count registrations per event
    const registrationCounts: Record<string, number> = {};
    registrations.forEach(reg => {
        registrationCounts[reg.eventId] = (registrationCounts[reg.eventId] || 0) + 1;
    });

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление расписанием</h1>
                <Link href="/admin/schedule/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить событие
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {schedule.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-card border rounded-lg">
                        Нет запланированных событий. Создайте первое!
                    </div>
                ) : (
                    <>
                        {/* Upcoming Events */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Предстоящие события
                            </h2>
                            {schedule.filter(e => new Date(e.date) > new Date()).length === 0 ? (
                                <div className="text-muted-foreground italic p-4 border border-dashed rounded-lg">
                                    Нет предстоящих событий
                                </div>
                            ) : (
                                schedule.filter(e => new Date(e.date) > new Date()).map((event) => {
                                    const count = registrationCounts[event.id] || 0;
                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow border-primary/20"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-2 min-w-[60px] text-center">
                                                    <span className="text-xl font-bold text-primary">
                                                        {new Date(event.date).getDate()}
                                                    </span>
                                                    <span className="text-xs uppercase text-muted-foreground">
                                                        {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{event.title}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            {event.type === 'online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                                            {event.type === 'online' ? 'Онлайн' : 'Оффлайн'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(event.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {count > 0 && (
                                                    <Link href={`/admin/registrations?event=${encodeURIComponent(event.title)}`}>
                                                        <Button variant="secondary" size="sm" className="gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {count}
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={`/admin/schedule/${event.id}`}>
                                                    <Button variant="outline" size="icon" title="Редактировать">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Past Events */}
                        {schedule.filter(e => new Date(e.date) <= new Date()).length > 0 && (
                            <div className="space-y-4 pt-8 border-t">
                                <h2 className="text-xl font-bold mb-4 text-muted-foreground">Прошедшие события</h2>
                                {schedule.filter(e => new Date(e.date) <= new Date()).map((event) => {
                                    const count = registrationCounts[event.id] || 0;
                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-muted/10 opacity-70 hover:opacity-100 transition-opacity"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-2 min-w-[60px] text-center grayscale">
                                                    <span className="text-xl font-bold text-muted-foreground">
                                                        {new Date(event.date).getDate()}
                                                    </span>
                                                    <span className="text-xs uppercase text-muted-foreground">
                                                        {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-muted-foreground">{event.title}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            {event.type === 'online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                                            {event.type === 'online' ? 'Онлайн' : 'Оффлайн'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {count > 0 && (
                                                    <Link href={`/admin/registrations?event=${encodeURIComponent(event.title)}`}>
                                                        <Button variant="ghost" size="sm" className="gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {count}
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={`/admin/schedule/${event.id}`}>
                                                    <Button variant="ghost" size="icon" title="Редактировать">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
