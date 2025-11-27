import { Metadata } from 'next';

interface OpenGraphConfig {
    title: string;
    description: string;
    url?: string;
    image?: string;
    type?: 'website' | 'article' | 'book' | 'profile';
    siteName?: string;
}

interface StructuredDataOrganization {
    name: string;
    description: string;
    url: string;
    logo?: string;
    sameAs?: string[];
}

interface StructuredDataCourse {
    name: string;
    description: string;
    provider: string;
    price: number;
    currency?: string;
    image?: string;
}

interface StructuredDataArticle {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
}

interface StructuredDataEvent {
    name: string;
    description: string;
    startDate: string;
    location: string;
    price?: number;
    currency?: string;
}

const DEFAULT_SITE_NAME = 'Наталья - Телесный терапевт';
const DEFAULT_IMAGE = '/og-image.jpg'; // Создадим позже

/**
 * Generate comprehensive metadata for a page
 */
export function generatePageMetadata({
    title,
    description,
    url,
    image,
    type = 'website',
    siteName = DEFAULT_SITE_NAME,
}: OpenGraphConfig): Metadata {
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const ogImage = image || DEFAULT_IMAGE;

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'ru_RU',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema({
    name,
    description,
    url,
    logo,
    sameAs = [],
}: StructuredDataOrganization) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        description,
        url,
        logo: logo ? {
            '@type': 'ImageObject',
            url: logo,
        } : undefined,
        sameAs,
    };
}

/**
 * Generate JSON-LD structured data for Course
 */
export function generateCourseSchema({
    name,
    description,
    provider,
    price,
    currency = 'RUB',
    image,
}: StructuredDataCourse) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name,
        description,
        provider: {
            '@type': 'Organization',
            name: provider,
        },
        offers: {
            '@type': 'Offer',
            price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
        },
        image: image || undefined,
    };
}

/**
 * Generate JSON-LD structured data for Article/BlogPosting
 */
export function generateArticleSchema({
    headline,
    description,
    author,
    datePublished,
    dateModified,
    image,
}: StructuredDataArticle) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        author: {
            '@type': 'Person',
            name: author,
        },
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || undefined,
    };
}

/**
 * Generate JSON-LD structured data for Event
 */
export function generateEventSchema({
    name,
    description,
    startDate,
    location,
    price,
    currency = 'RUB',
}: StructuredDataEvent) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        description,
        startDate,
        location: {
            '@type': 'Place',
            name: location,
        },
        offers: price ? {
            '@type': 'Offer',
            price,
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
        } : undefined,
    };
}
