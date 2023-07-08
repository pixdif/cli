import type { Router } from 'express';

import snapshots from './snapshots';

const apiMap = new Map<string, Router>();
apiMap.set('snapshots', snapshots);

export default apiMap;
