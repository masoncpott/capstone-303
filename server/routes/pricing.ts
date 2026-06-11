import { Router } from 'express';
import { createPricingPeriod, listPricingPeriods } from '../db.js';

export const pricingRouter = Router();

pricingRouter.get('/', async (_request, response) => {
  const pricingPeriods = await listPricingPeriods();
  response.json({ pricingPeriods });
});

pricingRouter.post('/', async (request, response) => {
  const pricingPeriod = await createPricingPeriod(request.body ?? {});
  response.status(201).json({ pricingPeriod });
});