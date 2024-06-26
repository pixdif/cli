#!/usr/bin/env node
import yargs from 'yargs';
import assert from 'assert';

const { argv } = yargs(process.argv.slice(2))
	.version('0.1.0')
	.default('config', 'pixdif.config.js')
	.command(await import('./cmd/cmp.js'))
	.command(await import('./cmd/convert.js'))
	.command(await import('./cmd/diff.js'))
	.command(await import('./cmd/serve.js'))
	.recommendCommands()
	.demandCommand()
	.help();

assert(argv);
