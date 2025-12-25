/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = '1ZNlkMRc8e5dezGpsYAceXdfMbW9YlqXE6G6FMv2jF0A';
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

async function setHeaders() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const headers = [
            'Дата',
            'Состояние (Слово)',
            'Тело говорит',
            'Чувство',
            'Этап Бабочки',
            'Отношения',
            'Поддержка рода',
            'Нужна поддержка',
            'Формат',
            'Контакт',
            'Личное сообщение',
            'Telegram'
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A1:L1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [headers],
            },
        });

        console.log('Headers set successfully!');
    } catch (error) {
        console.error('Error setting headers:', error);
    }
}

setHeaders();
