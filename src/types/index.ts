export interface Chapter {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    videoUrl?: string;
    telegramLink?: string;
    views?: number;
    lastModifiedBy?: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price?: number;
    slug: string;
    image: string;
    accessContent?: string; // Link or message to show after payment
    features: string[];
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleEvent {
    id: string;
    title: string;
    date: string;
    type: 'online' | 'offline';
    location: string;
    link?: string;
    price?: number;
}

export interface Testimonial {
    id: string;
    name: string;
    text: string;
    date: string;
    program?: string;
    avatar?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'EDITOR';

export interface User {
    id: string;
    username: string;
    passwordHash: string;
    role: UserRole;
    createdAt: string;
}

export interface Comment {
    id: string;
    chapterId: string;
    userId?: string;
    username: string;
    content: string;
    createdAt: string;
}

export interface Registration {
    id: string;
    eventId: string;
    eventTitle: string;
    name: string;
    contact: string;
    message?: string;
    createdAt: string;
}
