import { jest, it, expect } from '@jest/globals';
import type { Express } from 'express';

import { serve as serveApi } from '../src/api';
import { handler } from '../src/cmd/serve';

jest.mock('../src/api');
const serve = jest.mocked(serveApi);

const log = jest.spyOn(console, 'log').mockReturnValue();

it('starts a server', () => {
	const listen = jest.fn();
	const app = { listen } as unknown as Express;
	serve.mockReturnValue(app);

	const options = {
		dataDir: 'data',
		outputDir: 'output',
		port: 8080,
	};

	handler(options);
	expect(serve).toBeCalledWith(options);
	expect(listen).toBeCalledWith(8080);
	expect(log).toBeCalledWith('Listening at 8080');
});
