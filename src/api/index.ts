import type { Router, Express } from 'express';
import express from 'express';

import snapshots from './snapshots';

const apiMap = new Map<string, Router>();
apiMap.set('snapshots', snapshots);

export interface ServerOptions {
	/**
	 * The directory to save baselines and other data.
	 */
	dataDir: string;

	/**
	 * The directory of all test reports.
	 */
	outputDir: string;
}

export function serve({ dataDir, outputDir }: ServerOptions): Express {
	const server = express();
	server.use(`/${dataDir}`, express.static(dataDir));
	server.use(`/${outputDir}`, express.static(outputDir));
	for (const [contextPath, api] of apiMap) {
		server.use(`/api/${contextPath}`, api);
	}
	return server;
}
