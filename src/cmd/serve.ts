import { Argv } from 'yargs';
import express from 'express';

interface Arguments {
	baselineDir: string;
	host: string;
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
		host: {
			type: 'string',
			describe: 'Hostname of the server.',
			default: 'localhost',
		},
		port: {
			type: 'number',
			describe: 'Port number of the server.',
			default: 20190,
		},
	});
}

export async function handler(args: Arguments): Promise<void> {
	const server = express();
	server.use(express.static('.'));
	server.listen(args.port, args.host);

	if (!args.host) {
		console.log(`Listening at ${args.port}`);
	} else {
		console.log(`Listening at ${args.host}:${args.port}`);
	}
}
