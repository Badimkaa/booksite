import { prisma } from '@/lib/prisma';
import type {
    Chapter,
    Course,
    ScheduleEvent,
    Testimonial,
    User,
    Comment,
    Registration,
    SiteSettings
} from '@/types';

// --- Chapters ---
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

// --- Settings ---
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

export async function saveSettings(settings: { title: string; description: string; bookTitle: string }): Promise<void> {
    await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: settings,
        create: { id: 1, ...settings }
    });
}

// --- Courses ---
export async function getCourses(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
        orderBy: { order: 'asc' }
    });
    // Parse features from JSON string
    return courses.map((c): Course => ({
        ...c,
        features: JSON.parse(c.features) as string[]
    }));
}

export async function getCourseById(id: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return null;
    return {
        ...course,
        features: JSON.parse(course.features) as string[]
    } as Course;
}

export async function getCourse(slug: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) return null;
    return {
        ...course,
        features: JSON.parse(course.features) as string[]
    } as Course;
}

export async function saveCourse(course: Partial<Course> & { id: string }): Promise<void> {
    const { id, title, description, slug, ...rest } = course;

    if (!title || !description || !slug) {
        throw new Error('Title, description, and slug are required to save a course.');
    }

    const courseData = {
        title,
        description,
        slug,
        price: rest.price,
        image: rest.image || '',
        accessContent: rest.accessContent,
        features: JSON.stringify(rest.features || []),
        isActive: rest.isActive,
    };

    await prisma.course.upsert({
        where: { id: id },
        update: courseData,
        create: {
            id: id,
            ...courseData,
            isActive: rest.isActive ?? true,
        }
    });
}

export async function deleteCourse(id: string): Promise<void> {
    await prisma.course.delete({ where: { id } });
}

export async function reorderCourses(orderedIds: string[]): Promise<void> {
    // Update order for each course based on its position in the array
    const updates = orderedIds.map((id, index) =>
        prisma.course.update({
            where: { id },
            data: { order: index }
        })
    );

    await Promise.all(updates);
}

// --- Schedule ---
export async function getSchedule(): Promise<ScheduleEvent[]> {
    return prisma.scheduleEvent.findMany({
        orderBy: { date: 'asc' }
    }) as Promise<ScheduleEvent[]>;
}

export async function getScheduleEventById(id: string): Promise<ScheduleEvent | null> {
    return prisma.scheduleEvent.findUnique({ where: { id } }) as Promise<ScheduleEvent | null>;
}

export async function saveScheduleEvent(event: ScheduleEvent): Promise<void> {
    await prisma.scheduleEvent.upsert({
        where: { id: event.id },
        update: {
            title: event.title,
            date: event.date,
            type: event.type,
            location: event.location,
            link: event.link,
            price: event.price,
        },
        create: {
            id: event.id,
            title: event.title,
            date: event.date,
            type: event.type,
            location: event.location,
            link: event.link,
            price: event.price,
        }
    });
}

export async function deleteScheduleEvent(id: string): Promise<void> {
    await prisma.scheduleEvent.delete({ where: { id } });
}

// --- Testimonials ---
export async function getTestimonials(): Promise<Testimonial[]> {
    return prisma.testimonial.findMany({
        orderBy: { date: 'desc' }
    });
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
    await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {
            name: testimonial.name,
            text: testimonial.text,
            date: testimonial.date,
            program: testimonial.program,
            avatar: testimonial.avatar,
        },
        create: {
            id: testimonial.id,
            name: testimonial.name,
            text: testimonial.text,
            date: testimonial.date,
            program: testimonial.program,
            avatar: testimonial.avatar,
        }
    });
}

export async function deleteTestimonial(id: string): Promise<void> {
    await prisma.testimonial.delete({ where: { id } });
}

// --- Users ---
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

// --- Comments ---
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

// --- Registrations ---
export async function getRegistrations(): Promise<Registration[]> {
    return prisma.registration.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function saveRegistration(registration: Registration): Promise<void> {
    await prisma.registration.create({
        data: {
            id: registration.id,
            eventId: registration.eventId,
            eventTitle: registration.eventTitle,
            name: registration.name,
            email: registration.email,
            contact: registration.contact,
            message: registration.message,
            status: registration.status,
            notes: registration.notes,
        }
    });
}

export async function updateRegistration(id: string, data: { status?: string; notes?: string }): Promise<void> {
    await prisma.registration.update({
        where: { id },
        data
    });
}

export async function getActiveRegistrationsCount(): Promise<number> {
    return prisma.registration.count({
        where: {
            status: {
                in: ['new', 'processing']
            }
        }
    });
}
