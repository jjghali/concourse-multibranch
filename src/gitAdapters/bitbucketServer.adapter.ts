import axios from "axios";
import * as chalk from "chalk";

import { IGitAdapter } from "./igit.adapter";
class BitbucketCloudAdapter {
  private static BITBUCKET_ENDPOINT: string = "/rest/branch-utils/1.0";

  public static getBranches(
    gitDomain: string,
    project: string,
    repoSlug: string,
    username: any,
    password: any
  ): Promise<any> {
    const endpoint: string =
      "/projects/" + project + "/repos/" + repoSlug + "/branches";
    const urlAPI: string = gitDomain + this.BITBUCKET_ENDPOINT + endpoint;
    return axios({
      method: "get",
      url: urlAPI,
      auth: { username, password }
    }).then(res => {
      let branches: Array<string> = new Array<string>();
      res.data.values.forEach((val: any) => {
        branches.push(val.name);
      });
      return branches;
    });
  }
}

export { BitbucketCloudAdapter };
