import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sqlite3 from 'sqlite3';
import { faker } from '@faker-js/faker';
import type {
  Circuit,
  HomeModeName,
  Mode,
  PricingPeriod,
  PricingRateType,
  Schedule,
  UsageHistoryPoint,
} from './types.js';

sqlite3.verbose();

const databasePath = join(process.cwd(), 'server', 'data', 'capstone.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

const database = new sqlite3.Database(databasePath);

type RunResult = {
  changes: number;
  lastID: number;
};

type CircuitRow = Omit<Circuit, 'schedulingEnabled'> & {
  schedulingEnabled: number;
};

type UsageHistoryRow = UsageHistoryPoint;
type PricingPeriodRow = PricingPeriod;
type ScheduleRow = Omit<Schedule, 'enabled'> & { enabled: number };
type ModeRow = Omit<Mode, 'affectedCircuits'>;

const circuitTemplates: Array<Pick<Circuit, 'name' | 'category' | 'room'>> = [
  { name: 'EV Charger', category: 'EV Charger', room: 'Garage' },
  { name: 'HVAC', category: 'HVAC', room: 'Utility Closet' },
  { name: 'Water Heater', category: 'Water Heater', room: 'Basement' },
  { name: 'Kitchen Outlets', category: 'Kitchen Outlets', room: 'Kitchen' },
  { name: 'Oven', category: 'Oven', room: 'Kitchen' },
  { name: 'Dryer', category: 'Dryer', room: 'Laundry Room' },
  { name: 'Basement Lights', category: 'Basement Lights', room: 'Basement' },
  { name: 'Office', category: 'Office', room: 'Office' },
  { name: 'Garage', category: 'Garage', room: 'Garage' },
  { name: 'Refrigerator', category: 'Refrigerator', room: 'Kitchen' },
];

const pricingTemplates: Array<Pick<PricingPeriod, 'startTime' | 'endTime' | 'rateType' | 'pricePerKwh'>> = [
  { startTime: '00:00', endTime: '06:00', rateType: 'off_peak', pricePerKwh: 0.18 },
  { startTime: '06:00', endTime: '16:00', rateType: 'mid_peak', pricePerKwh: 0.26 },
  { startTime: '16:00', endTime: '21:00', rateType: 'peak', pricePerKwh: 0.41 },
  { startTime: '21:00', endTime: '24:00', rateType: 'mid_peak', pricePerKwh: 0.22 },
];

const modeTemplates: Array<{
  modeName: HomeModeName;
  description: string;
  affectedCircuitNames: string[];
}> = [
  {
    modeName: 'Normal Mode',
    description: 'Balanced everyday operation for the home.',
    affectedCircuitNames: circuitTemplates.map((circuit) => circuit.name),
  },
  {
    modeName: 'Low Power Mode',
    description: 'Reduce non-essential loads while keeping the essentials on.',
    affectedCircuitNames: ['Office', 'Basement Lights', 'Garage'],
  },
  {
    modeName: 'Vacation Mode',
    description: 'Minimize energy draw while the home is unoccupied.',
    affectedCircuitNames: ['Refrigerator', 'Basement Lights'],
  },
  {
    modeName: 'Night Mode',
    description: 'Shift flexible loads out of expensive evening hours.',
    affectedCircuitNames: ['EV Charger', 'Water Heater', 'Dryer'],
  },
];

function run(sql: string, params: unknown[] = []): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function callback(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ changes: this.changes ?? 0, lastID: this.lastID ?? 0 });
    });
  });
}

