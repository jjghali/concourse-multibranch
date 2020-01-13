import axios from "axios";

import type { IGitAdapter } from "./igit.adapter";
class BitbucketAdapter implements IGitAdapter {

    private BITBUCKET_API: string = "https://api.bitbucket.org/2.0";

    public getBranches(project: string, repoSlug: string, username: string, password: string): Promise<any> {
        const endpoint: string = "/repositories/" + project + "/" + repoSlug + "/refs/branches";
        const urlAPI: string = this.BITBUCKET_API + endpoint;
        return axios({
            method: "get",
            url: urlAPI,
            auth: {
                username,
                password,
            },
        }).then((res) => {
        });

    }

}

export { BitbucketAdapter };
