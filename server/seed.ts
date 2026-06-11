import { initializeDatabase } from './db.js';

async function main() {
  await initializeDatabase();
  console.log('SQLite seed data is ready.');
}

void main().catch((error: unknown) => {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
});