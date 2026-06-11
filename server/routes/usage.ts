import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { UsageHistoryPoint } from '../types';

export const usageRouter = Router();

const usageHistory: UsageHistoryPoint[] = [];

usageRouter.get('/', (_request, response) => {
  response.json({ usageHistory });
});

usageRouter.get('/circuit/:circuitId', (request, response) => {
  const points = usageHistory.filter((point) => point.circuitId === request.params.circuitId);
  response.json({ usageHistory: points });
});

usageRouter.post('/', (request, response) => {
  const point = {
    id: randomUUID(),
    circuitId: request.body?.circuitId ?? 'unknown',
    timestamp: request.body?.timestamp ?? new Date().toISOString(),
    watts: request.body?.watts ?? 0,
    estimatedCost: request.body?.estimatedCost ?? 0,
  } satisfies UsageHistoryPoint;

  usageHistory.push(point);
  response.status(201).json({ usageHistoryPoint: point });
});