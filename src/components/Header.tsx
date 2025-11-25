'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: '/book', label: 'Книга' },
        { href: '/courses', label: 'Курсы' },
        { href: '/mentorship', label: 'Наставничество' },
        { href: '/schedule', label: 'Расписание' },
        { href: '/feedback', label: 'Контакты' },
    ];

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 w-full border-b transition-all duration-300",
                    isScrolled
                        ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-2"
                        : "bg-transparent border-transparent py-4"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="font-serif text-2xl font-bold tracking-tight hover:text-primary transition-colors relative z-50"
                    >
                        Наталья
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative group py-1 transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-foreground/80"
                                )}
                            >
                                {link.label}
                                <span className={cn(
                                    "absolute inset-x-0 -bottom-0.5 h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out",
                                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 relative z-50">
                        <Link href="/mentorship" className="hidden md:block">
                            <Button variant="default" size="sm" className="rounded-full px-6">
                                Путь к себе
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                            <span className="sr-only">Меню</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden transition-all duration-300 ease-in-out",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8 pt-16">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-2xl font-serif font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-foreground/80"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/mentorship" className="mt-4">
                        <Button variant="default" size="lg" className="rounded-full px-8 text-lg">
                            Путь к себе
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
