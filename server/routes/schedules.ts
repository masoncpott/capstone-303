import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Schedule } from '../types';

export const schedulesRouter = Router();

const schedules: Schedule[] = [];

schedulesRouter.get('/', (_request, response) => {
  response.json({ schedules });
});

schedulesRouter.get('/circuit/:circuitId', (request, response) => {
  const items = schedules.filter((schedule) => schedule.circuitId === request.params.circuitId);
  response.json({ schedules: items });
});

schedulesRouter.post('/', (request, response) => {
  const schedule = {
    id: randomUUID(),
    circuitId: request.body?.circuitId ?? 'unknown',
    dayOfWeek: request.body?.dayOfWeek ?? 1,
    startTime: request.body?.startTime ?? '00:00',
    endTime: request.body?.endTime ?? '00:00',
    enabled: request.body?.enabled ?? true,
  } satisfies Schedule;

  schedules.push(schedule);
  response.status(201).json({ schedule });
});