
'use client';

import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        router.push('/login');
        router.refresh();
    };

    return (
        <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Выйти
        </Button>
    );
}
