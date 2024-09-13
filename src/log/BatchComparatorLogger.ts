import chalk from 'chalk';
import { TestStatus } from '@pixdif/model';
import { BatchComparator } from '@pixdif/core';

import ComparatorLogger from './ComparatorLogger.js';

export class BatchComparatorLogger {
	protected readonly bat: BatchComparator;

	constructor(bat: BatchComparator) {
		this.bat = bat;
	}

	track(): void {
		this.bat.on('started', () => {
			console.time('Total Time');
			console.log(chalk.dim(`Comparing ${this.bat.getProgressLimit()} files...`));
		});

		this.bat.on('progress', ({ current, limit, testCase }) => {
			switch (testCase.status) {
			case TestStatus.Matched:
				console.log(`Matched: ${chalk.green('Yes')}`);
				break;
			case TestStatus.Mismatched:
				console.log(`Matched: ${chalk.red('No')}`);
				break;
			case TestStatus.ExpectedNotFound:
				console.log(chalk.dim(`No baseline at ${testCase.expected}`));
				break;
			case TestStatus.ActualNotFound:
				console.log(chalk.dim(`No output at ${testCase.actual}`));
				break;
			case TestStatus.Unexecuted:
			default:
				console.log('');
				console.log(`${chalk.bgBlue(` ${current} / ${limit} `)} ${testCase.path ?? testCase.name}`);
				console.log(`${chalk.bold('Expected'.padEnd(10))}: ${testCase.expected}`);
				console.log(`${chalk.bold('Actual'.padEnd(10))}: ${testCase.actual}`);
				break;
			}
		});

		this.bat.on('comparing', ({ comparator }) => {
			const logger = new ComparatorLogger(comparator);
			logger.track();
		});

		this.bat.on('stopped', () => {
			console.log('');
			console.timeEnd('Total Time');
			console.log(`${chalk.bold('Report')}: ${this.bat.getReportDir()}`);
		});
	}
}

export default BatchComparatorLogger;
