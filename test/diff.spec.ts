import { jest, it, expect } from '@jest/globals';
import path from 'path';

import { handler as diff } from '../src/cmd/diff';

const log = jest.spyOn(console, 'log').mockReturnValue();
const time = jest.spyOn(console, 'time').mockReturnValue();
const timeEnd = jest.spyOn(console, 'timeEnd').mockReturnValue();

it('compares two directories', async () => {
	const a = path.join('test', 'sample', 'shapes-a.png');
	const b = path.join('test', 'sample', 'shapes-b.png');
	await diff({
		expectedDir: 'test/sample',
		actualDir: 'test/sample',
		pattern: '*.png',
		reportDir: 'output/diff',
	});
	const logLines = [
		'Expected: test/sample',
		'Actual: test/sample',
		'Found 2 baselines.',
		'Found 2 actual outputs.',
		'',
		'Comparing 2 files...',
		'',
		'(1 / 2) shapes-b.png',
		`Expected: ${b}`,
		`Actual: ${b}`,
		'Matched: Yes',
		'',
		'(2 / 2) shapes-a.png',
		`Expected: ${a}`,
		`Actual: ${a}`,
		'Matched: Yes',
		'',
		'Report: output/diff',
	];
	expect(log).toBeCalledTimes(logLines.length);
	for (let i = 0; i < logLines.length; i++) {
		expect(log).nthCalledWith(i + 1, logLines[i]);
	}
	expect(time).toBeCalledWith('Total Time');
	expect(timeEnd).toBeCalledWith('Total Time');
});
