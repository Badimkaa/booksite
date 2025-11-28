import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCourseById, saveCourse, deleteCourse } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Course } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save } from 'lucide-react';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { DeleteButton } from '@/components/admin/DeleteButton';

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
        accessContent: null,
        features: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
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
        const price = formData.get('price') ? Number(formData.get('price')) : undefined;
        const slug = formData.get('slug') as string;
        const accessContent = formData.get('accessContent') as string;
        const featuresString = formData.get('features') as string;
        const isActive = formData.get('isActive') === 'on';
        const imageFile = formData.get('image') as File;

        let imagePath = course?.image;

        if (imageFile && imageFile.size > 0) {
            // Delete old image if exists
            if (course.image && course.image.startsWith('/uploads/')) {
                try {
                    const oldFilename = course.image.replace('/uploads/', '');
                    const oldFilepath = path.join(process.cwd(), 'public/uploads', oldFilename);
                    await unlink(oldFilepath);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${uuidv4()}${path.extname(imageFile.name)}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            imagePath = `/uploads/${filename}`;
        }

        const newCourse: Course = {
            id: isNew ? uuidv4() : id,
            title,
            description,
            price: formData.get('price') ? Number(formData.get('price')) : null,
            slug,
            image: imagePath,
            features: featuresString.split('\n').filter(f => f.trim() !== ''),
            accessContent,
            isActive,
            createdAt: course?.createdAt || new Date(),
            updatedAt: new Date(),
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
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            defaultChecked={course.isActive !== false}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isActive" className="font-medium">Активный курс (виден на сайте)</label>
                    </div>

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
                            defaultValue={course.price ?? ''}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="image" className="font-medium">Изображение курса</label>
                        <div className="flex items-center gap-4">
                            {course.image && (
                                <div className="relative w-24 h-16 rounded overflow-hidden border bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={course.image} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
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
                        <label htmlFor="accessContent" className="font-medium">Материалы после оплаты (ссылка или сообщение)</label>
                        <textarea
                            id="accessContent"
                            name="accessContent"
                            defaultValue={course.accessContent || ''}
                            rows={3}
                            placeholder="Спасибо за покупку! Ссылка на материалы: https://..."
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
                    <div>
                        {!isNew && (
                            <DeleteButton onDelete={deleteAction} label="Удалить курс" />
                        )}
                    </div>
                    <div className="flex gap-4">
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
