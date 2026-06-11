import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Circuit } from '../types';

export const circuitsRouter = Router();

const circuits: Circuit[] = [];

circuitsRouter.get('/', (_request, response) => {
  response.json({ circuits });
});

circuitsRouter.get('/:circuitId', (request, response) => {
  const circuit = circuits.find((item) => item.id === request.params.circuitId);

  if (!circuit) {
    response.status(404).json({ message: 'Circuit not found' });
    return;
  }

  response.json({ circuit });
});

circuitsRouter.post('/', (request, response) => {
  const circuit = {
    id: randomUUID(),
    name: request.body?.name ?? 'New Circuit',
    category: request.body?.category ?? 'Office',
    status: request.body?.status ?? 'off',
    currentWatts: request.body?.currentWatts ?? 0,
    voltage: request.body?.voltage ?? 240,
    room: request.body?.room ?? 'Unknown',
    schedulingEnabled: request.body?.schedulingEnabled ?? false,
  } satisfies Circuit;

  circuits.push(circuit);
  response.status(201).json({ circuit });
});

circuitsRouter.patch('/:circuitId', (request, response) => {
  const circuit = circuits.find((item) => item.id === request.params.circuitId);

  if (!circuit) {
    response.status(404).json({ message: 'Circuit not found' });
    return;
  }

  Object.assign(circuit, request.body);
  response.json({ circuit });
});