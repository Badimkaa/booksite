import Link from 'next/link';
import { getChapters } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const chapters = await getChapters();

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление книгой</h1>
                <div className="flex gap-2">
                    <Link href="/admin/settings">
                        <Button variant="outline">Настройки</Button>
                    </Link>
                    <Link href="/admin/write">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Новая глава
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {chapters.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        Пока нет ни одной главы. Начните писать!
                    </div>
                ) : (
                    chapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{chapter.title}</h3>
                                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                    <span>
                                        {chapter.published ? (
                                            <span className="text-green-600 font-medium">Опубликовано</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">Черновик</span>
                                        )}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(chapter.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/read/${chapter.slug}`} target="_blank">
                                    <Button variant="ghost" size="icon" title="Просмотреть">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={`/admin/edit/${chapter.id}`}>
                                    <Button variant="outline" size="icon" title="Редактировать">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
