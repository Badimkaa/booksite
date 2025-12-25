export interface Chapter {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    videoUrl: string | null;
    telegramLink: string | null;
    views: number;
    lastModifiedBy: string | null;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number | null;
    slug: string;
    image: string;
    accessContent: string | null; // Link or message to show after payment
    features: string[];
    details: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ScheduleEvent {
    id: string;
    title: string;
    date: Date;
    type: 'online' | 'offline';
    location: string;
    link: string | null;
    price: number | null;
}

export interface Testimonial {
    id: string;
    name: string;
    text: string;
    date: Date;
    program: string | null;
    avatar: string | null;
}

export type UserRole = 'SUPER_ADMIN' | 'EDITOR';

export interface User {
    id: string;
    username: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}

export interface Comment {
    id: string;
    chapterId: string;
    userId: string | null;
    username: string;
    content: string;
    createdAt: Date;
}

export interface Registration {
    id: string;
    eventId: string;
    eventTitle: string;
    name: string;
    email: string;
    contact: string;
    message: string | null;
    status: string;
    notes: string | null;
    createdAt: Date;
}

export interface SiteSettings {
    id: number;
    title: string;
    description: string;
    bookTitle?: string;
    heroImage?: string;
}

export interface Order {
    id: string;
    courseId: string;
    amount: number;
    status: string;
    customerEmail: string | null;
    customerPhone: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface MentorshipApplication {
    id: string;
    stateOneWord: string;
    bodyMessage: string[];
    mainFeeling: string[];
    butterflyStage: string;
    relations: string;
    familySupport: string | null;
    supportNeeded: string[];
    preferredFormat: string[];
    contactLevel: string[];
    personalMessage: string | null;
    telegram: string | null;
    status: string;
    createdAt: Date;
}
