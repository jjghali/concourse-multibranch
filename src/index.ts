#!/usr/bin/env node

import "./polyfills";

import * as boxen from "boxen";
import * as chalk from "chalk";
import * as cmdr from "commander";

cmdr.version("1.0.0").description("Concourse Multibranch generator");

cmdr.command("hello-world").description("Helloworld").action(() => {
	console.log(chalk.yellow("=========*** Hello world! ***=========="));
});

cmdr.command("bitbucket-login").action(() => {
	console.log("transform here");
});
cmdr.command("branch-available")
	.action(() => {
		console.log("transform here");
	});

cmdr
	.command("generate-jobs")
	.option(
		"-l",
		"--bitbucket-login <credentials>",
		"Bitbucket credentials. It must me in this format: username:password.",
	)
	.option("-j", "--job-template <job-name>", "Name of the template job")
	.option("-P", "--project-name <project-name>", "Name of the project")
	.option("-r", "--repo-slug", "Name of the repository")
	.option("-i", "--pipeline-file", "Path of the YAML file.")
	.option("-I", "--input-folder", "Path of the folder containing YAML files.")
	.option("-O", "--output-to-console", "Outputs the final YAML in the console")
	.option("-f", "--output-folder", "Output folder for the created yaml file")
	.action(() => {
		console.log("transform here");
	});

// cmdr.if(!process.argv.slice(2).length /* || !/[arudl]/.test(process.argv.slice(2))*/);
// {
// 	cmdr.outputHelp();
// 	process.exit();
// }

cmdr.parse(process.argv);
