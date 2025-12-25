
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';

export async function getUsers(): Promise<User[]> {
    return prisma.user.findMany() as Promise<User[]>;
}

export async function getUser(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } }) as Promise<User | null>;
}

export async function saveUser(user: User): Promise<void> {
    await prisma.user.upsert({
        where: { id: user.id },
        update: {
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role,
        },
        create: {
            id: user.id,
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role,
        }
    });
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
}
