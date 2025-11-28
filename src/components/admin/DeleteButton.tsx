'use client';

import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
    onDelete: () => Promise<void>;
    label?: string;
}

export function DeleteButton({ onDelete, label = 'Удалить' }: DeleteButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isConfirming) {
            setIsDeleting(true);
            try {
                await onDelete();
            } catch (error) {
                console.error('Failed to delete:', error);
                setIsDeleting(false);
                setIsConfirming(false);
            }
        } else {
            setIsConfirming(true);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isConfirming ? (
                <>
                    <span className="text-sm text-destructive font-medium">Вы уверены?</span>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Да, удалить'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsConfirming(false)}
                        disabled={isDeleting}
                    >
                        Отмена
                    </Button>
                </>
            ) : (
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    {label}
                </Button>
            )}
        </div>
    );
}
