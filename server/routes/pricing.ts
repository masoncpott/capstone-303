import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { PricingPeriod } from '../types';

export const pricingRouter = Router();

const pricingPeriods: PricingPeriod[] = [];

pricingRouter.get('/', (_request, response) => {
  response.json({ pricingPeriods });
});

pricingRouter.post('/', (request, response) => {
  const pricingPeriod = {
    id: randomUUID(),
    startTime: request.body?.startTime ?? '00:00',
    endTime: request.body?.endTime ?? '00:00',
    rateType: request.body?.rateType ?? 'off_peak',
    pricePerKwh: request.body?.pricePerKwh ?? 0,
  } satisfies PricingPeriod;

  pricingPeriods.push(pricingPeriod);
  response.status(201).json({ pricingPeriod });
});