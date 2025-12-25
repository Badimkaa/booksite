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
    Menu,
    Mail,
    FileText
} from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { cn } from '@/lib/utils';

const NavItem = ({ href, icon: Icon, label, count, pathname, isCollapsed }: { href: string; icon: React.ElementType; label: string; count?: number; pathname: string; isCollapsed: boolean }) => {
    const isActive = href === '/admin'
        ? pathname === href
        : pathname === href || pathname.startsWith(href + '/');

    return (
        <Link href={href} title={isCollapsed ? label : undefined}>
            <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                    "w-full justify-start gap-3 mb-1 relative",
                    isCollapsed && "justify-center px-2",
                    isActive && "bg-secondary"
                )}
            >
                <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between">
                        <span>{label}</span>
                        {count !== undefined && count > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {count}
                            </span>
                        )}
                    </div>
                )}
                {isCollapsed && count !== undefined && count > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full" />
                )}
            </Button>
        </Link>
    );
};

interface AdminSidebarProps {
    role: string;
    registrationsCount?: number;
}

export function AdminSidebar({ role, registrationsCount = 0 }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Sync collapsed state from localStorage on client mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('admin-sidebar-collapsed') === 'true';
            setTimeout(() => setIsCollapsed(stored), 0);
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-sidebar-collapsed', String(newState));
        }
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
                <div className={cn("border-b flex items-center transition-all", isCollapsed ? "justify-center p-2" : "justify-between p-4")}>
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl truncate">
                            <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />
                            <span>Админка</span>
                        </Link>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("hidden md:flex transition-all", isCollapsed ? "h-10 w-10 bg-muted/50 hover:bg-muted" : "h-8 w-8 ml-auto")}
                        onClick={toggleCollapse}
                        title={isCollapsed ? "Развернуть" : "Свернуть"}
                    >
                        {isCollapsed ? <ChevronRight className="h-6 w-6 text-primary" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Дашборд" pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/book" icon={BookOpen} label="Книга" pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/courses" icon={GraduationCap} label="Курсы" pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/schedule" icon={Calendar} label="Расписание" pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/registrations" icon={Mail} label="Заявки" count={registrationsCount} pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/mentorship" icon={FileText} label="Ответы на форму" pathname={pathname} isCollapsed={isCollapsed} />

                    {role === 'SUPER_ADMIN' && (
                        <NavItem href="/admin/users" icon={Users} label="Пользователи" pathname={pathname} isCollapsed={isCollapsed} />
                    )}

                    <div className="my-2 border-t mx-2" />

                    <NavItem href="/admin/settings" icon={Settings} label="Настройки" pathname={pathname} isCollapsed={isCollapsed} />
                    <NavItem href="/admin/profile" icon={User} label="Профиль" pathname={pathname} isCollapsed={isCollapsed} />
                </nav>

                {/* Footer Actions */}
                <div className="p-2 border-t space-y-1">
                    <NavItem href="/" icon={Home} label="На сайт" pathname={pathname} isCollapsed={isCollapsed} />

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
