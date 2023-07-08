import { jest, it, expect } from '@jest/globals';

import { ServerOptions, serve } from '../src/api';
import { handler } from '../src/cmd/serve';

jest.mock('../src/api');

const log = jest.spyOn(console, 'log').mockReturnValue();

it('starts a server', () => {
	const options: ServerOptions = {
		dataDir: 'data',
		outputDir: 'output',
		port: 8080,
	};

	handler(options);
	expect(serve).toBeCalledWith(options);
	expect(log).toBeCalledWith('Listening at 8080');
});
