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
        chapters[existingIndex] = chapter;
    } else {
        chapters.push(chapter);
    }

    await fs.writeFile(chaptersFile, JSON.stringify(chapters, null, 2));
}

export async function deleteChapter(id: string): Promise<void> {
    const chapters = await getChapters();
    const newChapters = chapters.filter((c) => c.id !== id);
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
