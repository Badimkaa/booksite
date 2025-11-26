

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-full bg-muted/10 p-6">
            {children}
        </div>
    );
}
