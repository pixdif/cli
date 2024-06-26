import path from 'path';

import type { ArgumentsCamelCase, Argv, Options } from 'yargs';
import { glob } from 'glob';
import { BatchComparator, BatchTask } from '@pixdif/core';

import BatchComparatorLogger from '../log/BatchComparatorLogger.js';

export const command = 'diff <expectedDir> <actualDir> <pattern>';
export const describe = 'Compare files in two directories.';

interface DiffOptions extends Options {
	expectedDir: string;
	actualDir: string;
	pattern: string;
	cacheDir?: string;
	tolerance?: number;
	reportDir?: string;
	reportFormat: string;
}

export function builder(yargs: Argv): Argv<DiffOptions> {
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
		reportDir: {
			type: 'string',
			describe: 'The directory to save converted image files.',
		},
		reportFormat: {
			type: 'string',
			describe: 'Report format. It is an HTML report by default.',
			default: '@pixdif/html-reporter',
		},
	}) as Argv<DiffOptions>;
}

export async function handler(args: ArgumentsCamelCase<DiffOptions>): Promise<void> {
	const {
		cacheDir,
		tolerance,
		expectedDir,
		actualDir,
		pattern,
		reportDir = actualDir,
		reportFormat,
	} = args;

	console.log(`Expected: ${expectedDir}`);
	console.log(`Actual: ${actualDir}`);

	const cmp = new BatchComparator(reportDir, { tolerance });
	if (cacheDir) {
		cmp.setCacheDir(cacheDir);
	}

	const foundFiles = new Set<string>();
	const expectedFiles = await glob(pattern, { cwd: expectedDir });
	console.log(`Found ${expectedFiles.length} baselines.`);
	for (const expectedFile of expectedFiles) {
		foundFiles.add(expectedFile);
	}
	const actualFiles = await glob(pattern, { cwd: actualDir });
	for (const actualFile of actualFiles) {
		foundFiles.add(actualFile);
	}
	console.log(`Found ${actualFiles.length} actual outputs.`);
	console.log('');

	for (const filePath of foundFiles) {
		cmp.addTask(new BatchTask({
			name: filePath,
			path: filePath,
			expected: path.join(expectedDir, filePath),
			actual: path.join(actualDir, filePath),
		}));
	}

	const logger = new BatchComparatorLogger(cmp);
	logger.track();

	const report = await cmp.exec();
	report.setFormat(reportFormat);
	await report.collect();
	await report.save();
}
