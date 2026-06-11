import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Mode } from '../types';

export const modesRouter = Router();

const modes: Mode[] = [];

modesRouter.get('/', (_request, response) => {
  response.json({ modes });
});

modesRouter.post('/', (request, response) => {
  const mode = {
    id: randomUUID(),
    modeName: request.body?.modeName ?? 'Normal Mode',
    affectedCircuits: Array.isArray(request.body?.affectedCircuits) ? request.body.affectedCircuits : [],
    description: request.body?.description ?? '',
  } satisfies Mode;

  modes.push(mode);
  response.status(201).json({ mode });
});