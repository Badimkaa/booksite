import * as fs from 'fs/promises';
import * as jose from 'jose';
import path from 'path';

const SPREADSHEET_ID = '1ZNlkMRc8e5dezGpsYAceXdfMbW9YlqXE6G6FMv2jF0A';
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

interface ServiceAccount {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
}

async function getAccessToken(): Promise<string> {
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
    const credentials = JSON.parse(credentialsContent) as ServiceAccount;

    const alg = 'RS256';
    const privateKey = await jose.importPKCS8(credentials.private_key, alg);

    const jwt = await new jose.SignJWT({
        scope: 'https://www.googleapis.com/auth/spreadsheets',
    })
        .setProtectedHeader({ alg, kid: credentials.private_key_id })
        .setIssuer(credentials.client_email)
        .setAudience(credentials.token_uri)
        .setSubject(credentials.client_email)
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

    const response = await fetch(credentials.token_uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    const { access_token } = await response.json();
    if (!access_token) {
        throw new Error('Failed to retrieve access token');
    }
    return access_token;
}

export async function appendToSheet(data: any) {
    try {
        const accessToken = await getAccessToken();

        const row = [
            new Date().toLocaleString('ru-RU'),
            data.stateOneWord,
            data.bodyMessage.join(', '),
            data.mainFeeling.join(', '),
            data.butterflyStage,
            data.relations,
            data.familySupport || '-',
            data.supportNeeded.join(', '),
            data.preferredFormat.join(', '),
            data.contactLevel.join(', '),
            data.personalMessage || '-',
            data.telegram || '-',
        ];

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A1:append?valueInputOption=USER_ENTERED`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    values: [row],
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Google Sheets API Error:', error);
        }
    } catch (error) {
        console.error('Error appending to sheet:', error);
    }
}
