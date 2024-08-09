export interface IProvider {
    identifier: string;
    toProviderUrl(path: string, revision: string, args: unknown): string;
}

export interface GlobalArgs {
    whitelist?: string[];
    blacklist?: string[];
}
