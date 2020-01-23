#!/usr/bin/env node

import "./polyfills";

import * as chalk from "chalk";
import * as commander from "commander";
import { BitbucketCloudAdapter, BitbucketServerAdapter } from "./gitAdapters";
import { JobTransformer } from "./jobtranformer";
import { resolve } from "dns";

const dotenv = require("dotenv");
const YAML = require("yaml");
const fs = require("fs");

const program = new commander.Command();

dotenv.config();

program
  .storeOptionsAsProperties(false) // <--- change behaviour
  .passCommandToAction(false); // <--- change behaviour

program
  .version("1.0.0")
  .description(chalk.yellow("Concourse Multibranch generator"));

program
  .command("config")
  .alias("cfg")
  .description("Configures the app (NYI)")
  .action(() => {});

program
  .command("branch-available")
  .alias("ba")
  .description("Show all the available branches in bitbucket")
  .option("-u,--username <username>", "username")
  .option("-p,--password <password>", "password")
  .option("-g,--git-provider <provider>", "bitbucketServer")
  .option("--git-url <url>", "")
  .option("-q,--quiet", "No output on console")
  .requiredOption("-P,--project <project>", "project name")
  .requiredOption("-r,--repo-slug <repo-slug>", "Name of the repository")
  .action((opts: any) => {
    new Promise((resolve, reject) => {
      let bbCredentials: any;

      if (opts.username == null && opts.password == null && !opts.quiet) {
        console.log(
          chalk.magenta(
            "[Info] No credentials specified in the arguments. BITBUCKET_USERNAME AND BITBUCKET_PASSWORD will be used instead."
          )
        );
        bbCredentials = {
          username: process.env.BITBUCKET_USERNAME,
          password: process.env.BITBUCKET_PASSWORD
        };
      } else {
        bbCredentials = {
          username: opts.username,
          password: opts.password
        };
      }

      if (opts.gitProvider == null && !opts.quiet) {
        console.log(
          chalk.magenta(
            "[Info] No Git provider was specified in the arguments.Bitbucket Server will be used by default."
          )
        );
      }

      resolve(bbCredentials);
    }).then((bbCredentials: any) => {
      let promise: any;

      switch (opts.gitProvider) {
        case "bitbucketCloud":
          promise = BitbucketCloudAdapter.getBranches(
            opts.project,
            opts.repoSlug,
            bbCredentials.username,
            bbCredentials.password
          );
          break;
        case "bitbucketServer":
        default:
          promise = BitbucketServerAdapter.getBranches(
            opts.gitUrl,
            opts.project,
            opts.repoSlug,
            bbCredentials.username,
            bbCredentials.password
          );
          break;
        case "github":
          console.log("not yet implemented");
          break;
      }

      promise.then((branches: any) => {
        if (branches) {
          branches.forEach((b: string) => {
            console.log(b);
          });
        }
      });
    });
  });

program
  .command("generate-pipelines")
  .alias("gp")
  .description("Generate pipelines")
  .option("-g,--git-provider <provider>", "bitbucketServer")
  .option("--git-url <url>", "")
  .option("-u,--username <username>", "username")
  .option("-p,--password <password>", "password")
  .option("-j,--template <template>", "Name of the template job")
  .option("-P,--project <project>", "Name of the project")
  .option("-r,--repo-slug <repo-slug>", "Name of the repository")
  .option("-i,--pipeline-file <pipeline-file>", "Path of the YAML file.")
  .option("-O,--output-to-console", "Outputs the final YAML in the console")
  .option("-q,--quiet", "No output on console")
  .option(
    "-f,--output-filename <output-filename>",
    "Output filename for the created yaml file"
  )
  .action((opts: any) => {
    if (opts.username == "" && opts.password == "" && !opts.quiet) {
      console.log(
        chalk.magenta(
          "[Info] No credentials specified in the arguments. We will use the credentials in BITBUCKET_USERNAME AND BITBUCKET_PASSWORD"
        )
      );
    }

    if (opts.gitProvider == null && !opts.quiet) {
      console.log(
        chalk.magenta(
          "[Info] No Git provider was specified in the arguments.Bitbucket Server will be used by default."
        )
      );
    }

    let promise: any;

    switch (opts.gitProvider) {
      case "bitbucketCloud":
        promise = BitbucketCloudAdapter.getBranches(
          opts.project,
          opts.repoSlug,
          opts.username,
          opts.password
        );

      case "bitbucketServer":
        promise = BitbucketServerAdapter.getBranches(
          opts.gitUrl,
          opts.project,
          opts.repoSlug,
          opts.username,
          opts.password
        );

      case "github":
        console.log("not yet implemented");
    }

    promise.then((branches: any) => {
      let filePath = opts.pipelineFile;
      let templateName = opts.template;
      let jobtranformer: JobTransformer = new JobTransformer(
        filePath,
        templateName
      );

      let finalPipeline = jobtranformer.generatePipeline(branches);
      let yamlPipeline = "---\n" + YAML.stringify(finalPipeline);

      if (opts.outputToConsole && !opts.quiet) {
        console.log(yamlPipeline);
      }

      if (opts.outputFilename) {
        fs.writeFile(opts.outputFilename, yamlPipeline, (err: any) => {
          if (err) {
            return console.log(err);
          }
          if (!opts.quiet)
            console.log(
              "New pipeline can be found in " + chalk.blue(opts.outputFilename)
            );
        });
      }
    });
  });

program.parse(process.argv);
