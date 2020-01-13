import type { IGitAdapter } from "./igit.adapter";

class GithubAdapter implements IGitAdapter {
    public getBranches(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

export GithubAdapter;
