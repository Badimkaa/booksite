
import { prisma } from '@/lib/prisma';
import type { Comment } from '@/types';

export async function getComments(chapterId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
        where: { chapterId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function saveComment(comment: Partial<Comment> & { id: string; chapterId: string; content: string; username: string }): Promise<void> {
    await prisma.comment.create({
        data: {
            id: comment.id,
            content: comment.content,
            chapterId: comment.chapterId,
            userId: comment.userId,
            username: comment.username,
        }
    });
}

export async function deleteComment(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
}
