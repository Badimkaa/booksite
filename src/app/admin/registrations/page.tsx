import { getRegistrations } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage() {
    const registrations = await getRegistrations();

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
                <div className="space-y-4">
                    {registrations.map((reg) => (
                        <div key={reg.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{reg.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(reg.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full self-start">
                                    {reg.eventTitle}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{reg.contact}</span>
                                </div>
                                {reg.message && (
                                    <div className="flex items-start gap-2 col-span-2 bg-muted/20 p-3 rounded-lg mt-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <p className="text-muted-foreground italic">"{reg.message}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
