#!/usr/bin/env node

import "./polyfills";

import * as boxen from "boxen";
import * as chalk from "chalk";
import * as commander from "commander";
import { BitbucketCloudAdapter } from './gitAdapters'
import { JobTransformer } from './jobtranformer'

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
	.requiredOption("-g,--git-provider <git-provider>", "bitbucketCloud")
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
	.option("-p,--password <password>", "password")
	.option("-g,--git-provider <git-provider>", "bitbucketCloud")
	.option("-j,--template <template>", "Name of the template job")
	.option("-P,--project <project>", "Name of the project")
	.option("-r,--repo-slug <repo-slug>", "Name of the repository")
	.option("-i,--pipeline-file <pipeline-file>", "Path of the YAML file.")
	.option("-O,--output-to-console", "Outputs the final YAML in the console")
	.option("-f,--output-folder <output-folder>", "Output folder for the created yaml file")
	.action((opts) => {
		let promise: Promise<any> = BitbucketCloudAdapter.getBranches(opts.project, opts.repoSlug,
			opts.username, opts.password);

		promise.then((branches) => {
			let filePath = opts.pipelineFile;
			let templateName = opts.template;
			let jobtranformer: JobTransformer = new JobTransformer(filePath, templateName);

			let finalPipeline = jobtranformer.generatePipeline(branches);


		});
	});


program.parse(process.argv);
