'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Registration, ScheduleEvent } from '@/types';
import RegistrationCard from '@/components/admin/RegistrationCard';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface RegistrationsManagerProps {
    initialRegistrations: Registration[];
    schedule: ScheduleEvent[];
}

export default function RegistrationsManager({ initialRegistrations, schedule }: RegistrationsManagerProps) {
    const searchParams = useSearchParams();
    const eventFromUrl = searchParams.get('event');
    const [selectedEvent, setSelectedEvent] = useState<string | null>(eventFromUrl);
    const [showPast, setShowPast] = useState(false);

    // Create a map of eventId to event date
    const eventDates = useMemo(() => {
        const map: Record<string, Date> = {};
        schedule.forEach(event => {
            map[event.id] = new Date(event.date);
        });
        return map;
    }, [schedule]);

    // Group registrations by eventTitle and separate by active/past
    const { activeEvents, pastEvents } = useMemo(() => {
        const groups: Record<string, Registration[]> = {};
        const now = new Date();

        initialRegistrations.forEach((reg) => {
            const title = reg.eventTitle || 'Без названия';
            if (!groups[title]) {
                groups[title] = [];
            }
            groups[title].push(reg);
        });

        const active: Record<string, Registration[]> = {};
        const past: Record<string, Registration[]> = {};

        Object.entries(groups).forEach(([title, regs]) => {
            // Get the event date from the first registration's eventId
            const eventDate = regs[0]?.eventId ? eventDates[regs[0].eventId] : null;

            if (eventDate && eventDate < now) {
                past[title] = regs;
            } else {
                active[title] = regs;
            }
        });

        return { activeEvents: active, pastEvents: past };
    }, [initialRegistrations, eventDates]);

    const activeEventTitles = Object.keys(activeEvents);
    const pastEventTitles = Object.keys(pastEvents);

    const renderEventCard = (title: string, regs: Registration[]) => {
        const newCount = regs.filter(r => r.status === 'new').length;
        const processingCount = regs.filter(r => r.status === 'processing').length;
        const completedCount = regs.filter(r => r.status === 'completed').length;
        const cancelledCount = regs.filter(r => r.status === 'cancelled').length;

        return (
            <div
                key={title}
                onClick={() => setSelectedEvent(title)}
                className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Users className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {newCount > 0 && (
                            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                                {newCount} новых
                            </span>
                        )}
                        {processingCount > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                {processingCount} в работе
                            </span>
                        )}
                        {completedCount > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                {completedCount} завершена
                            </span>
                        )}
                        {cancelledCount > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                {cancelledCount} отменена
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>

                <div className="text-muted-foreground text-sm">
                    Всего заявок: <span className="font-medium text-foreground">{regs.length}</span>
                </div>
            </div>
        );
    };

    if (selectedEvent) {
        const eventRegistrations = [...(activeEvents[selectedEvent] || []), ...(pastEvents[selectedEvent] || [])];

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Все мероприятия
                    </Button>
                    <h2 className="text-2xl font-bold font-serif">{selectedEvent}</h2>
                    <span className="text-muted-foreground text-sm bg-muted px-2 py-1 rounded-full">
                        {eventRegistrations.length} заявок
                    </span>
                </div>

                <div className="space-y-4">
                    {eventRegistrations.map((reg) => (
                        <RegistrationCard key={reg.id} registration={reg} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Active Events */}
            {activeEventTitles.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Предстоящие мероприятия</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeEventTitles.map((title) => renderEventCard(title, activeEvents[title]))}
                    </div>
                </div>
            )}

            {/* Past Events - Collapsible */}
            {pastEventTitles.length > 0 && (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => setShowPast(!showPast)}
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        {showPast ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                        Прошедшие мероприятия ({pastEventTitles.length})
                    </Button>

                    {showPast && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                            {pastEventTitles.map((title) => renderEventCard(title, pastEvents[title]))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
