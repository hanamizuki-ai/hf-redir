import { IProvider } from "../.script/interfaces";

interface ModelscopeProviderArgs {
    repoName: string;
    commit?: string;
}

export class ModelscopeProvider implements IProvider {
    identifier = "modelscope";

    toProviderUrl(
        path: string,
        revision: string,
        { repoName, commit }: ModelscopeProviderArgs
    ): string {
        return `https://modelscope.cn/models/${repoName}/resolve/${
            commit ?? revision ?? "main"
        }/${path}`;
    }
}
