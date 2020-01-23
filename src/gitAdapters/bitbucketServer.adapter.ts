import axios from "axios";
import * as chalk from "chalk";

import { IGitAdapter } from "./igit.adapter";
class BitbucketServerAdapter {
  private static BITBUCKET_ENDPOINT: string = "/rest/api/1.0";

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
      auth: { username: username, password: password },
      headers: { "Content-type": "application/json" }
    })
      .then(res => {
        let branches: Array<string> = new Array<string>();
        if (gitDomain != null) {
          res.data.values.forEach((val: any) => {
            branches.push(val.displayId);
          });

          return branches;
        }
        return [];
      })
      .catch((err: any) => {
        if (gitDomain == null)
          console.log(chalk.redBright("[Error] Git Url is missing."));
        else console.error(err);
      });
  }
}

export { BitbucketServerAdapter };
