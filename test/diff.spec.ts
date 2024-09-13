import { jest, it, expect } from '@jest/globals';
import chalk from 'chalk';
import path from 'path';

import { handler as diff } from '../src/cmd/diff.js';

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
		_: [],
		$0: '',
	});
	const logLines = [
		`${chalk.bold('Expected')}: ${expectedDir}`,
		`${chalk.bold('Actual')}: ${actualDir}`,
		chalk.dim('Found 2 baselines.'),
		chalk.dim('Found 2 actual outputs.'),
		'',
		chalk.dim('Comparing 3 files...'),
		'',
		`${chalk.bgBlue(' 1 / 3 ')} ${b}`,
		`${chalk.bold('Expected  ')}: ${path.join(expectedDir, b)}`,
		`${chalk.bold('Actual    ')}: ${path.join(actualDir, b)}`,
		`Matched: ${chalk.green('Yes')}`,
		'',
		`${chalk.bgBlue(' 2 / 3 ')} ${a}`,
		`${chalk.bold('Expected  ')}: ${path.join(expectedDir, a)}`,
		`${chalk.bold('Actual    ')}: ${path.join(actualDir, a)}`,
		chalk.dim(`No output at ${path.join(actualDir, a)}`),
		'',
		`${chalk.bgBlue(' 3 / 3 ')} ${c}`,
		`${chalk.bold('Expected  ')}: ${path.join(expectedDir, c)}`,
		`${chalk.bold('Actual    ')}: ${path.join(actualDir, c)}`,
		chalk.dim(`No baseline at ${path.join(expectedDir, c)}`),
		'',
		`${chalk.bold('Report')}: output/diff`,
	];
	expect(log).toBeCalledTimes(logLines.length);
	for (let i = 0; i < logLines.length; i++) {
		expect(log).nthCalledWith(i + 1, logLines[i]);
	}
	expect(time).toBeCalledWith('Total Time');
	expect(timeEnd).toBeCalledWith('Total Time');
});
