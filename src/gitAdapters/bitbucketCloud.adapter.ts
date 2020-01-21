import axios from "axios";
import * as chalk from "chalk";

import { IGitAdapter } from "./igit.adapter";
class BitbucketCloudAdapter {
  private static BITBUCKET_API: string = "https://api.bitbucket.org/2.0";

  public static getBranches(
    project: string,
    repoSlug: string,
    username: any,
    password: any
  ): Promise<any> {
    let bbCredentials: any = {
      username: process.env.BITBUCKET_USERNAME,
      password: process.env.BITBUCKET_PASSWORD
    };

    const endpoint: string =
      "/repositories/" + project + "/" + repoSlug + "/refs/branches";
    const urlAPI: string = this.BITBUCKET_API + endpoint;
    return axios({
      method: "get",
      url: urlAPI,
      auth: bbCredentials
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
