#!/usr/bin/env node

import "./polyfills";

import * as boxen from "boxen";
import * as chalk from "chalk";
import * as commander from "commander";
const program = new commander.Command();

program
	.storeOptionsAsProperties(false) // <--- change behaviour
	.passCommandToAction(false); // <--- change behaviour


program.version("1.0.0").description("Concourse Multibranch generator");

program.command("hello-world").description("Helloworld").action(() => {
	console.log(chalk.yellow("=========*** Hello world! ***=========="));
});

program.command("bitbucket-login").alias('bl')
	.option(
		"-l <credentials>",
		"--credentials <credentials>",
		"Bitbucket credentials. It must me in this format: username:password.",
	)
	.action((options) => {
		console.log("testoptions")
		console.log(options.credentials);
		console.log(options.l);
	});

program.command("branch-available")
	.action(() => {
		console.log("transform here");
	});

program
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


program.parse(process.argv);
