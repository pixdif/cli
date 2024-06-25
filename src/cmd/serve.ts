import { Argv } from 'yargs';
import type { Server } from 'http';

import { ServerOptions, serve } from '../api/index.js';

interface Arguments extends ServerOptions {
	/**
	 * Port number of the server.
	 */
	port: number;
}

export const command = 'serve';
export const describe = 'Start a server to show reports and manage baselines.';

export function builder(argv: Argv): Argv {
	return argv.options({
		dataDir: {
			type: 'string',
			describe: 'The directory to save baselines and other data.',
			default: 'data',
		},
		outputDir: {
			type: 'string',
			describe: 'The directory of all test reports.',
			default: 'output',
		},
		port: {
			type: 'number',
			describe: 'Port number of the server.',
			default: 20190,
		},
	});
}

export function handler(options: Arguments): Server {
	const app = serve(options);
	const server = app.listen(options.port);
	console.log(`Listening at ${options.port}`);
	return server;
}
