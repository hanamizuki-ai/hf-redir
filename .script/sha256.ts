import { createHash } from "crypto";

export async function getSha256FromResponse(res: Response) {
    const reader = res.body?.getReader();

    if (!reader) {
        throw new Error("Failed to get reader from response body");
    }

    const hash = createHash("sha256");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) {
            throw new Error("Failed to get value from reader");
        }
        hash.update(value);
    }

    return hash.digest("hex");
}
