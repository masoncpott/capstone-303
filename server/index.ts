import express from 'express';
import { initializeDatabase } from './db.js';
import { circuitsRouter } from './routes/circuits.js';
import { modesRouter } from './routes/modes.js';
import { pricingRouter } from './routes/pricing.js';
import { schedulesRouter } from './routes/schedules.js';
import { usageRouter } from './routes/usage.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.use('/api/circuits', circuitsRouter);
app.use('/api/usage', usageRouter);
app.use('/api/pricing-periods', pricingRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/modes', modesRouter);

async function bootstrap() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

void bootstrap();
