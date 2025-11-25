'use client';

import { useState } from 'react';
import { ScheduleEvent } from '@/types';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Video, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import RegistrationModal from '@/components/schedule/RegistrationModal';

interface ScheduleListProps {
    upcomingEvents: ScheduleEvent[];
    pastEvents: ScheduleEvent[];
}

export default function ScheduleList({ upcomingEvents, pastEvents }: ScheduleListProps) {
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegister = (event: ScheduleEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                        <div key={event.id} className="bg-card border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-colors shadow-sm">
                            <div className="flex flex-col items-center justify-center bg-primary/5 rounded-xl p-4 min-w-[100px] text-center">
                                <span className="text-3xl font-bold text-primary">
                                    {new Date(event.date).getDate()}
                                </span>
                                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                    {new Date(event.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    {event.type === 'online' ? (
                                        <>
                                            <Video className="h-4 w-4" />
                                            Онлайн
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4" />
                                            Оффлайн
                                        </>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold">{event.title}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{new Date(event.date).toLocaleDateString('ru-RU', { weekday: 'long' })}</span>
                                    {event.location && (
                                        <>
                                            <span>•</span>
                                            <span>{event.location}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                                {event.price && (
                                    <div className="text-xl font-bold text-center md:text-right">
                                        {event.price} ₽
                                    </div>
                                )}
                                <Button className="w-full" onClick={() => handleRegister(event)}>
                                    Записаться
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl">
                        <p className="text-lg text-muted-foreground">
                            На данный момент запланированных мероприятий нет.
                            Следите за анонсами в моем Telegram-канале.
                        </p>
                    </div>
                )}
            </div>

            {pastEvents.length > 0 && (
                <div className="mt-20 opacity-60">
                    <h2 className="text-2xl font-bold mb-8 text-center">Прошедшие мероприятия</h2>
                    <div className="space-y-4">
                        {pastEvents.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-4 border rounded-xl bg-muted/10">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {formatDate(event.date)}
                                    </div>
                                    <div className="font-medium">{event.title}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Завершено</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedEvent && (
                <RegistrationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    eventId={selectedEvent.id}
                    eventTitle={selectedEvent.title}
                />
            )}
        </>
    );
}
