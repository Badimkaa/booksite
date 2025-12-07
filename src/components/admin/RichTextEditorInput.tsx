'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

interface RichTextEditorInputProps {
    name: string;
    label: string;
    defaultValue?: string;
    placeholder?: string;
}

export function RichTextEditorInput({ name, label, defaultValue = '', placeholder }: RichTextEditorInputProps) {
    const [content, setContent] = useState(defaultValue);

    return (
        <div className="grid gap-2">
            <label htmlFor={name} className="font-medium">{label}</label>
            <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder={placeholder}
            />
            <input type="hidden" name={name} value={content} />
        </div>
    );
}
