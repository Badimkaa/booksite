import fs from 'fs/promises';
import path from 'path';
import { Chapter } from '@/types';

const dataDirectory = path.join(process.cwd(), 'data');
const chaptersFile = path.join(dataDirectory, 'chapters.json');

async function ensureDataDirectory() {
    try {
        await fs.access(dataDirectory);
    } catch {
        await fs.mkdir(dataDirectory, { recursive: true });
    }
}

export async function getChapters(): Promise<Chapter[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(chaptersFile, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function getChapter(slug: string): Promise<Chapter | undefined> {
    const chapters = await getChapters();
    return chapters.find((chapter) => chapter.slug === slug);
}

export async function getChapterById(id: string): Promise<Chapter | undefined> {
    const chapters = await getChapters();
    return chapters.find((chapter) => chapter.id === id);
}

export async function saveChapter(chapter: Chapter): Promise<void> {
    const chapters = await getChapters();
    const existingIndex = chapters.findIndex((c) => c.id === chapter.id);

    if (existingIndex >= 0) {
        // Check for removed images
        const oldChapter = chapters[existingIndex];
        const imgRegex = /<img[^>]+src="([^">]+)"/g;

        const oldImages = new Set<string>();
        let match;
        while ((match = imgRegex.exec(oldChapter.content)) !== null) {
            if (match[1].startsWith('/uploads/')) {
                oldImages.add(match[1]);
            }
        }

        const newImages = new Set<string>();
        while ((match = imgRegex.exec(chapter.content)) !== null) {
            if (match[1].startsWith('/uploads/')) {
                newImages.add(match[1]);
            }
        }

        // Delete images that are in old but not in new
        for (const img of oldImages) {
            if (!newImages.has(img)) {
                const filename = img.split('/').pop();
                if (filename) {
                    const filepath = path.join(process.cwd(), 'public/uploads', filename);
                    try {
                        await fs.unlink(filepath);
                    } catch (error) {
                        console.error(`Failed to delete file: ${filepath}`, error);
                    }
                }
            }
        }

        chapters[existingIndex] = chapter;
    } else {
        chapters.push(chapter);
    }

    await fs.writeFile(chaptersFile, JSON.stringify(chapters, null, 2));
}

export async function deleteChapter(id: string): Promise<void> {
    const chapters = await getChapters();
    const chapterToDelete = chapters.find((c) => c.id === id);

    if (chapterToDelete) {
        // Extract image URLs from content
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = imgRegex.exec(chapterToDelete.content)) !== null) {
            const src = match[1];
            if (src.startsWith('/uploads/')) {
                const filename = src.split('/').pop();
                if (filename) {
                    const filepath = path.join(process.cwd(), 'public/uploads', filename);
                    try {
                        await fs.unlink(filepath);
                    } catch (error) {
                        console.error(`Failed to delete file: ${filepath}`, error);
                    }
                }
            }
        }
    }

    const newChapters = chapters.filter((c) => c.id !== id);
    await fs.writeFile(chaptersFile, JSON.stringify(newChapters, null, 2));
}

export async function incrementChapterViews(id: string): Promise<void> {
    const chapters = await getChapters();
    const chapter = chapters.find((c) => c.id === id);

    if (chapter) {
        chapter.views = (chapter.views || 0) + 1;
        await fs.writeFile(chaptersFile, JSON.stringify(chapters, null, 2));
    }
}

export async function reorderChapters(orderedIds: string[]): Promise<void> {
    const chapters = await getChapters();
    const chapterMap = new Map(chapters.map((c) => [c.id, c]));

    const newChapters: Chapter[] = [];

    // Add chapters in the new order
    for (const id of orderedIds) {
        const chapter = chapterMap.get(id);
        if (chapter) {
            newChapters.push(chapter);
            chapterMap.delete(id);
        }
    }

    // Append any remaining chapters (safety fallback)
    for (const chapter of chapterMap.values()) {
        newChapters.push(chapter);
    }

    await fs.writeFile(chaptersFile, JSON.stringify(newChapters, null, 2));
}

const settingsFile = path.join(dataDirectory, 'settings.json');

export interface SiteSettings {
    title: string;
    description: string;
}

