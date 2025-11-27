'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Registration } from '@/types';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, Calendar, MessageSquare, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STATUS_OPTIONS = [
    { value: 'new', label: 'Новая', color: 'bg-gray-100 text-gray-800' },
    { value: 'processing', label: 'В работе', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Завершена', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Отменена', color: 'bg-red-100 text-red-800' },
];

export default function RegistrationCard({ registration }: { registration: Registration }) {
    const router = useRouter();
    const [status, setStatus] = useState(registration.status || 'new');
    const [notes, setNotes] = useState(registration.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setHasChanges(true);
    };

    const handleNotesChange = (newNotes: string) => {
        setNotes(newNotes);
        setHasChanges(true);
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/registrations/${registration.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes }),
            });

            if (!res.ok) throw new Error('Failed to save');

            setHasChanges(false);
            router.refresh(); // Refresh to update sidebar count
        } catch (error) {
            console.error('Error saving:', error);
            alert('Не удалось сохранить изменения');
        } finally {
            setIsSaving(false);
        }
    };

    const currentStatusColor = STATUS_OPTIONS.find(o => o.value === status)?.color || 'bg-gray-100 text-gray-800';

    return (
        <div className={`bg-card border rounded-xl p-6 shadow-sm transition-all ${status === 'new' ? 'border-blue-200 shadow-blue-50' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold mb-1">{registration.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(registration.createdAt)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {registration.eventTitle}
                    </div>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`text-sm font-medium px-2 py-1 rounded-md border-none cursor-pointer ${currentStatusColor}`}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{registration.email || 'Не указан'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{registration.contact}</span>
                    </div>
                    {registration.message && (
                        <div className="flex items-start gap-2 bg-muted/20 p-3 rounded-lg">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-muted-foreground italic">"{registration.message}"</p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Заметки администратора</label>
                    <textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        className="w-full min-h-[80px] p-2 text-sm border rounded-md bg-background focus:ring-1 focus:ring-primary"
                        placeholder="Например: позвонить завтра..."
                    />
                    {hasChanges && (
                        <div className="flex justify-end">
                            <Button size="sm" onClick={saveChanges} disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />}
                                Сохранить
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
