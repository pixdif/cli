import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { json, Router, type Request, type Response } from 'express';
import stringifyError from '../log/stringifyError.js';

const router = Router();

router.use(json());

interface RequestBody {
	expected?: string;
	actual?: string;
}

async function post(req: Request, res: Response): Promise<void> {
	if (req.headers['content-type'] !== 'application/json') {
		res.status(415).end();
		return;
	}

	const reportFile = req.headers.referer;
	if (!reportFile) {
		res.status(400).send('Referer must be defined in request header.');
		return;
	}

	const body = req.body as RequestBody;
	if (!body.expected || !body.actual) {
		res.status(400).send('Please define both expected and actual files.');
		return;
	}

	const reportUrl = new URL(reportFile);
	const reportDir = path.join('.', path.dirname(reportUrl.pathname));
	const expected = path.resolve(reportDir, body.expected);
	const actual = path.resolve(reportDir, body.actual);
	if (!fs.existsSync(actual)) {
		res.status(404).send(`The actual output file is not found at ${actual}`);
		return;
	}

	const expectedDir = path.dirname(expected);
	await fsp.mkdir(expectedDir, { recursive: true });
	await fsp.copyFile(actual, expected);

	res.status(200).end();
}

router.post('/', (req, res) => {
	post(req, res)
		.catch((error) => {
			res.status(500);
			res.end(stringifyError(error));
		});
});

export default router;
