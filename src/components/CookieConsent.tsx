"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user has already consented
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    if (!isMounted) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-500 ease-in-out",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
        >
            <div className="mx-auto max-w-screen-xl">
                <div className="relative flex flex-col items-center justify-between gap-4 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:flex-row sm:px-6">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                        <p>
                            Мы используем файлы cookie для работы сайта. Продолжая использовать сайт, вы соглашаетесь с этим.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleAccept} size="sm" className="whitespace-nowrap">
                            Понятно
                        </Button>
                    </div>
                    <button
                        onClick={handleAccept}
                        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary sm:hidden"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Закрыть</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
