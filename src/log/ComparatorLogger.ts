import { Progress } from '@pixdif/model';
import { Comparator, Action } from '@pixdif/core/Comparator';

import capitalize from '../util/capitalize';

function reportProgress(action: string, progress: Progress): void {
	if (progress.current === 0) {
		console.log(`${capitalize(action)} ${progress.limit} images...`);
	} else if (progress.error) {
		console.error(`Failed to ${action} Page ${progress.current} due to ${progress.error}`);
	} else {
		process.stdout.write(`${progress.current} / ${progress.limit}...\r`);
	}
}

function reportPreparingProgress(progress: Progress): void {
	reportProgress(Action.Preparing, progress);
}

function reportCopyingProgress(progress: Progress): void {
	reportProgress(Action.Copying, progress);
}

function reportConvertingProgress(progress: Progress): void {
	reportProgress(Action.Converting, progress);
}

function reportComparingProgress(progress: Progress): void {
	reportProgress(Action.Comparing, progress);
}

export class ComparatorLogger {
	protected readonly cmp: Comparator;

	constructor(cmp: Comparator) {
		this.cmp = cmp;
	}

	track(): void {
		this.cmp.on(Action.Preparing, reportPreparingProgress);
		this.cmp.on(Action.Copying, reportCopyingProgress);
		this.cmp.on(Action.Converting, reportConvertingProgress);
		this.cmp.on(Action.Comparing, reportComparingProgress);
	}
}

export default ComparatorLogger;
