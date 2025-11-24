
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/types';
import { Trash2, UserPlus, Shield, ShieldAlert } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New user form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'SUPER_ADMIN' | 'EDITOR'>('EDITOR');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });

            if (res.ok) {
                setUsername('');
                setPassword('');
                setRole('EDITOR');
                setIsCreating(false);
                fetchUsers();
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error('Failed to create user', error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    if (isLoading) return <div className="p-8">Загрузка...</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-serif">Управление пользователями</h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Добавить пользователя
                </Button>
            </div>

            {isCreating && (
                <div className="bg-muted/30 p-6 rounded-lg mb-8 border">
                    <h2 className="text-xl font-semibold mb-4">Новый пользователь</h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="EDITOR">Редактор</option>
                                <option value="SUPER_ADMIN">Главный администратор</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                                Отмена
                            </Button>
                            <Button type="submit">Создать</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-background rounded-lg border shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div className="col-span-4">Пользователь</div>
                    <div className="col-span-4">Роль</div>
                    <div className="col-span-3">Дата создания</div>
                    <div className="col-span-1 text-right">Действия</div>
                </div>
                {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/10 transition-colors">
                        <div className="col-span-4 font-medium flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user.username[0].toUpperCase()}
                            </div>
                            {user.username}
                        </div>
                        <div className="col-span-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'SUPER_ADMIN'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                {user.role === 'SUPER_ADMIN' ? <ShieldAlert className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                                {user.role === 'SUPER_ADMIN' ? 'Главный админ' : 'Редактор'}
                            </span>
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-span-1 text-right">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Удалить"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {users.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        Нет пользователей
                    </div>
                )}
            </div>
        </div>
    );
}
