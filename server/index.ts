import express from 'express';
import { circuitsRouter } from './routes/circuits';
import { modesRouter } from './routes/modes';
import { pricingRouter } from './routes/pricing';
import { schedulesRouter } from './routes/schedules';
import { usageRouter } from './routes/usage';

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
