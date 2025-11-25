import { useEffect } from 'react';

export function useNavigationBlocker(isDirty: boolean) {
    useEffect(() => {
        if (!isDirty) return;

        // Use hash to intercept back button
        if (window.location.hash !== '#unsaved') {
            window.location.hash = 'unsaved';
        }

        const handleHashChange = () => {
            if (window.location.hash !== '#unsaved') {
                if (confirm('У вас есть несохраненные изменения. Вы уверены, что хотите уйти?')) {
                    // Allow navigation (we are already at the previous state in history)
                    // We need to go back one more time to actually leave the page if we were at the "guard" state
                    // But since the user pressed back to remove the hash, they are now at the "clean" URL.
                    // To leave the page, they need to go back again.
                    // We can automate this:
                    window.history.back();
                } else {
                    // Restore guard
                    window.location.hash = 'unsaved';
                }
            }
        };

        // Handle internal links
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && !anchor.target && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                const isInternal = anchor.href.startsWith(window.location.origin);
                if (isInternal) {
                    if (!confirm('У вас есть несохраненные изменения. Вы уверены, что хотите уйти?')) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('click', handleClick, true);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('click', handleClick, true);
        };
    }, [isDirty]);
}
