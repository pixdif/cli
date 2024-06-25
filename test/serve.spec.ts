import { jest, it } from '@jest/globals';

import { handler } from '../src/cmd/serve.js';

jest.mock('../src/api/index.js');

it('starts a server', async () => {
	const options = {
		dataDir: 'data',
		outputDir: 'output',
		port: 8080,
	};

	const server = handler(options);
	server.close();
});
