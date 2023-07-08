import { jest, it, expect } from '@jest/globals';

import { handler as convert } from '../src/cmd/convert';

const log = jest.spyOn(console, 'log').mockReturnValue();

it('reads an image', async () => {
	const input = 'test/sample/expected/shapes-a.png';
	await convert({
		input,
		outputDir: 'output/convert',
	});
	expect(log).nthCalledWith(1, `Converting ${input} ...`);
	expect(log).nthCalledWith(2, 'Writing Page 1 ...');
	expect(log).nthCalledWith(3, 'Done.');
});
