import { Router } from 'express';
import { createMode, listModes } from '../db.js';

export const modesRouter = Router();

modesRouter.get('/', async (_request, response) => {
  const modes = await listModes();
  response.json({ modes });
});

modesRouter.post('/', async (request, response) => {
  const mode = await createMode(request.body ?? {});
  response.status(201).json({ mode });
});