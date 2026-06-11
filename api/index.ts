import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the database file once at cold start
let dbData: any;

function getDb() {
  if (!dbData) {
    try {
      const dbPath = resolve(__dirname, '../db.json');
      const content = readFileSync(dbPath, 'utf-8');
      dbData = JSON.parse(content);
      console.log('[API] Database loaded');
    } catch (error) {
      console.error('[API] Error loading db.json:', error);
      throw error;
    }
  }
  return dbData;
}

export default async (request: Request, response: Response) => {
  try {
    const db = getDb();
    const url = new URL(request.url || '/', 'http://localhost');
    const path = url.pathname;

    // Handle API routes - these will be called as /api/circuits, /api/pricing-periods, etc.
    if (path === '/circuits' && request.method === 'GET') {
      return response.json({ circuits: db.circuits });
    }
    if (path === '/usage' && request.method === 'GET') {
      return response.json({ usage: db.usage });
    }
    if (path === '/pricing-periods' && request.method === 'GET') {
      return response.json({ pricingPeriods: db['pricing-periods'] });
    }
    if (path === '/schedules' && request.method === 'GET') {
      return response.json({ schedules: db.schedules });
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
