import fsp from 'fs/promises';
import path from 'path';
import { Router, type Request, type Response } from 'express';

import Report from '../model/Report.js';
import stringifyError from '../log/stringifyError.js';

const router = Router();

async function get(req: Request, res: Response): Promise<void> {
	const outputDir = req.app.get('outputDir') as string;

	const reports: Report[] = [];
	const reportDirs = await fsp.readdir(outputDir);
	for (const reportDir of reportDirs) {
		const stat = await fsp.stat(path.join(outputDir, reportDir));
		if (!stat.isDirectory()) {
			continue;
		}

		reports.push({
			name: reportDir,
			ctime: stat.ctime.getTime(),
		});
	}
	reports.sort((a, b) => a.ctime - b.ctime);

	res.json(reports);
}

router.get('/', (req, res) => {
	get(req, res)
		.catch((error) => {
			res.status(500);
			res.end(stringifyError(error));
		});
});

export default router;
