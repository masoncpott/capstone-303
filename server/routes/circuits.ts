import { Router } from 'express';
import { createCircuit, getCircuitById, listCircuits, updateCircuit } from '../db.js';

export const circuitsRouter = Router();

circuitsRouter.get('/', async (_request, response) => {
  const circuits = await listCircuits();
  response.json({ circuits });
});

circuitsRouter.get('/:circuitId', async (request, response) => {
  const circuit = await getCircuitById(request.params.circuitId);

  if (!circuit) {
    response.status(404).json({ message: 'Circuit not found' });
    return;
  }

  response.json({ circuit });
});

circuitsRouter.post('/', async (request, response) => {
  const circuit = await createCircuit(request.body ?? {});
  response.status(201).json({ circuit });
});

circuitsRouter.patch('/:circuitId', async (request, response) => {
  const circuit = await updateCircuit(request.params.circuitId, request.body ?? {});

  if (!circuit) {
    response.status(404).json({ message: 'Circuit not found' });
    return;
  }

  response.json({ circuit });
});