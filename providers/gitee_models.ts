import { IProvider } from "../.script/interfaces";

interface GiteeModelProviderArgs {
    repoName: string;
    commit?: string;
}

export default class GiteeModelProvider implements IProvider {
    identifier = "gitee_models";

    toProviderUrl(
        path: string,
        revision: string,
        { repoName, commit }: GiteeModelProviderArgs
    ): string {
        return `https://gitee.com/hf-models/${repoName}/raw/${
            commit ?? revision ?? "main"
        }/${path}`;
    }
}
