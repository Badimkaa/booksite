
/**
 * Utilities for handling Moscow Time (Europe/Moscow) without external dependencies.
 * We rely on native Intl.DateTimeFormat to perform conversions.
 */

const MOSCOW_TIMEZONE = 'Europe/Moscow';

/**
 * Parses a date string (e.g. from input type="datetime-local" or just a string representation)
 * treating it as if it represents a time in Moscow, and returns the corresponding UTC Date object.
 * 
 * Example: Input "2023-01-01T12:00" -> Returns Date object that is 12:00 MSK (09:00 UTC)
 */
export function fromMoscowISOString(dateString: string): Date {
    if (!dateString) return new Date();

    // 1. Parse the input string components
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];

    // 2. Create a date object in current environment's timezone first (just as a container)
    // We will use it to find the offset for Moscow
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    // 3. Find out what time it is in Moscow for this specific UTC time
    // We iterate to find the correct offset because offset can change (DST - though not currently in Russia)
    // A simpler approach for modern Russia (UTC+3 fixed):
    // return new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);

    // Robust approach using Intl:
    // We need to find a UTC timestamp X such that X formatted in Moscow is equal to our target components.
    // Since Moscow is consistently UTC+3 now, we can hardcode the offset for simplicity and performance,
    // but let's stick to a slightly more robust method if possible, or just use the fixed offset for now 
    // given the user requirement "Moscow time" which is currently fixed.

    // Current Moscow Standard Time is UTC+3.
    // Let's rely on the fixed offset to keep it very simple and "native dependency-free" without complex bisecting.
    const MOSCOW_OFFSET_HOURS = 3;
    return new Date(utcDate.getTime() - MOSCOW_OFFSET_HOURS * 60 * 60 * 1000);
}

/**
 * Returns a string suitable for <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
 * representing the given Date object in Moscow time.
 */
export function toMoscowISOString(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';

    // Use Intl to format parts in Moscow time
    const formatter = new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
        timeZone: MOSCOW_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // Format: 2023-12-31, 23:59
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;

    return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`;
}



/**
 * Formats a date for display in Local time (e.g. "25.12.2023, 19:00")
 */
export function formatLocalDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Returns just the day/month part in Local time
 */
export function formatLocalDayMonth(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('ru-RU', {
        month: 'short',
        day: 'numeric'
    }).format(date);
}

/**
 * Returns just the day number in Local time
 */
export function getLocalDay(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric' }).format(date);
}

/**
 * Returns the time part in Local time
 */
export function formatLocalTime(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Returns the weekday in Local time
 */
export function formatLocalWeekday(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long'
    }).format(date);
}
