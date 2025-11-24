'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            router.push('/admin');
        } else {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground font-serif">
                        Вход для администратора
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Input
                                type="text"
                                required
                                placeholder="Имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="rounded-md"
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                required
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive text-center">{error}</div>
                    )}

                    <div>
                        <Button type="submit" className="w-full">
                            Войти
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
