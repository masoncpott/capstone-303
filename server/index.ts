import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeDatabase } from './db.js';
import { circuitsRouter } from './routes/circuits.js';
import { modesRouter } from './routes/modes.js';
import { pricingRouter } from './routes/pricing.js';
import { schedulesRouter } from './routes/schedules.js';
import { usageRouter } from './routes/usage.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const currentDir = dirname(fileURLToPath(import.meta.url));
const distFromCompiledServer = resolve(currentDir, '..');
const distFromSourceServer = resolve(currentDir, '..', 'dist');
const frontendDistDir = existsSync(resolve(distFromCompiledServer, 'index.html'))
  ? distFromCompiledServer
  : distFromSourceServer;

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.use('/api/circuits', circuitsRouter);
app.use('/api/usage', usageRouter);
app.use('/api/pricing-periods', pricingRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/modes', modesRouter);

if (existsSync(resolve(frontendDistDir, 'index.html'))) {
  app.use(express.static(frontendDistDir));

  app.get(/^(?!\/api|\/health).*/, (_request, response) => {
    response.sendFile(resolve(frontendDistDir, 'index.html'));
  });
}

async function bootstrap() {
  try {
    console.log('[BOOTSTRAP] Starting initialization...');
    await initializeDatabase();
    console.log('[BOOTSTRAP] Database initialized, starting Express server...');

    const server = app.listen(port, () => {
      console.log(`[BOOTSTRAP] Server listening on port ${port}`);
    });

    server.on('error', (err) => {
      console.error('[SERVER ERROR]', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('[UNCAUGHT EXCEPTION]', err);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('[UNHANDLED REJECTION]', reason);
    });
  } catch (error) {
    console.error('[BOOTSTRAP FAILED]', error);
    process.exitCode = 1;
  }
}

console.log('[MAIN] Starting application...');
void bootstrap();
