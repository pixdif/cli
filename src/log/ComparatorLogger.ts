import chalk from 'chalk';
import { Progress } from '@pixdif/model';
import { Comparator, Action } from '@pixdif/core/Comparator.js';
import capitalize from '@pixdif/core/util/capitalize.js';
import ProgressBar from './ProgressBar.js';

const progressBar = new ProgressBar();
progressBar.setLabelWidth(10);

function reportProgress(action: string, progress: Progress): void {
	if (progress.error) {
		console.error(chalk.red(`Failed to ${action} Page ${progress.current} due to ${progress.error.message}`));
		return;
	}
	progressBar.setLabel(`${capitalize(action)}`);
	progressBar.show(progress);
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
	if (progress.current >= progress.limit) {
		process.stdout.write('\n');
	}
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