function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows: T[]) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    database.get(sql, params, (error, row: T | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function circuitFromRow(row: CircuitRow): Circuit {
  return {
    ...row,
    currentWatts: Number(row.currentWatts),
    voltage: Number(row.voltage),
    schedulingEnabled: Boolean(row.schedulingEnabled),
  };
}

function usageFromRow(row: UsageHistoryRow): UsageHistoryPoint {
  return {
    ...row,
    watts: Number(row.watts),
    estimatedCost: Number(row.estimatedCost),
  };
}

function pricingFromRow(row: PricingPeriodRow): PricingPeriod {
  return {
    ...row,
    pricePerKwh: Number(row.pricePerKwh),
  };
}

function scheduleFromRow(row: ScheduleRow): Schedule {
  return {
    ...row,
    enabled: Boolean(row.enabled),
  };
}

async function createTables() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS circuits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      currentWatts INTEGER NOT NULL,
      voltage INTEGER NOT NULL,
      room TEXT NOT NULL,
      schedulingEnabled INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS usage_history (
      id TEXT PRIMARY KEY,
      circuitId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      watts INTEGER NOT NULL,
      estimatedCost REAL NOT NULL,
      FOREIGN KEY (circuitId) REFERENCES circuits(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS pricing_periods (
      id TEXT PRIMARY KEY,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      rateType TEXT NOT NULL,
      pricePerKwh REAL NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      circuitId TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      enabled INTEGER NOT NULL,
      FOREIGN KEY (circuitId) REFERENCES circuits(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS modes (
      id TEXT PRIMARY KEY,
      modeName TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS mode_circuits (
      modeId TEXT NOT NULL,
      circuitId TEXT NOT NULL,
      PRIMARY KEY (modeId, circuitId),
      FOREIGN KEY (modeId) REFERENCES modes(id) ON DELETE CASCADE,
      FOREIGN KEY (circuitId) REFERENCES circuits(id) ON DELETE CASCADE
    )
  `);
}

function statusForHour(hour: number): { rateType: PricingRateType; pricePerKwh: number } {
  if (hour >= 16 && hour < 21) {
    return { rateType: 'peak', pricePerKwh: 0.41 };
  }

  if (hour >= 6 && hour < 16) {
    return { rateType: 'mid_peak', pricePerKwh: 0.26 };
  }

  if (hour >= 21 && hour <= 23) {
    return { rateType: 'mid_peak', pricePerKwh: 0.22 };
  }

  return { rateType: 'off_peak', pricePerKwh: 0.18 };
}

async function seedDatabase() {
  const circuitCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM circuits');

  if ((circuitCount?.count ?? 0) > 0) {
    return;
  }

  const seededCircuits: Circuit[] = [];

  for (const template of circuitTemplates) {
    const circuit: Circuit = {
      id: randomUUID(),
      name: template.name,
      category: template.category,
      status: faker.helpers.arrayElement(['on', 'off', 'scheduled'] as const),
      currentWatts:
        template.category === 'EV Charger'
          ? faker.number.int({ min: 4200, max: 7200 })
          : template.category === 'HVAC'
            ? faker.number.int({ min: 1800, max: 4800 })
            : faker.number.int({ min: 50, max: 2200 }),
      voltage: template.category === 'EV Charger' || template.category === 'Oven' ? 240 : 120,
      room: template.room,
      schedulingEnabled: faker.datatype.boolean(),
    };

    seededCircuits.push(circuit);

    await run(
      `INSERT INTO circuits (id, name, category, status, currentWatts, voltage, room, schedulingEnabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        circuit.id,
        circuit.name,
        circuit.category,
        circuit.status,
        circuit.currentWatts,
        circuit.voltage,
        circuit.room,
        Number(circuit.schedulingEnabled),
      ],
    );
  }

  for (const pricingPeriod of pricingTemplates) {
    await run(
      `INSERT INTO pricing_periods (id, startTime, endTime, rateType, pricePerKwh)
       VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), pricingPeriod.startTime, pricingPeriod.endTime, pricingPeriod.rateType, pricingPeriod.pricePerKwh],
    );
  }

  const now = new Date();
  const usageRows: UsageHistoryPoint[] = [];

  for (const circuit of seededCircuits) {
    const baseWatts = Math.max(120, circuit.currentWatts || 120);

    for (let hoursBack = 72; hoursBack >= 0; hoursBack -= 1) {
      const timestamp = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      const rate = statusForHour(timestamp.getHours());
      const loadMultiplier = circuit.category === 'HVAC' ? 0.7 : circuit.category === 'EV Charger' ? 1.25 : 0.45;
      const noise = faker.number.int({ min: -20, max: 35 });
      const watts = Math.max(
        15,
        Math.round(baseWatts * loadMultiplier + noise + faker.number.int({ min: 0, max: 90 })),
      );
      const estimatedCost = Number(((watts / 1000) * rate.pricePerKwh).toFixed(2));

      usageRows.push({
        id: randomUUID(),
        circuitId: circuit.id,
        timestamp: timestamp.toISOString(),
        watts,
        estimatedCost,
      });
    }
  }

  for (const usagePoint of usageRows) {
    await run(
      `INSERT INTO usage_history (id, circuitId, timestamp, watts, estimatedCost)
       VALUES (?, ?, ?, ?, ?)`,
      [usagePoint.id, usagePoint.circuitId, usagePoint.timestamp, usagePoint.watts, usagePoint.estimatedCost],
    );
  }

  const scheduleSeeds: Array<{ circuitName: string; dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }> = [
    { circuitName: 'EV Charger', dayOfWeek: 1, startTime: '22:00', endTime: '06:00', enabled: true },
    { circuitName: 'EV Charger', dayOfWeek: 2, startTime: '22:00', endTime: '06:00', enabled: true },
    { circuitName: 'Water Heater', dayOfWeek: 1, startTime: '01:00', endTime: '05:00', enabled: true },
    { circuitName: 'Dryer', dayOfWeek: 6, startTime: '20:00', endTime: '23:00', enabled: true },
  ];

  for (const scheduleSeed of scheduleSeeds) {
    const circuit = seededCircuits.find((item) => item.name === scheduleSeed.circuitName);

    if (!circuit) {
      continue;
    }

    await run(
      `INSERT INTO schedules (id, circuitId, dayOfWeek, startTime, endTime, enabled)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [randomUUID(), circuit.id, scheduleSeed.dayOfWeek, scheduleSeed.startTime, scheduleSeed.endTime, Number(scheduleSeed.enabled)],
    );
  }

  for (const modeSeed of modeTemplates) {
    const modeId = randomUUID();

    await run(`INSERT INTO modes (id, modeName, description) VALUES (?, ?, ?)`, [
      modeId,
      modeSeed.modeName,
      modeSeed.description,
    ]);

    for (const circuitName of modeSeed.affectedCircuitNames) {
      const circuit = seededCircuits.find((item) => item.name === circuitName);

      if (!circuit) {
        continue;
      }

      await run(`INSERT INTO mode_circuits (modeId, circuitId) VALUES (?, ?)`, [modeId, circuit.id]);
    }
  }
}

export async function initializeDatabase() {
  await createTables();
  await seedDatabase();
}

export async function listCircuits() {
  const rows = await all<CircuitRow>('SELECT * FROM circuits ORDER BY name ASC');
  return rows.map(circuitFromRow);
}

export async function getCircuitById(circuitId: string) {
  const row = await get<CircuitRow>('SELECT * FROM circuits WHERE id = ?', [circuitId]);
  return row ? circuitFromRow(row) : undefined;
}

export async function createCircuit(input: Partial<Circuit>) {
  const circuit: Circuit = {
    id: randomUUID(),
    name: input.name ?? faker.commerce.productName(),
    category: input.category ?? 'Office',
    status: input.status ?? 'off',
    currentWatts: input.currentWatts ?? faker.number.int({ min: 75, max: 2400 }),
    voltage: input.voltage ?? 120,
    room: input.room ?? faker.helpers.arrayElement(['Kitchen', 'Garage', 'Office', 'Basement', 'Laundry Room']),
    schedulingEnabled: input.schedulingEnabled ?? false,
  };

  await run(
    `INSERT INTO circuits (id, name, category, status, currentWatts, voltage, room, schedulingEnabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      circuit.id,
      circuit.name,
      circuit.category,
      circuit.status,
      circuit.currentWatts,
      circuit.voltage,
      circuit.room,
      Number(circuit.schedulingEnabled),
    ],
  );

  return circuit;
}

export async function updateCircuit(circuitId: string, input: Partial<Circuit>) {
  const current = await getCircuitById(circuitId);

  if (!current) {
    return undefined;
  }

  const nextCircuit: Circuit = {
    ...current,
    ...input,
    schedulingEnabled: input.schedulingEnabled ?? current.schedulingEnabled,
  };

  await run(
    `UPDATE circuits
     SET name = ?, category = ?, status = ?, currentWatts = ?, voltage = ?, room = ?, schedulingEnabled = ?
     WHERE id = ?`,
    [
      nextCircuit.name,
      nextCircuit.category,
      nextCircuit.status,
      nextCircuit.currentWatts,
      nextCircuit.voltage,
      nextCircuit.room,
      Number(nextCircuit.schedulingEnabled),
      circuitId,
    ],
  );

  return nextCircuit;
}

export async function listUsageHistory() {
  const rows = await all<UsageHistoryRow>('SELECT * FROM usage_history ORDER BY timestamp DESC');
  return rows.map(usageFromRow);
}

export async function listUsageHistoryByCircuit(circuitId: string) {
  const rows = await all<UsageHistoryRow>('SELECT * FROM usage_history WHERE circuitId = ? ORDER BY timestamp DESC', [circuitId]);
  return rows.map(usageFromRow);
}

export async function createUsageHistoryPoint(input: Partial<UsageHistoryPoint>) {
  const usageHistoryPoint: UsageHistoryPoint = {
    id: randomUUID(),
    circuitId: input.circuitId ?? 'unknown',
    timestamp: input.timestamp ?? new Date().toISOString(),
    watts: input.watts ?? 0,
    estimatedCost: input.estimatedCost ?? 0,
  };

  await run(
    `INSERT INTO usage_history (id, circuitId, timestamp, watts, estimatedCost)
     VALUES (?, ?, ?, ?, ?)`,
    [
      usageHistoryPoint.id,
      usageHistoryPoint.circuitId,
      usageHistoryPoint.timestamp,
      usageHistoryPoint.watts,
      usageHistoryPoint.estimatedCost,
    ],
  );

  return usageHistoryPoint;
}

export async function listPricingPeriods() {
  const rows = await all<PricingPeriodRow>('SELECT * FROM pricing_periods ORDER BY startTime ASC');
  return rows.map(pricingFromRow);
}

export async function createPricingPeriod(input: Partial<PricingPeriod>) {
  const pricingPeriod: PricingPeriod = {
    id: randomUUID(),
    startTime: input.startTime ?? '00:00',
    endTime: input.endTime ?? '00:00',
    rateType: input.rateType ?? 'off_peak',
    pricePerKwh: input.pricePerKwh ?? 0,
  };

  await run(
    `INSERT INTO pricing_periods (id, startTime, endTime, rateType, pricePerKwh)
     VALUES (?, ?, ?, ?, ?)`,
    [pricingPeriod.id, pricingPeriod.startTime, pricingPeriod.endTime, pricingPeriod.rateType, pricingPeriod.pricePerKwh],
  );

  return pricingPeriod;
}

export async function listSchedules() {
  const rows = await all<ScheduleRow>('SELECT * FROM schedules ORDER BY dayOfWeek ASC, startTime ASC');
  return rows.map(scheduleFromRow);
}

export async function listSchedulesByCircuit(circuitId: string) {
  const rows = await all<ScheduleRow>('SELECT * FROM schedules WHERE circuitId = ? ORDER BY dayOfWeek ASC, startTime ASC', [circuitId]);
  return rows.map(scheduleFromRow);
}

export async function createSchedule(input: Partial<Schedule>) {
  const schedule: Schedule = {
    id: randomUUID(),
    circuitId: input.circuitId ?? 'unknown',
    dayOfWeek: input.dayOfWeek ?? 1,
    startTime: input.startTime ?? '00:00',
    endTime: input.endTime ?? '00:00',
    enabled: input.enabled ?? true,
  };

  await run(
    `INSERT INTO schedules (id, circuitId, dayOfWeek, startTime, endTime, enabled)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [schedule.id, schedule.circuitId, schedule.dayOfWeek, schedule.startTime, schedule.endTime, Number(schedule.enabled)],
  );

  return schedule;
}

export async function listModes(): Promise<Mode[]> {
  const modes = await all<ModeRow>('SELECT * FROM modes ORDER BY modeName ASC');

  const result: Mode[] = [];

  for (const mode of modes) {
    const circuitRows = await all<{ circuitId: string }>('SELECT circuitId FROM mode_circuits WHERE modeId = ?', [mode.id]);
    result.push({
      ...mode,
      affectedCircuits: circuitRows.map((row) => row.circuitId),
    });
  }

  return result;
}

export async function createMode(input: Partial<Mode>) {
  const mode: Mode = {
    id: randomUUID(),
    modeName: input.modeName ?? 'Normal Mode',
    affectedCircuits: input.affectedCircuits ?? [],
    description: input.description ?? '',
  };

  await run(`INSERT INTO modes (id, modeName, description) VALUES (?, ?, ?)`, [mode.id, mode.modeName, mode.description]);

  for (const circuitId of mode.affectedCircuits) {
    await run(`INSERT INTO mode_circuits (modeId, circuitId) VALUES (?, ?)`, [mode.id, circuitId]);
  }

  return mode;
}