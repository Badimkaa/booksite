import { getSchedule } from '@/lib/db';
import ScheduleList from '@/components/schedule/ScheduleList';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
    const schedule = await getSchedule();
    const upcomingEvents = schedule.filter(e => new Date(e.date) > new Date());
    const pastEvents = schedule.filter(e => new Date(e.date) <= new Date());

    return (
        <div className="min-h-screen bg-background font-serif py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Расписание</h1>
                    <p className="text-xl text-muted-foreground">
                        Ближайшие встречи, практики и вебинары.
                    </p>
                </header>

                <ScheduleList upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
            </div>
        </div>
    );
}
