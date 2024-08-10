import { IProvider } from "../.script/interfaces";

interface ModeleeProviderArgs {
    repoName: string;
    commit?: string;
}

export default class ModeleeProvider implements IProvider {
    identifier = "modelee";

    toProviderUrl(
        path: string,
        revision: string,
        { repoName, commit }: ModeleeProviderArgs
    ): string {
        return `https://gitee.com/modelee/${repoName}/raw/${
            commit ?? revision ?? "main"
        }/${path}`;
    }
}
