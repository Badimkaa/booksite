import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const dataDir = path.join(process.cwd(), 'data');

async function readJson(filename: string) {
    try {
        const content = await fs.readFile(path.join(dataDir, filename), 'utf8');
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

function parseDate(dateStr: string | undefined): Date {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
}

async function main() {
    console.log('Starting migration...');

    // Users
    const users = await readJson('users.json');
    for (const u of users) {
        await prisma.user.upsert({
            where: { username: u.username },
            update: {},
            create: {
                id: u.id,
                username: u.username,
                passwordHash: u.passwordHash,
                role: u.role,
                createdAt: parseDate(u.createdAt),
            }
        });
    }
    console.log(`Migrated ${users.length} users.`);

    // Courses
    const courses = await readJson('courses.json');
    for (const c of courses) {
        await prisma.course.upsert({
            where: { slug: c.slug },
            update: {},
            create: {
                id: c.id,
                title: c.title,
                description: c.description,
                price: c.price,
                slug: c.slug,
                image: c.image,
                accessContent: c.accessContent,
                features: JSON.stringify(c.features),
                isActive: c.isActive !== false, // Handle undefined as true
                createdAt: parseDate(c.createdAt),
                updatedAt: parseDate(c.updatedAt),
            }
        });
    }
    console.log(`Migrated ${courses.length} courses.`);

    // Chapters
    const chapters = await readJson('chapters.json');
    for (const c of chapters) {
        await prisma.chapter.upsert({
            where: { slug: c.slug },
            update: {},
            create: {
                id: c.id,
                title: c.title,
                slug: c.slug,
                content: c.content,
                excerpt: c.excerpt,
                published: c.published,
                videoUrl: c.videoUrl,
                telegramLink: c.telegramLink,
                views: c.views || 0,
                lastModifiedBy: c.lastModifiedBy,
                createdAt: parseDate(c.createdAt),
                updatedAt: parseDate(c.updatedAt),
            }
        });
    }
    console.log(`Migrated ${chapters.length} chapters.`);

    // Orders
    const orders = await readJson('orders.json');
    for (const o of orders) {
        // Ensure course exists
        const course = await prisma.course.findUnique({ where: { id: o.courseId } });
        if (course) {
            await prisma.order.create({
                data: {
                    id: o.id,
                    courseId: o.courseId,
                    amount: o.amount,
                    status: o.status,
                    customerEmail: o.customerEmail,
                    customerPhone: o.customerPhone,
                    createdAt: parseDate(o.createdAt),
                    updatedAt: parseDate(o.updatedAt),
                }
            });
        }
    }
    console.log(`Migrated ${orders.length} orders.`);

    // Schedule
    const schedule = await readJson('schedule.json');
    for (const s of schedule) {
        await prisma.scheduleEvent.create({
            data: {
                id: s.id,
                title: s.title,
                date: parseDate(s.date),
                type: s.type,
                location: s.location,
                link: s.link,
                price: s.price,
            }
        });
    }
    console.log(`Migrated ${schedule.length} schedule events.`);

    // Testimonials
    const testimonials = await readJson('testimonials.json');
    for (const t of testimonials) {
        await prisma.testimonial.create({
            data: {
                id: t.id,
                name: t.name,
                text: t.text,
                date: parseDate(t.date),
                program: t.program,
                avatar: t.avatar,
            }
        });
    }
    console.log(`Migrated ${testimonials.length} testimonials.`);

    // Comments
    const comments = await readJson('comments.json');
    for (const c of comments) {
        // Ensure chapter exists
        const chapter = await prisma.chapter.findUnique({ where: { id: c.chapterId } });
        if (chapter) {
            await prisma.comment.create({
                data: {
                    id: c.id,
                    content: c.content,
                    chapterId: c.chapterId,
                    userId: c.userId,
                    username: c.username,
                    createdAt: parseDate(c.createdAt),
                }
            });
        }
    }
    console.log(`Migrated ${comments.length} comments.`);

    // Registrations
    const registrations = await readJson('registrations.json');
    for (const r of registrations) {
        await prisma.registration.create({
            data: {
                id: r.id,
                eventId: r.eventId,
                eventTitle: r.eventTitle,
                name: r.name,
                contact: r.contact,
                message: r.message,
                createdAt: parseDate(r.createdAt),
            }
        });
    }
    console.log(`Migrated ${registrations.length} registrations.`);

    // Settings
    try {
        const settingsContent = await fs.readFile(path.join(dataDir, 'settings.json'), 'utf8');
        const settings = JSON.parse(settingsContent);
        await prisma.siteSettings.upsert({
            where: { id: 1 },
            update: {
                title: settings.title,
                description: settings.description,
            },
            create: {
                id: 1,
                title: settings.title,
                description: settings.description,
            }
        });
        console.log('Migrated settings.');
    } catch (e) {
        console.log('No settings found or error migrating settings.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
