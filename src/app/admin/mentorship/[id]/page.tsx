import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function parseJson(jsonString: string) {
    if (!jsonString) return '';
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            return parsed.join(', ');
        }
        if (typeof parsed === 'object' && parsed !== null) {
            return JSON.stringify(parsed); // Fallback for objects
        }
        return String(parsed); // Convert numbers/booleans to string
    } catch (e) {
        return jsonString;
    }
}

export default async function AdminMentorshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const app = await prisma.mentorshipApplication.findUnique({
        where: { id }
    });

    if (!app) {
        notFound();
    }

    // Mark as read if it was new
    if (app.status === 'new') {
        try {
            await prisma.mentorshipApplication.update({
                where: { id: app.id },
                data: { status: 'read' }
            });
        } catch (e) {
            console.error('Failed to update status:', e);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/mentorship">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Анкета от {new Date(app.createdAt).toLocaleDateString('ru-RU')}</h1>
            </div>

            <div className="grid gap-6">
                {/* Основная информация */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Основное
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Состояние (Одним словом)</div>
                            <div className="text-xl font-medium mt-1">{app.stateOneWord}</div>
                        </div>
                        {app.telegram && (
                            <div>
                                <div className="text-sm text-muted-foreground">Telegram</div>
                                <div className="text-lg text-blue-600 mt-1">{app.telegram}</div>
                            </div>
                        )}
                        <div>
                            <div className="text-sm text-muted-foreground">Дата заполнения</div>
                            <div className="text-lg mt-1">{new Date(app.createdAt).toLocaleString('ru-RU')}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Блок 1: Состояние */}
                <Card>
                    <CardHeader>
                        <CardTitle>Блок 1. Состояние</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="font-medium mb-2">О чем говорит тело?</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{parseJson(app.bodyMessage)}</div>
                        </div>
                        <div>
                            <div className="font-medium mb-2">Какое чувство фонит?</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{parseJson(app.mainFeeling)}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Блок 2: Этап */}
                <Card>
                    <CardHeader>
                        <CardTitle>Блок 2. Этап Пути</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="font-medium mb-2">Стадия Бабочки</div>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-lg">
                                {app.butterflyStage}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Блок 3: Отношения */}
                <Card>
                    <CardHeader>
                        <CardTitle>Блок 3. Отношения и Род</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="font-medium mb-2">Отношения</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{app.relations}</div>
                        </div>
                        <div>
                            <div className="font-medium mb-2">Поддержка рода</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{app.familySupport || '-'}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Блок 4: Потребности */}
                <Card>
                    <CardHeader>
                        <CardTitle>Блок 4. Потребности</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="font-medium mb-2">Нужна поддержка</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{parseJson(app.supportNeeded)}</div>
                        </div>
                        <div>
                            <div className="font-medium mb-2">Желаемый формат</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{parseJson(app.preferredFormat)}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Блок 5-6: Контакт */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            Контакт и Личное
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="font-medium mb-2">Уровень контакта</div>
                            <div className="p-4 bg-muted/30 rounded-lg">{parseJson(app.contactLevel)}</div>
                        </div>
                        {app.personalMessage && (
                            <div>
                                <div className="font-medium mb-2">Личное сообщение</div>
                                <div className="p-6 bg-yellow-50/50 border border-yellow-100 rounded-lg italic text-lg">
                                    "{app.personalMessage}"
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
