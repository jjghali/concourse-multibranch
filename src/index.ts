#!/usr/bin/env node

import "./polyfills";

import * as boxen from "boxen";
import * as chalk from "chalk";
import * as commander from "commander";
import { BitbucketCloudAdapter } from './gitAdapters'
import { JobTransformer } from './jobtranformer'

const ora = require('ora');
const YAML = require('yaml')
const fs = require('fs');

const program = new commander.Command();

program
	.storeOptionsAsProperties(false) // <--- change behaviour
	.passCommandToAction(false); // <--- change behaviour


program.version("1.0.0").description("Concourse Multibranch generator");

program.command("hello-world")
	.description("Helloworld")
	.action(() => {
		console.log(chalk.yellow("=========*** Hello world! ***=========="));
	});

program.command("config").action(() => {

});

program.command("branch-available")
	.alias('ba')
	.description("Show all the available branches in bitbucket")
	.requiredOption(
		"-u,--username <username>",
		"username",
	)
	.requiredOption("-p,--password <password>", "password")
	.option("-g,--git-provider <git-provider>", "bitbucketCloud")
	.requiredOption("-P,--project <project>", "project name")
	.requiredOption("-r,--repo-slug <repo-slug>", "Name of the repository")
	.action((opts) => {

		let promise: Promise<any> = BitbucketCloudAdapter.getBranches(opts.project, opts.repoSlug,
			opts.username, opts.password);

		promise.then((branches) => {
			branches.forEach((b: string) => {
				console.log(b)
			});
		});

	});

program
	.command("generate-pipelines")
	.alias('gp')
	.description("Generate pipelines")
	.option(
		"-u,--username <username>",
		"username",
	)
	.requiredOption("-p,--password <password>", "password")
	.requiredOption("-j,--template <template>", "Name of the template job")
	.requiredOption("-P,--project <project>", "Name of the project")
	.requiredOption("-r,--repo-slug <repo-slug>", "Name of the repository")
	.requiredOption("-i,--pipeline-file <pipeline-file>", "Path of the YAML file.")
	.option("-O,--output-to-console", "Outputs the final YAML in the console")
	.option("-q,--quiet", "No output on console")
	.option("-f,--output-filename <output-filename>", "Output filename for the created yaml file")
	.action((opts) => {
		let promise: Promise<any> = BitbucketCloudAdapter.getBranches(opts.project, opts.repoSlug,
			opts.username, opts.password);

		promise.then((branches) => {



			let filePath = opts.pipelineFile;
			let templateName = opts.template;
			let jobtranformer: JobTransformer = new JobTransformer(filePath, templateName);

			let finalPipeline = jobtranformer.generatePipeline(branches);
			let yamlPipeline = '---\n' + YAML.stringify(finalPipeline);

			if (opts.outputToConsole && !opts.quiet) {
				console.log(yamlPipeline);
			}

			if (opts.outputFilename) {
				fs.writeFile(opts.outputFilename, yamlPipeline, (err: any) => {
					if (err) {
						return console.log(err);
					}
					if (!opts.quiet)
						console.log("New pipeline can be found in " + chalk.blue(opts.outputFilename));
				});
			}

		});
	});


program.parse(process.argv);
