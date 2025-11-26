'use client';

import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
    collapsed?: boolean;
}

export function LogoutButton({ collapsed }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth', { method: 'DELETE' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                collapsed && "justify-center px-2"
            )}
            onClick={handleLogout}
            title={collapsed ? "Выйти" : undefined}
        >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Выйти</span>}
        </Button>
    );
}
