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
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    slug: string;
    image: string;
    features: string[];
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
