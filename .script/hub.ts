import { listFiles } from "@huggingface/hub";
import { HF_TOKEN } from "./env";

export async function getMetadata(repoId: string, revision: string) {
    const files = [];
    const remoteFiles = listFiles({ repo: repoId, revision, recursive: true, credentials: { accessToken: HF_TOKEN } });
    for await (const file of remoteFiles) {
        files.push({
            filename: file.path,
            size: file.size,
            sha256: file.lfs?.oid,
        });
    }
}
