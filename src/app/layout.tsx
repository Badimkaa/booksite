import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { getSettings } from "@/lib/db";

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
  return {
    title: settings.title,
    description: settings.description,
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

  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          inter.variable,
          merriweather.variable
        )}
      >
        {role && <AdminSidebar role={role} />}
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
