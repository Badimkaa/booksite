import { createHmac } from 'crypto';

export function createProdamusSignature(data: any, secretKey: string): string {
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

export function sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObjectKeys(obj[key]);
                return acc;
            }, {} as any);
    }
    return obj;
}

export function flattenObject(obj: any, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? `${prefix}[${k}]` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre));
        } else if (Array.isArray(obj[k])) {
            obj[k].forEach((v: any, i: number) => {
                Object.assign(acc, flattenObject(v, `${pre}[${i}]`));
            });
        } else {
            acc[pre] = obj[k];
        }
        return acc;
    }, {});
}

export function parseProdamusBody(body: string): any {
    const params = new URLSearchParams(body);
    const data: any = {};

    params.forEach((value, key) => {
        // Handle nested keys like products[0][name]
        const parts = key.split('[').map(p => p.replace(']', ''));
        let current = data;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (isLast) {
                current[part] = value;
            } else {
                const nextPart = parts[i + 1];
                // Check if next part is an index (integer)
                const isIndex = /^\d+$/.test(nextPart);

                if (!current[part]) {
                    current[part] = isIndex ? [] : {};
                }

                // If we are accessing an array index, ensure the array is large enough?
                // Or just treat it as an object for now and convert to array later?
                // PHP treats arrays and dicts similarly.
                // But for JSON signature, arrays must be arrays.

                current = current[part];
            }
        }
    });

    // Post-process to convert objects with numeric keys to arrays?
    // Prodamus PHP SDK likely parses `products[0][name]` into an array.
    // My `sortObjectKeys` handles arrays.
    // But `data` constructed above might have objects with numeric keys instead of arrays.
    // Let's implement a recursive fix.
    return convertNumericKeysToArrays(data);
}

function convertNumericKeysToArrays(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // Check if object keys are all numeric and sequential starting from 0?
    // Or just numeric?
    // PHP arrays are ordered maps.
    // If keys are "0", "1", "2"... it should be an array.
    const keys = Object.keys(obj);
    const isArrayLike = keys.length > 0 && keys.every(k => /^\d+$/.test(k));

    if (isArrayLike) {
        // Convert to array
        const arr = [];
        for (const key of keys) {
            arr[parseInt(key)] = convertNumericKeysToArrays(obj[key]);
        }
        // Filter out empty slots if any? No, PHP arrays can be sparse but usually aren't here.
        // But `arr` will be a sparse array if keys are not sequential.
        // Let's assume sequential for Prodamus products.
        // Actually, `Object.values` might be safer if we don't care about index order matching exactly if they are sorted.
        // But `products[0]` implies index 0.
        return arr;
    }

    // Recursively convert children
    for (const key of keys) {
        obj[key] = convertNumericKeysToArrays(obj[key]);
    }

    return obj;
}
