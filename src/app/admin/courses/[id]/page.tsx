import { notFound, redirect } from 'next/navigation';
import { getCourseById, saveCourse, deleteCourse } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Course } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface CourseEditorProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CourseEditorPage({ params }: CourseEditorProps) {
    const { id } = await params;
    const isNew = id === 'new';

    let course: Course = {
        id: uuidv4(),
        title: '',
        description: '',
        price: 0,
        slug: '',
        image: '',
        features: []
    };

    if (!isNew) {
        const existingCourse = await getCourseById(id);
        if (!existingCourse) {
            notFound();
        }
        course = existingCourse;
    }

    async function saveAction(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const slug = formData.get('slug') as string;
        const featuresString = formData.get('features') as string;

        const newCourse: Course = {
            id: isNew ? uuidv4() : id,
            title,
            description,
            price,
            slug,
            image: '', // Placeholder
            features: featuresString.split('\n').filter(f => f.trim() !== '')
        };

        await saveCourse(newCourse);
        redirect('/admin/courses');
    }

    async function deleteAction() {
        'use server';
        await deleteCourse(id);
        redirect('/admin/courses');
    }

    return (
        <div className="container mx-auto max-w-3xl py-10 px-6">
            <div className="mb-8">
                <Link href="/admin/courses" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к списку
                </Link>
                <h1 className="text-3xl font-bold font-serif">
                    {isNew ? 'Создание курса' : 'Редактирование курса'}
                </h1>
            </div>

            <form action={saveAction} className="space-y-8">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="font-medium">Название курса</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={course.title}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="slug" className="font-medium">Slug (URL адрес)</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            defaultValue={course.slug}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="price" className="font-medium">Цена (₽)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={course.price}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="description" className="font-medium">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={course.description}
                            required
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="features" className="font-medium">Особенности (каждая с новой строки)</label>
                        <textarea
                            id="features"
                            name="features"
                            defaultValue={course.features.join('\n')}
                            rows={6}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    {!isNew && (
                        <Button
                            type="button"
                            variant="destructive"
                            formAction={deleteAction}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Удалить курс
                        </Button>
                    )}
                    <div className="flex gap-4 ml-auto">
                        <Link href="/admin/courses">
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
import Link from 'next/link';
