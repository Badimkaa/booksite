'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/Button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
} from 'lucide-react';
import { useCallback } from 'react';

import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageResize,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Начните писать...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn('prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px]', className),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (res.ok) {
                        const { url } = await res.json();
                        if (editor) {
                            editor.chain().focus().setImage({ src: url }).run();
                        }
                    } else {
                        console.error('Upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        };
        input.click();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md bg-background">
            <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/30">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    title="Жирный"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    title="Курсив"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    title="Заголовок 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                    title="Заголовок 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    title="Маркированный список"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    title="Нумерованный список"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    title="Цитата"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                    title="Ссылка"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    title="Изображение"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Отменить"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Повторить"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
