/**
 * Component to inject JSON-LD structured data into the page
 */
export function StructuredData({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
