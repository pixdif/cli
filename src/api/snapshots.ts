import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { json, Router } from 'express';

const router = Router();

router.use(json());

router.post('/', async (req, res) => {
	if (req.headers['content-type'] !== 'application/json') {
		res.status(415).end();
		return;
	}

	const reportFile = req.headers.referer;
	if (!reportFile) {
		res.status(400).send('Referer must be defined in request header.');
		return;
	}

	if (!req.body.expected || !req.body.actual) {
		res.status(400).send('Please define both expected and actual files.');
		return;
	}

	const reportUrl = new URL(reportFile);
	const reportDir = path.join('.', path.dirname(reportUrl.pathname));
	const expected = path.resolve(reportDir, req.body.expected);
	const actual = path.resolve(reportDir, req.body.actual);
	if (!fs.existsSync(actual)) {
		res.status(404).send(`The actual output file is not found at ${actual}`);
		return;
	}

	const expectedDir = path.dirname(expected);
	await fsp.mkdir(expectedDir, { recursive: true });
	await fsp.copyFile(actual, expected);

	res.status(200).end();
});

export default router;
