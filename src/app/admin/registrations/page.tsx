import { getRegistrations, getSchedule } from '@/lib/db';
import RegistrationsManager from '@/components/admin/RegistrationsManager';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage() {
    const [registrations, schedule] = await Promise.all([
        getRegistrations(),
        getSchedule()
    ]);

    return (
        <div className="container mx-auto max-w-5xl py-10 px-6">
            <h1 className="text-3xl font-bold font-serif mb-8">Заявки на мероприятия</h1>

            {registrations.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                    <p className="text-lg text-muted-foreground">
                        Пока нет ни одной заявки.
                    </p>
                </div>
            ) : (
                <RegistrationsManager initialRegistrations={registrations} schedule={schedule} />
            )}
        </div>
    );
}
