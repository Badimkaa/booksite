
import { prisma } from '@/lib/prisma';
import type { SiteSettings } from '@/types';

export async function getSettings(): Promise<SiteSettings> {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
        return prisma.siteSettings.create({
            data: {
                id: 1,
                title: 'Наталья',
                description: 'Сайт Натальи',
                bookTitle: 'Моя Книга'
            }
        });
    }
    return settings;
}

export async function saveSettings(settings: { title: string; description: string; bookTitle: string; heroImage?: string }): Promise<void> {
    await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: settings,
        create: { id: 1, ...settings }
    });
}
