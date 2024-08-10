import { IProvider } from "../.script/interfaces";

interface GitcodeProviderArgs {
    repoName: string;
    commit?: string;
}

export default class GitcodeProvider implements IProvider {
    identifier = "gitcode";

    toProviderUrl(
        path: string,
        revision: string,
        { repoName, commit }: GitcodeProviderArgs
    ): string {
        return `https://gitcode.net/${repoName}/-/raw/${
            commit ?? revision ?? "main"
        }/${path}`;
    }
}
