import { Argv } from 'yargs';

import { Comparator } from '@pixdif/core';
import ComparatorLogger from '../log/ComparatorLogger.js';

export const command = 'cmp <expected> <actual>';
export const describe = 'Compare 2 files.';

export function builder(yargs: Argv): Argv {
	return yargs.options({
		cacheDir: {
			type: 'string',
			default: 'cache',
			describe: 'The directory to save cache files (PNG files) of each expected file. It will be faster compare them with other actual files.',
		},
		tolerance: {
			type: 'number',
			default: 0.001,
			describe: 'The threshold to judge wether a pixel is different from another.',
		},
		outputDir: {
			type: 'string',
			describe: 'The directory to save converted image files.',
		},
	});
}

interface Arguments {
	cacheDir: string;
	tolerance: number;
	outputDir?: string;
	expected: string;
	actual: string;
}

export async function handler(args: Arguments): Promise<void> {
	const {
		cacheDir,
		tolerance,
		outputDir,
		expected,
		actual,
	} = args;

	console.log(`Expected: ${expected}`);
	console.log(`Actual: ${actual}`);

	const cmp = new Comparator(expected, actual, { cacheDir, imageDir: outputDir });
	const logger = new ComparatorLogger(cmp);
	logger.track();

	console.log('Comparing...');
	const diffs = await cmp.exec();
	const matched = diffs.every(({ ratio }) => ratio <= tolerance);
	console.log(`Matched: ${matched ? 'Yes' : 'No'}`);
}
