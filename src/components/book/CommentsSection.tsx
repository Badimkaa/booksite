'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CommentsSectionProps {
    chapterId: string;
    isAdmin?: boolean;
}

export default function CommentsSection({ chapterId, isAdmin }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?chapterId=${chapterId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoading(false);
        }
    }, [chapterId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() || !username.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chapterId, content, username }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments([newComment, ...comments]);
                setContent('');
            }
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;

        try {
            const res = await fetch(`/api/comments?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setComments(comments.filter(c => c.id !== id));
            } else {
                alert('Ошибка при удалении');
            }
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    }

    return (
        <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Комментарии ({comments.length})
            </h2>

            <form onSubmit={handleSubmit} className="mb-12 bg-muted/30 p-6 rounded-xl border">
                <div className="grid gap-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Ваше имя
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-xs"
                            placeholder="Представьтесь"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">
                            Сообщение
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Напишите ваш комментарий..."
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting} className="gap-2">
                            <Send className="h-4 w-4" />
                            {submitting ? 'Отправка...' : 'Отправить'}
                        </Button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">Загрузка комментариев...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{comment.username}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Удалить комментарий"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                    Пока нет комментариев. Будьте первым!
                </div>
            )}
        </div>
    );
}
