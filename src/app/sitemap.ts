import { MetadataRoute } from 'next';
import { getChapters, getCourses } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://feelyourwoman.ru';

    // Get dynamic content
    const [chapters, courses] = await Promise.all([
        getChapters(),
        getCourses(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mentorship`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/schedule`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/book`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/testimonials`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/feedback`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Dynamic course pages
    const coursePages: MetadataRoute.Sitemap = courses
        .filter(course => course.isActive !== false)
        .map((course) => ({
            url: `${baseUrl}/courses/${course.slug}`,
            lastModified: new Date(course.updatedAt || course.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));

    // Dynamic book chapter pages
    const chapterPages: MetadataRoute.Sitemap = chapters
        .filter(chapter => chapter.published)
        .map((chapter) => ({
            url: `${baseUrl}/read/${chapter.slug}`,
            lastModified: new Date(chapter.updatedAt || chapter.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    return [...staticPages, ...coursePages, ...chapterPages];
}
