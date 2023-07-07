import { jest, it, expect } from '@jest/globals';

import { handler as compare } from '../src/cmd/cmp';

const log = jest.spyOn(console, 'log').mockReturnValue();

it('compares two images', async () => {
	const expected = 'test/sample/shapes-a.png';
	const actual = 'test/sample/shapes-b.png';
	await compare({
		expected,
		actual,
		cacheDir: 'cache',
		outputDir: 'output/compare',
		tolerance: 0,
	});
	expect(log).nthCalledWith(1, `Expected: ${expected}`);
	expect(log).nthCalledWith(2, `Actual: ${actual}`);
});
