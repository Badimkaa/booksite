'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
    BookOpen,
    GraduationCap,
    Calendar,
    Settings,
    LayoutDashboard,
    Users,
    Home,
    User,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
    role: string;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Persist collapsed state
    useEffect(() => {
        const stored = localStorage.getItem('admin-sidebar-collapsed');
        if (stored) {
            setIsCollapsed(stored === 'true');
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('admin-sidebar-collapsed', String(newState));
    };

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = href === '/admin'
            ? pathname === href
            : pathname === href || pathname?.startsWith(href + '/');

        return (
            <Link href={href} title={isCollapsed ? label : undefined}>
                <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                        "w-full justify-start gap-3 mb-1",
                        isCollapsed && "justify-center px-2",
                        isActive && "bg-secondary"
                    )}
                >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && <span>{label}</span>}
                </Button>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Trigger */}
            <div className="fixed bottom-4 right-4 z-50 md:hidden">
                <Button
                    size="icon"
                    className="rounded-full shadow-lg h-12 w-12"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "bg-card border-r flex-col transition-all duration-300 ease-in-out z-40",
                    // Mobile styles
                    "fixed inset-y-0 left-0 w-64 shadow-2xl transform",
                    // Desktop styles (reset fixed, use relative)
                    "md:relative md:transform-none md:shadow-none",
                    !isMobileOpen && "-translate-x-full md:translate-x-0",
                    // Desktop collapsed styles
                    isCollapsed ? "md:w-16" : "md:w-64"
                )}
            >
                {/* Header / Toggle */}
                <div className={cn("p-4 border-b flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl truncate">
                            <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />
                            <span>Админка</span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex h-8 w-8 ml-auto"
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Дашборд" />
                    <NavItem href="/admin/book" icon={BookOpen} label="Книга" />
                    <NavItem href="/admin/courses" icon={GraduationCap} label="Курсы" />
                    <NavItem href="/admin/schedule" icon={Calendar} label="Расписание" />

                    {role === 'SUPER_ADMIN' && (
                        <NavItem href="/admin/users" icon={Users} label="Пользователи" />
                    )}

                    <div className="my-2 border-t mx-2" />

                    <NavItem href="/admin/settings" icon={Settings} label="Настройки" />
                    <NavItem href="/admin/profile" icon={User} label="Профиль" />
                </nav>

                {/* Footer Actions */}
                <div className="p-2 border-t space-y-1">
                    <NavItem href="/" icon={Home} label="На сайт" />

                    <div className={cn("flex", isCollapsed ? "justify-center" : "px-4 py-2")}>
                        <LogoutButton collapsed={isCollapsed} />
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
