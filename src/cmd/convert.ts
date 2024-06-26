import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import type { ArgumentsCamelCase, Argv, Options } from 'yargs';
import parse from '@pixdif/core/util/parse.js';
import waitFor from '@pixdif/core/util/waitFor.js';

export const command = 'convert <input>';
export const describe = 'Convert a file into multiple PNG images.';

interface ConvertOptions extends Options {
	input: string;
	outputDir?: string;
}

export function builder(argv: Argv): Argv<ConvertOptions> {
	return argv.options({
		outputDir: {
			type: 'string',
			describe: 'The location to save PNG files.',
		},
	}) as Argv<ConvertOptions>;
}

export async function handler(args: ArgumentsCamelCase<ConvertOptions>): Promise<void> {
	const {
		input,
		outputDir = '.',
	} = args;

	await fsp.mkdir(outputDir, { recursive: true });

	console.log(`Converting ${input} ...`);
	const parser = await parse(input);
	await parser.open();
	const pageNum = await parser.getPageNum();
	for (let i = 0; i < pageNum; i++) {
		console.log(`Writing Page ${i + 1} ...`);
		const page = await parser.getPage(i);
		const binary = await page.render();
		const output = fs.createWriteStream(path.join(outputDir, `${i + 1}.png`));
		binary.pipe(output);
		await waitFor(output, 'close');
	}
	console.log('Done.');
}
