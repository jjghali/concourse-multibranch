import axios from "axios";

import { IGitAdapter } from "./igit.adapter";
class BitbucketCloudAdapter {

    private BITBUCKET_API: string = "https://api.bitbucket.org/2.0";

    public getBranches(project: string, repoSlug: string, username: string, password: string): void {
        const endpoint: string = "/repositories/" + project + "/" + repoSlug + "/refs/branches";
        const urlAPI: string = this.BITBUCKET_API + endpoint;
        axios({
            method: "get",
            url: urlAPI,
            auth: {
                username,
                password,
            },
        }).then((res) => {
            console.log(res);
        });


    }

}

export { BitbucketCloudAdapter };
