import { jest, it, expect } from '@jest/globals';
import path from 'path';

import { handler as diff } from '../src/cmd/diff';

const log = jest.spyOn(console, 'log').mockReturnValue();
const time = jest.spyOn(console, 'time').mockReturnValue();
const timeEnd = jest.spyOn(console, 'timeEnd').mockReturnValue();

it('compares two directories', async () => {
	const expectedDir = 'test/sample/expected';
	const actualDir = 'test/sample/actual';
	const a = 'shapes-a.png';
	const b = 'shapes-b.png';
	const c = 'shapes-c.png';
	await diff({
		expectedDir,
		actualDir,
		pattern: '*.png',
		reportDir: 'output/diff',
		reportFormat: '@pixdif/html-reporter',
	});
	const logLines = [
		`Expected: ${expectedDir}`,
		`Actual: ${actualDir}`,
		'Found 2 baselines.',
		'Found 2 actual outputs.',
		'',
		'Comparing 3 files...',
		'',
		`(1 / 3) ${b}`,
		`Expected: ${path.join(expectedDir, b)}`,
		`Actual: ${path.join(actualDir, b)}`,
		'Matched: Yes',
		'',
		'(2 / 3) shapes-a.png',
		`Expected: ${path.join(expectedDir, a)}`,
		`Actual: ${path.join(actualDir, a)}`,
		`No output at ${path.join(actualDir, a)}`,
		'',
		'(3 / 3) shapes-c.png',
		`Expected: ${path.join(expectedDir, c)}`,
		`Actual: ${path.join(actualDir, c)}`,
		`No baseline at ${path.join(expectedDir, c)}`,
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
