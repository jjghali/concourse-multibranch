#!/usr/bin/env node

import './polyfills';

import * as boxen from 'boxen';
import * as chalk from 'chalk';
import * as commander from 'commander';

commander.version('1.0.0').description('Concourse Multibranch generator');

commander.command('hello-world').description('Helloworld').action(() => {
	console.log(chalk.yellow('=========*** Hello world! ***=========='));
});

if (!process.argv.slice(2).length /* || !/[arudl]/.test(process.argv.slice(2))*/) {
	commander.outputHelp();
	process.exit();
}
commander.parse(process.argv);
