import { it, expect } from '@jest/globals';
import request from 'supertest';

import { serve } from '../../src/api/index.js';
import Report from '../../src/model/Report.js';

const dataDir = 'output';
const outputDir = 'test';
const app = serve({ dataDir, outputDir });
const self = request(app);

it('lists all directories', async () => {
	const res = await self.get('/api/reports');
	expect(res.statusCode).toBe(200);

	const reports: Report[] = res.body;
	expect(reports).toHaveLength(2);
	const reportNames: string[] = reports.map((report) => report.name);
	expect(reportNames).toContain('api');
});
