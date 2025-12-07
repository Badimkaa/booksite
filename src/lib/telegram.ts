
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(message: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram credentials not set, skipping notification');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Failed to send Telegram message:', data);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return false;
    }
}
