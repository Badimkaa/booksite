'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function QuestionnaireEmbed() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full max-w-4xl mx-auto my-12 space-y-8">
            <div className="text-center space-y-4 px-4">
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Пройди диагностику состояния (10-15 минут), чтобы получить от меня персональный вектор:
                    какая практика, медитация или формат работы станут твоей опорой именно сейчас.
                </p>
            </div>

            <div className="relative w-full min-h-[600px] bg-muted/30 rounded-xl overflow-hidden border shadow-sm">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdDbjm8Pdh76DG_867UsxXQMLoz2A6KmPrMonPbRA3DxmQ0pg/viewform?embedded=true"
                    width="640"
                    height="1488"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full h-[800px] md:h-[1000px]"
                    onLoad={() => setIsLoading(false)}
                >
                    Загрузка…
                </iframe>
            </div>
        </div>
    );
}
