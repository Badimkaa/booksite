import { notFound, redirect } from 'next/navigation';
import { getScheduleEventById, saveScheduleEvent, deleteScheduleEvent } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { ScheduleEvent } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { fromMoscowISOString, toMoscowISOString } from '@/lib/date-utils';

interface EventEditorProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EventEditorPage({ params }: EventEditorProps) {
    const { id } = await params;
    const isNew = id === 'new';

    let event: ScheduleEvent = {
        id: uuidv4(),
        title: '',
        date: new Date(), // Current date/time for input
        type: 'online',
        location: '',
        link: '',
        price: 0
    };

    if (!isNew) {
        const existingEvent = await getScheduleEventById(id);
        if (!existingEvent) {
            notFound();
        }
        event = existingEvent;
    }

    async function saveAction(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const dateString = formData.get('date') as string;
        const type = formData.get('type') as 'online' | 'offline';
        const location = formData.get('location') as string;
        const link = formData.get('link') as string;
        const price = Number(formData.get('price'));

        // Convert the input string (which assumes Moscow time) to a UTC Date
        const date = fromMoscowISOString(dateString);

        const newEvent: ScheduleEvent = {
            id: isNew ? uuidv4() : id,
            title,
            date,
            type,
            location,
            link,
            price
        };

        await saveScheduleEvent(newEvent);
        redirect('/admin/schedule');
    }

    async function deleteAction() {
        'use server';
        await deleteScheduleEvent(id);
        redirect('/admin/schedule');
    }

    return (
        <div className="container mx-auto max-w-3xl py-10 px-6">
            <div className="mb-8">
                <Link href="/admin/schedule" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к списку
                </Link>
                <h1 className="text-3xl font-bold font-serif">
                    {isNew ? 'Создание события' : 'Редактирование события'}
                </h1>
            </div>

            <form action={saveAction} className="space-y-8">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="font-medium">Название события</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={event.title}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="date" className="font-medium">Дата и время (по Мск)</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                // Pre-fill with Moscow time representation of the event date
                                defaultValue={toMoscowISOString(event.date)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="type" className="font-medium">Тип</label>
                            <select
                                id="type"
                                name="type"
                                defaultValue={event.type}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="online">Онлайн</option>
                                <option value="offline">Оффлайн</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="location" className="font-medium">Место проведения (для оффлайн) или Платформа (для онлайн)</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            defaultValue={event.location}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="link" className="font-medium">Ссылка (на запись или регистрацию)</label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            defaultValue={event.link ?? ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="price" className="font-medium">Цена (₽)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={event.price ?? ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                        {!isNew && (
                            <DeleteButton onDelete={deleteAction} label="Удалить событие" />
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/schedule">
                            <Button type="button" variant="outline">Отмена</Button>
                        </Link>
                        <Button type="submit" className="gap-2">
                            <Save className="h-4 w-4" />
                            Сохранить
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
