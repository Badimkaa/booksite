import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { getSettings, getActiveRegistrationsCount } from "@/lib/db";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-merriweather",
});

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = settings.title || 'Наталья - Телесный терапевт';
  const description = settings.description || 'Телесный терапевт и женский наставник. Помогаю женщинам обрести гармонию души и тела, восстановить здоровье и найти путь к себе.';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ['телесный терапевт', 'женский наставник', 'телесная терапия', 'женское здоровье', 'курсы для женщин', 'наставничество'],
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: '/',
      siteName,
      title: siteName,
      description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: ['/og-image.jpg'],
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
    verification: {
      // Add your verification codes here when you get them
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-me'
);

async function getUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    console.log('RootLayout: No token found');
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('RootLayout: Token verified, role:', payload.role);
    return payload.role as string;
  } catch (e) {
    console.error('RootLayout: Token verification failed', e);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getUserRole();
  const registrationsCount = role ? await getActiveRegistrationsCount() : 0;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8b5cf6" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          inter.variable,
          merriweather.variable
        )}
      >
        {role && <AdminSidebar role={role} registrationsCount={registrationsCount} />}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
