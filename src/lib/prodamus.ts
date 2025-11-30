import { createHmac } from 'crypto';

export function createProdamusSignature(data: Record<string, unknown>, secretKey: string): string {
    // 1. Sort keys recursively
    const sortedData = sortObjectKeys(data);

    // 2. Convert to JSON (no spaces, ensure ASCII is false)
    // IMPORTANT: PHP json_encode escapes slashes by default (e.g. "/" -> "\/").
    // JS JSON.stringify does not. We must emulate PHP behavior for the signature to match.
    const jsonString = JSON.stringify(sortedData).replace(/\//g, '\\/');

    // 3. Sign
    const hmac = createHmac('sha256', secretKey);
    hmac.update(jsonString);
    return hmac.digest('hex');
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function sortObjectKeys(obj: unknown): JsonValue {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj as { [key: string]: unknown })
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObjectKeys((obj as { [key: string]: unknown })[key]);
                return acc;
            }, {} as { [key: string]: JsonValue });
    }
    return obj as JsonValue;
}

export function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
        const pre = prefix.length ? `${prefix}[${k}]` : k;
        const val = obj[k];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            Object.assign(acc, flattenObject(val as Record<string, unknown>, pre));
        } else if (Array.isArray(val)) {
            val.forEach((v: unknown, i: number) => {
                Object.assign(acc, flattenObject({ [i]: v } as Record<string, unknown>, pre));
            });
        } else {
            acc[pre] = String(val);
        }
        return acc;
    }, {});
}

export function parseProdamusBody(body: string): JsonValue {
    const params = new URLSearchParams(body);
    const data: { [key: string]: unknown } = {};

    params.forEach((value, key) => {
        const parts = key.split('[').map(p => p.replace(']', ''));
        let current: { [key: string]: unknown } = data;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (isLast) {
                current[part] = value;
            } else {
                const nextPart = parts[i + 1];
                const isIndex = /^\d+$/.test(nextPart);

                if (!current[part]) {
                    current[part] = isIndex ? [] : {};
                }
                current = current[part] as { [key: string]: unknown };
            }
        }
    });

    return convertNumericKeysToArrays(data);
}

export function convertNumericKeysToArrays(obj: unknown): JsonValue {
    if (typeof obj !== 'object' || obj === null) {
        return obj as JsonValue;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertNumericKeysToArrays);
    }

    const keys = Object.keys(obj as { [key: string]: unknown });
    const isArrayLike = keys.length > 0 && keys.every(k => /^\d+$/.test(k));

    if (isArrayLike) {
        const arr: JsonValue[] = [];
        for (const key of keys.sort((a, b) => parseInt(a) - parseInt(b))) {
            arr.push(convertNumericKeysToArrays((obj as { [key: string]: unknown })[key]));
        }
        return arr;
    }

    const newObj: { [key: string]: JsonValue } = {};
    for (const key of keys) {
        newObj[key] = convertNumericKeysToArrays((obj as { [key: string]: unknown })[key]);
    }

    return newObj;
}
