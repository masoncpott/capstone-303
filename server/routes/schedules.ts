import { Router } from 'express';
import { createSchedule, listSchedules, listSchedulesByCircuit } from '../db.js';

export const schedulesRouter = Router();

schedulesRouter.get('/', async (_request, response) => {
  const schedules = await listSchedules();
  response.json({ schedules });
});

schedulesRouter.get('/circuit/:circuitId', async (request, response) => {
  const items = await listSchedulesByCircuit(request.params.circuitId);
  response.json({ schedules: items });
});

schedulesRouter.post('/', async (request, response) => {
  const schedule = await createSchedule(request.body ?? {});
  response.status(201).json({ schedule });
});