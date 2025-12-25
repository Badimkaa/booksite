
import { prisma } from '@/lib/prisma';
import type { Course } from '@/types';

export async function getCourses(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
        orderBy: { order: 'asc' }
    });
    // Parse features from JSON string
    return courses.map((c): Course => ({
        ...c,
        features: JSON.parse(c.features) as string[],
        details: c.details
    }));
}

export async function getCourseById(id: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return null;
    return {
        ...course,
        features: JSON.parse(course.features) as string[],
        details: course.details
    } as Course;
}

export async function getCourse(slug: string): Promise<Course | null> {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) return null;
    return {
        ...course,
        features: JSON.parse(course.features) as string[],
        details: course.details
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
        details: rest.details,
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
