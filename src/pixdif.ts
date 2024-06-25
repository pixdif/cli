#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs()
	.version('0.1.0')
	.default('config', 'pixdif.config.js')
	.commandDir('cmd')
	.recommendCommands()
	.demandCommand()
	.help();

assert(argv);
