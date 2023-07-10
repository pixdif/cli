import fsp from 'fs/promises';
import path from 'path';
import { Router } from 'express';

import Report from '../model/Report';

const router = Router();

router.get('/', async (req, res) => {
	const outputDir: string = req.app.get('outputDir');

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
});

export default router;
