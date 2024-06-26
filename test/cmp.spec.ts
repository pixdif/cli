import { jest, it, expect } from '@jest/globals';

import { handler as compare } from '../src/cmd/cmp.js';

const log = jest.spyOn(console, 'log').mockReturnValue();

it('compares two images', async () => {
	const expected = 'test/sample/expected/shapes-b.png';
	const actual = 'test/sample/actual/shapes-b.png';
	await compare({
		expected,
		actual,
		cacheDir: 'cache',
		outputDir: 'output/compare',
		tolerance: 0,
		_: [],
		$0: '',
	});
	expect(log).nthCalledWith(1, `Expected: ${expected}`);
	expect(log).nthCalledWith(2, `Actual: ${actual}`);
});
