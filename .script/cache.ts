import { readFile, writeFile } from "fs/promises";

const cache: Record<string, string> = {}

export function getCache(key: string): string | undefined {
    return cache[key];
}

export function setCache(key: string, value: string): void {
    cache[key] = value;
}

export function clearCache(): void {
    for (const key in cache) {
        delete cache[key];
    }
}

export function deleteCache(key: string): void {
    delete cache[key];
}

export async function loadCache() {
    try {
        const data = await readFile(".script/cache.json", "utf-8");
        const parsed = JSON.parse(data);
        for (const key in parsed) {
            cache[key] = parsed[key];
        }
    } catch (e) {
    }
}

export async function saveCache() {
    try {
        await writeFile(".script/cache.json", JSON.stringify(cache), "utf-8");
    } catch (e) {
        console.error(e);
    }
}