export async function getSettings(): Promise<SiteSettings> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(settingsFile, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return {
            title: "Название Книги",
            description: "Описание книги..."
        };
    }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    await ensureDataDirectory();
    await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2));
}

const coursesFile = path.join(dataDirectory, 'courses.json');
const scheduleFile = path.join(dataDirectory, 'schedule.json');

import { Course, ScheduleEvent } from '@/types';

export async function getCourses(): Promise<Course[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(coursesFile, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function getCourse(slug: string): Promise<Course | undefined> {
    const courses = await getCourses();
    return courses.find((course) => course.slug === slug);
}

export async function getSchedule(): Promise<ScheduleEvent[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(scheduleFile, 'utf8');
        // Sort by date
        const events: ScheduleEvent[] = JSON.parse(fileContent);
        return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
        return [];
    }
}

export async function saveCourse(course: Course): Promise<void> {
    const courses = await getCourses();
    const existingIndex = courses.findIndex((c) => c.id === course.id);

    if (existingIndex >= 0) {
        courses[existingIndex] = course;
    } else {
        courses.push(course);
    }

    await fs.writeFile(coursesFile, JSON.stringify(courses, null, 2));
}

export async function deleteCourse(id: string): Promise<void> {
    const courses = await getCourses();
    const newCourses = courses.filter((c) => c.id !== id);
    await fs.writeFile(coursesFile, JSON.stringify(newCourses, null, 2));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
    const courses = await getCourses();
    return courses.find((course) => course.id === id);
}

export async function saveScheduleEvent(event: ScheduleEvent): Promise<void> {
    const schedule = await getSchedule();
    const existingIndex = schedule.findIndex((e) => e.id === event.id);

    if (existingIndex >= 0) {
        schedule[existingIndex] = event;
    } else {
        schedule.push(event);
    }

    await fs.writeFile(scheduleFile, JSON.stringify(schedule, null, 2));
}

export async function deleteScheduleEvent(id: string): Promise<void> {
    const schedule = await getSchedule();
    const newSchedule = schedule.filter((e) => e.id !== id);
    await fs.writeFile(scheduleFile, JSON.stringify(newSchedule, null, 2));
}

export async function getScheduleEventById(id: string): Promise<ScheduleEvent | undefined> {
    const schedule = await getSchedule();
    return schedule.find((event) => event.id === id);
}

const testimonialsFile = path.join(dataDirectory, 'testimonials.json');
import { Testimonial } from '@/types';

export async function getTestimonials(): Promise<Testimonial[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(testimonialsFile, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

const usersFile = path.join(dataDirectory, 'users.json');
import { User } from '@/types';

export async function getUsers(): Promise<User[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(usersFile, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find((user) => user.username === username);
}

export async function saveUser(user: User): Promise<void> {
    const users = await getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }

    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

export async function deleteUser(id: string): Promise<void> {
    const users = await getUsers();
    const newUsers = users.filter((u) => u.id !== id);
    await fs.writeFile(usersFile, JSON.stringify(newUsers, null, 2));
}

const commentsFile = path.join(dataDirectory, 'comments.json');
import { Comment } from '@/types';

export async function getComments(chapterId: string): Promise<Comment[]> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(commentsFile, 'utf8');
        const allComments: Comment[] = JSON.parse(fileContent);
        return allComments.filter(c => c.chapterId === chapterId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        return [];
    }
}

export async function saveComment(comment: Comment): Promise<void> {
    await ensureDataDirectory();
    let comments: Comment[] = [];
    try {
        const fileContent = await fs.readFile(commentsFile, 'utf8');
        comments = JSON.parse(fileContent);
    } catch (error) {
        // File doesn't exist or is empty
    }

    comments.push(comment);
    await fs.writeFile(commentsFile, JSON.stringify(comments, null, 2));
}

export async function deleteComment(id: string): Promise<void> {
    await ensureDataDirectory();
    try {
        const fileContent = await fs.readFile(commentsFile, 'utf8');
        let comments: Comment[] = JSON.parse(fileContent);
        comments = comments.filter(c => c.id !== id);
        await fs.writeFile(commentsFile, JSON.stringify(comments, null, 2));
    } catch (error) {
        // Ignore
    }
}
