export interface IProvider {
    identifier: string;
    toProviderUrl(path: string, revision: string, args: unknown): string;
}

export interface GlobalArgs {
    whitelist?: string[];
    blacklist?: string[];
}

export interface RuleDestination {
    provider: string;
    args: unknown;
}

export interface Rule {
    revisions: string[]
    destination: RuleDestination[];
}

export interface ResolutionFile {
    filename: string;
    size: number;
    sha256: string;
    resources: string[];
}

export interface Resolution {
    [key: string]: ResolutionFile[];
}
