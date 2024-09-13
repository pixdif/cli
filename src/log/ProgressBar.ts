import chalk, { type ChalkInstance } from 'chalk';
import type { Progress } from '@pixdif/model';

interface RangeStyle {
	max: number;
	chalk: ChalkInstance;
}

export default class ProgressBar {
	protected block = '█';

	protected label?: string;

	protected labelWidth?: number;

	protected foregroundChalk = chalk.green;

	protected backgroundChalk = chalk.gray;

	protected rangeStyle: RangeStyle[] = [
		{
			max: 30,
			chalk: chalk.red,
		},
		{
			max: 60,
			chalk: chalk.yellow,
		},
	];

	constructor(protected width = 40) {
	}

	show({ current, limit }: Progress): void {
		const label = this.renderLabel();
		const prefix = label ? `${label}: ` : '';
		const bar = this.renderBar(current, limit);
		process.stdout.write(`\x1b[K${prefix}${bar} ${current} / ${limit}\r`);
	}

	setLabel(label: string): void {
		this.label = label;
	}

	setLabelWidth(width: number): void {
		this.labelWidth = width;
	}

	setBlock(block: string): void {
		this.block = block;
	}

	setForeground(foreground: ChalkInstance): void {
		this.foregroundChalk = foreground;
	}

	setBackground(background: ChalkInstance): void {
		this.backgroundChalk = background;
	}

	setRangeStyle(style: RangeStyle[]) {
		this.rangeStyle = style;
	}

	protected renderLabel(): string {
		if (!this.label) {
			return '';
		}
		if (this.labelWidth && this.label.length) {
			return this.label.padEnd(this.labelWidth, ' ');
		}
		return this.label;
	}

	protected renderBar(current: number, limit: number): string {
		const finished = Math.floor(current / limit * this.width);
		const remaining = this.width - finished;
		const foreground = this.getForegroundChalk(current, limit);
		const background = this.backgroundChalk;
		return `${foreground(this.block.repeat(finished))}${background(this.block.repeat(remaining))}`;
	}

	protected getForegroundChalk(current: number, limit: number): ChalkInstance {
		const percent = current / limit * 100;
		for (const style of this.rangeStyle) {
			if (percent <= style.max) {
				return style.chalk;
			}
		}
		return this.foregroundChalk;
	}
}
