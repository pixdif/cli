import { expect, it } from '@jest/globals';

import { server, handler } from '../src/cmd/serve.js';

it('starts a server', async () => {
	const options = {
		dataDir: 'data',
		outputDir: 'output',
		port: 8080,
		_: [],
		$0: '',
	};
	handler(options);
	expect(server.instance).toBeTruthy();
	server.instance!.close();
});
