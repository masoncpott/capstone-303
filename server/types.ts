export type CircuitStatus = 'on' | 'off' | 'scheduled' | 'offline';

export type CircuitCategory =
  | 'EV Charger'
  | 'HVAC'
  | 'Water Heater'
  | 'Kitchen Outlets'
  | 'Oven'
  | 'Dryer'
  | 'Basement Lights'
  | 'Office'
  | 'Garage'
  | 'Refrigerator';

export type PricingRateType = 'peak' | 'mid_peak' | 'off_peak';

export type HomeModeName = 'Normal Mode' | 'Low Power Mode' | 'Vacation Mode' | 'Night Mode';

export interface Circuit {
  id: string;
  name: string;
  category: CircuitCategory;
  status: CircuitStatus;
  currentWatts: number;
  voltage: number;
  room: string;
  schedulingEnabled: boolean;
}

export interface UsageHistoryPoint {
  id: string;
  circuitId: string;
  timestamp: string;
  watts: number;
  estimatedCost: number;
}

export interface PricingPeriod {
  id: string;
  startTime: string;
  endTime: string;
  rateType: PricingRateType;
  pricePerKwh: number;
}

export interface Schedule {
  id: string;
  circuitId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface Mode {
  id: string;
  modeName: HomeModeName;
  affectedCircuits: string[];
  description: string;
}