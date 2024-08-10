import { globStream } from "glob";
import { fileURLToPath, pathToFileURL } from "url";
import { resolve } from "path";
import { readFile, mkdir, writeFile, rm } from "fs/promises";
import { parse } from "yaml";
import type { IProvider, Resolution, ResolutionFile, Rule } from "./interfaces";
import { getFiles } from "./hub";
import { loadCache, saveCache } from "./cache";

const root = resolve(fileURLToPath(import.meta.url), "../..")

async function main() {
    console.log(root);

    await loadCache();

    const providers: Record<string, IProvider> = {};

    const providerFiles = globStream("./providers/*.ts", {
        cwd: root,
        nodir: true,
        posix: true,
    });

    for await (const providerFile of providerFiles) {
        const fileUrl = pathToFileURL(resolve(root, providerFile));
        const provider = await import(fileUrl.toString());
        const instance = new provider.default() as IProvider;
        providers[instance.identifier] = instance;
    }

    await rm(resolve(root, "dist"), { recursive: true, force: true });
    await mkdir(resolve(root, "dist"));

    const rules = globStream("./rules/**/*.yaml", {
        cwd: root,
        nodir: true,
        posix: true,
    });

    for await (const rule of rules) {
        const repoId = rule.slice(6, -5);
        // console.log(repoId);
        const content = await readFile(resolve(root, rule), "utf-8");
        const parsed = parse(content) as Rule;
        await mkdir(resolve(root, "dist", repoId), {
            recursive: true,
        });
        
        for (const revision of parsed.revisions) {
            const files: ResolutionFile[] = []
            const filename = resolve(root, `dist/${repoId}/${revision}.json`);
            const hubFiles = await getFiles(repoId, revision);
            for (const file of hubFiles) {
                const resources: string[] = [];
                for (const destination of parsed.destination) {
                    const provider = providers[destination.provider];
                    if (!provider) {
                        throw new Error(`Provider ${destination.provider} not found`);
                    }
                    resources.push(provider.toProviderUrl(file.filename, revision, destination.args));
                }
                files.push({
                    ...file,
                    resources,
                });
            }
            
            await writeFile(filename, JSON.stringify(files));
        }

    }

    await saveCache();
}

main();
