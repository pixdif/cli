import { expect, it } from '@jest/globals';

import capitalize from '../../src/util/capitalize.js';

it('converts a word', () => {
	const res = capitalize('this');
	expect(res).toBe('This');
});
