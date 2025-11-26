'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-3xl font-bold font-serif mb-8">Профиль пользователя</h1>

            <div className="bg-background rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Смена пароля</h2>
                <ChangePasswordForm />
            </div>
        </div>
    );
}

function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Новые пароли не совпадают');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/users/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Пароль успешно изменен');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.error || 'Ошибка при смене пароля');
            }
        } catch (error) {
            console.error('Failed to change password', error);
            alert('Ошибка при смене пароля');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium mb-1">Текущий пароль</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Новый пароль</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Подтвердите новый пароль</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPassword ? 'Скрыть пароли' : 'Показать пароли'}
                </button>
            </div>

            <Button type="submit" disabled={isLoading} variant="secondary">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Изменить пароль
            </Button>
        </form>
    );
}
