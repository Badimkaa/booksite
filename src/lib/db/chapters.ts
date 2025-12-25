
import { prisma } from '@/lib/prisma';
import type { Chapter } from '@/types';

export async function getChapters(): Promise<Chapter[]> {
    return prisma.chapter.findMany({
        orderBy: { order: 'asc' }
    });
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
    return prisma.chapter.findUnique({
        where: { slug }
    });
}

export async function getChapter(slug: string): Promise<Chapter | null> {
    return getChapterBySlug(slug);
}

export async function getChapterById(id: string): Promise<Chapter | null> {
    return prisma.chapter.findUnique({
        where: { id }
    });
}

export async function incrementChapterViews(id: string): Promise<void> {
    await prisma.chapter.update({
        where: { id },
        data: {
            views: {
                increment: 1
            }
        }
    });
}

export async function reorderChapters(orderedIds: string[]): Promise<void> {
    // Update order for each chapter based on its position in the array
    const updates = orderedIds.map((id, index) =>
        prisma.chapter.update({
            where: { id },
            data: { order: index }
        })
    );

    await Promise.all(updates);
}

export async function saveChapter(chapter: Partial<Chapter> & { id: string; title: string; slug: string; content: string }): Promise<void> {
    await prisma.chapter.upsert({
        where: { id: chapter.id },
        update: {
            title: chapter.title,
            slug: chapter.slug,
            content: chapter.content,
            excerpt: chapter.excerpt || '',
            published: chapter.published ?? false,
            videoUrl: chapter.videoUrl,
            telegramLink: chapter.telegramLink,
            lastModifiedBy: chapter.lastModifiedBy,
        },
        create: {
            id: chapter.id,
            title: chapter.title,
            slug: chapter.slug,
            content: chapter.content,
            excerpt: chapter.excerpt || '',
            published: chapter.published ?? false,
            videoUrl: chapter.videoUrl,
            telegramLink: chapter.telegramLink,
            lastModifiedBy: chapter.lastModifiedBy,
        }
    });
}

export async function deleteChapter(id: string): Promise<void> {
    await prisma.chapter.delete({ where: { id } });
}
