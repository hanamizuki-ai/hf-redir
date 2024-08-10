import { downloadFile, listFiles } from "@huggingface/hub";
import { HF_TOKEN } from "./env";
import { getSha256FromResponse } from "./sha256";
import { getCache, setCache } from "./cache";

interface HubFileMetadata {
    filename: string;
    size: number;
    sha256: string;
}

export async function getFiles(repoId: string, revision: string) {
    const files: HubFileMetadata[] = [];
    const remoteFiles = listFiles({
        repo: repoId,
        revision,
        recursive: true,
        credentials: { accessToken: HF_TOKEN },
    });
    for await (const file of remoteFiles) {
        let sha256 = file.lfs?.oid;

        if (!sha256) {
            const cached = getCache(file.oid);
            if (cached) {
                sha256 = cached;
            } else {
                const response = await downloadFile({
                    repo: repoId,
                    revision,
                    path: file.path,
                    credentials: { accessToken: HF_TOKEN },
                });

                if (!response) {
                    throw new Error(`Failed to download file ${file.path}`);
                }

                sha256 = await getSha256FromResponse(response);
                setCache(file.oid, sha256);
            }
        }

        files.push({
            filename: file.path,
            size: file.size,
            sha256,
        });
    }
    return files;
}
