import { it, expect } from '@jest/globals';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import request from 'supertest';

import { serve } from '../../src/api';

const dataDir = 'output';
const outputDir = 'test';
const app = serve({ dataDir, outputDir });
const self = request(app);

const reportFile = 'http://localhost:8080/test/api/index.html?id=2';

it('rejects invalid format', async () => {
	const res = await self.post('/api/snapshots');
	expect(res.statusCode).toBe(415);
});

it('requires referer', async () => {
	const res = await self.post('/api/snapshots')
		.set('content-type', 'application/json');
	expect(res.statusCode).toBe(400);
	expect(res.text).toBe('Referer must be defined in request header.');
});

it('requires file paths of expected and actual', async () => {
	const res = await self.post('/api/snapshots')
		.set('content-type', 'application/json')
		.set('referer', reportFile);
	expect(res.statusCode).toBe(400);
	expect(res.text).toBe('Please define both expected and actual files.');
});

it('rejects non-existing actual file', async () => {
	const actual = 'abcdef';
	const payload = { expected: 'a', actual };
	const res = await self.post('/api/snapshots')
		.set('content-type', 'application/json')
		.set('referer', reportFile)
		.send(payload);
	expect(res.statusCode).toBe(404);
	expect(res.text).toBe(`The actual output file is not found at ${path.resolve(outputDir, 'api', actual)}`);
});

it('successfully overrides a snapshot', async () => {
	const script = path.basename(__filename);

	const expected = path.join(dataDir, script);
	if (fs.existsSync(expected)) {
		await fsp.unlink(expected);
	}

	const payload = { expected: script, actual: script };
	const res = await self.post('/api/snapshots')
		.set('content-type', 'application/json')
		.set('referer', reportFile)
		.send(payload);
	expect(res.statusCode).toBe(200);

	expect(fs.existsSync(expected));
});
