import jsonServer from 'json-server';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(resolve(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Wrap the response to match frontend expectations
server.use((req, res, next) => {
  const send = res.send.bind(res);
  
  res.send = function(data) {
    if (req.method === 'GET') {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        
        if (Array.isArray(parsed)) {
          if (req.path === '/circuits') {
            return send(JSON.stringify({ circuits: parsed }));
          }
          if (req.path === '/usage') {
            return send(JSON.stringify({ usage: parsed }));
          }
          if (req.path === '/pricing-periods') {
            return send(JSON.stringify({ pricingPeriods: parsed }));
          }
          if (req.path === '/schedules') {
            return send(JSON.stringify({ schedules: parsed }));
          }
          if (req.path === '/modes') {
            return send(JSON.stringify({ modes: parsed }));
          }
        }
      } catch (error) {
        console.error('[Server] Wrap error:', error);
      }
    }
    return send(data);
  };
  next();
});

server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`[JSON-SERVER] Running on http://localhost:${port}`);
});
