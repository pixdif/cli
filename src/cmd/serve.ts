import { Argv } from 'yargs';
import express from 'express';

import apiMap from '../api';

interface Arguments {
	dataDir: string;
	reportDir: string;
	port: number;
}

export const command = 'serve';
export const describe = 'Start a server to show reports and manage baselines.';

export function builder(argv: Argv): Argv {
	return argv.options({
		dataDir: {
			type: 'string',
			describe: 'Data directory to save baselines and other data.',
			default: 'data',
		},
		reportDir: {
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

export async function handler({
	dataDir,
	reportDir,
	port,
}: Arguments): Promise<void> {
	const server = express();
	server.use(`/${dataDir}`, express.static(dataDir));
	server.use(`/${reportDir}`, express.static(reportDir));
	for (const [contextPath, api] of apiMap) {
		server.use(`/api/${contextPath}`, api);
	}
	server.listen(port);

	console.log(`Listening at ${port}`);
}
