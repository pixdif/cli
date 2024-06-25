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
			console.log(`Comparing ${this.bat.getProgressLimit()} files...`);
		});

		this.bat.on('progress', ({ current, limit, testCase }) => {
			switch (testCase.status) {
			case TestStatus.Matched:
				console.log('Matched: Yes');
				break;
			case TestStatus.Mismatched:
				console.log('Matched: No');
				break;
			case TestStatus.ExpectedNotFound:
				console.log(`No baseline at ${testCase.expected}`);
				break;
			case TestStatus.ActualNotFound:
				console.log(`No output at ${testCase.actual}`);
				break;
			case TestStatus.Unexecuted:
			default:
				console.log('');
				console.log(`(${current} / ${limit}) ${testCase.path ?? testCase.name}`);
				console.log(`Expected: ${testCase.expected}`);
				console.log(`Actual: ${testCase.actual}`);
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
			console.log(`Report: ${this.bat.getReportDir()}`);
		});
	}
}

export default BatchComparatorLogger;
