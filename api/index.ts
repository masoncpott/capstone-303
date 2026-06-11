import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the database file once at cold start
let dbData: any;

function getDb() {
  if (!dbData) {
    try {
      const dbPathCandidates = [resolve(process.cwd(), 'db.json'), resolve(__dirname, '../db.json')];
      const dbPath = dbPathCandidates.find((candidate) => existsSync(candidate));

      if (!dbPath) {
        throw new Error(`db.json not found. Checked: ${dbPathCandidates.join(', ')}`);
      }

      const content = readFileSync(dbPath, 'utf-8');
      dbData = JSON.parse(content);
      console.log(`[API] Database loaded from ${dbPath}`);
    } catch (error) {
      console.error('[API] Error loading db.json:', error);
      throw error;
    }
  }
  return dbData;
}

function normalizePath(rawPath: string) {
  const stripped = rawPath.replace(/^\/api/, '');
  return stripped.length > 0 ? stripped : '/';
}

function parseJsonBody(request: { body?: unknown }) {
  if (!request.body) {
    return {} as Record<string, unknown>;
  }

  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body) as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  }

  return request.body as Record<string, unknown>;
}

export default async (request: { url?: string; method?: string; body?: unknown }, response: { json: (payload: unknown) => unknown; status: (code: number) => { json: (payload: unknown) => unknown } }) => {
  try {
    const db = getDb();
    const url = new URL(request.url || '/', 'http://localhost');
    const path = normalizePath(url.pathname);
    const circuitMatch = path.match(/^\/circuits\/([^/]+)$/);
    const usageByCircuitMatch = path.match(/^\/usage\/circuit\/([^/]+)$/);
    const schedulesByCircuitMatch = path.match(/^\/schedules\/circuit\/([^/]+)$/);

    // Handle API routes called from the frontend.
    if (path === '/circuits' && request.method === 'GET') {
      return response.json({ circuits: db.circuits });
    }

    if (circuitMatch && request.method === 'GET') {
      const circuit = db.circuits.find((item: { id: string }) => item.id === circuitMatch[1]);
      if (!circuit) {
        return response.status(404).json({ error: 'Circuit not found' });
      }

      return response.json({ circuit });
    }

    if (circuitMatch && request.method === 'PATCH') {
      const index = db.circuits.findIndex((item: { id: string }) => item.id === circuitMatch[1]);
      if (index < 0) {
        return response.status(404).json({ error: 'Circuit not found' });
      }

      const patch = parseJsonBody(request);
      const nextCircuit = {
        ...db.circuits[index],
        ...patch,
      };

      db.circuits[index] = nextCircuit;
      return response.json({ circuit: nextCircuit });
    }

    if (path === '/usage' && request.method === 'GET') {
      return response.json({ usageHistory: db.usage });
    }

    if (usageByCircuitMatch && request.method === 'GET') {
      const usageHistory = db.usage.filter((item: { circuitId: string }) => item.circuitId === usageByCircuitMatch[1]);
      return response.json({ usageHistory });
    }

    if (path === '/pricing-periods' && request.method === 'GET') {
      return response.json({ pricingPeriods: db['pricing-periods'] });
    }

    if (path === '/schedules' && request.method === 'GET') {
      return response.json({ schedules: db.schedules });
    }

    if (schedulesByCircuitMatch && request.method === 'GET') {
      const schedules = db.schedules.filter((item: { circuitId: string }) => item.circuitId === schedulesByCircuitMatch[1]);
      return response.json({ schedules });
    }

    if (path === '/modes' && request.method === 'GET') {
      return response.json({ modes: db.modes });
    }

    if (path === '/health' && request.method === 'GET') {
      return response.json({ ok: true });
    }

    // 404 for unknown routes
    return response.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('[API Error]', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
