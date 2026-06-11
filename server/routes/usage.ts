import { Router } from 'express';
import { createUsageHistoryPoint, listUsageHistory, listUsageHistoryByCircuit } from '../db.js';

export const usageRouter = Router();

usageRouter.get('/', async (_request, response) => {
  const usageHistory = await listUsageHistory();
  response.json({ usageHistory });
});

usageRouter.get('/circuit/:circuitId', async (request, response) => {
  const points = await listUsageHistoryByCircuit(request.params.circuitId);
  response.json({ usageHistory: points });
});

usageRouter.post('/', async (request, response) => {
  const point = await createUsageHistoryPoint(request.body ?? {});
  response.status(201).json({ usageHistoryPoint: point });
});