import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Eye, FileSpreadsheet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMentorshipPage() {
    const applications = await prisma.mentorshipApplication.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Ответы на форму</h1>
                    <div className="text-muted-foreground">
                        Всего: {applications.length}
                    </div>
                </div>
                <Link href="https://docs.google.com/spreadsheets/d/1ZNlkMRc8e5dezGpsYAceXdfMbW9YlqXE6G6FMv2jF0A" target="_blank">
                    <Button variant="outline" className="gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        Открыть Google Таблицу
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {applications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Пока нет ни одной заполненной анкеты.
                        </CardContent>
                    </Card>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center justify-between gap-4">
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-lg truncate">
                                            {app.stateOneWord}
                                        </span>
                                        {app.status === 'new' && (
                                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                                Новая
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                                        <span>{new Date(app.createdAt).toLocaleString('ru-RU')}</span>
                                        <span>•</span>
                                        <span className="truncate max-w-[200px]">{app.butterflyStage}</span>
                                    </div>
                                    {app.telegram && (
                                        <div className="text-sm text-blue-600">
                                            Telegram: {app.telegram}
                                        </div>
                                    )}
                                </div>

                                <Link href={`/admin/mentorship/${app.id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        Просмотр
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
