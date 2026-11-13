export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'pt';
export type PlaybackSpeed = 1000 | 500 | 200;

export type SubsystemCategory =
  | 'all'
  | 'electrical'
  | 'process'
  | 'granulometry'
  | 'mechanical'
  | 'thermal';

export type SeverityLevel = 'normal' | 'warning' | 'critical';

export interface TelemetryData {
  potencia: number;         // JIT-400 (kW)
  alimentacao: number;      // WIT-401 (t/h)
  pressaoMancal: number;    // PIT-402 (bar)
  vibracao: number;         // VIT-404 (mm/s)
  temperatura: number;      // TIT-403 (°C)
  p80Granulometria: number; // GIT-405 (µm)
  densidadePolpa: number;   // DIT-406 (%)
  enchimentoMoinho: number; // LIT-407 (%)
  aguaDiluicao: number;     // FIT-408 (m³/h)
  velocidadeRpm: number;    // SIT-409 (RPM)
}

export interface ShapDriver {
  key: keyof Pick<
    TelemetryData,
    'pressaoMancal' | 'alimentacao' | 'p80Granulometria' | 'potencia' | 'temperatura'
  >;
  tag: string;
  value: number; // percentage points (pp) relative to 45% baseline
}

export interface TimeSeriesPoint {
  timestamp: string;
  isoTime: string;
  risk: number;
  telemetry: TelemetryData;
  shapValues: ShapDriver[];
}

export interface PredictiveAlert {
  id: string;
  sensorKey: keyof TelemetryData;
  tag: string;
  severity: 'warning' | 'critical';
  timestamp: string;
  currentValue: number;
  unit: string;
  thresholdValue: number;
  rateOfChange: number; // per minute estimate
  etaMinutes: number | null; // predicted minutes to critical threshold
  acknowledged: boolean;
  resolved: boolean;
  code:
    | 'HIGH_BEARING_PRESSURE'
    | 'FEED_OVERLOAD_SURGE'
    | 'VIBRATION_HARMONIC_DRIFT'
    | 'THERMAL_TRUNNION_RISE'
    | 'COARSE_P80_SPIKE'
    | 'OVERLOAD_RISK_LIMIT';
}

export interface SnapshotRecord {
  id: string;
  isoDate: string;
  timeStr: string;
  dateStr: string;
  risk: number;
  telemetry: TelemetryData;
  shapValues: ShapDriver[];
  topDriverTag: string;
  topDriverValue: number;
  diagnosticNote: string;
}

export interface SimulationScenario {
  feedDeltaPct: number;      // -15 to +15 (%)
  waterDeltaM3h: number;     // -25 to +35 (m³/h)
  p80DeltaUm: number;        // -15 to +20 (µm)
}

export interface DiagnosticMessage {
  id: string;
  sender: 'user' | 'system';
  timestamp: string;
  text: string;
  meta?: string;
}

export interface SensorMeta {
  key: keyof TelemetryData;
  tag: string;
  subsystem: Exclude<SubsystemCategory, 'all'>;
  unit: string;
  decimals: number;
  nominalMin: number;
  nominalMax: number;
  warningThreshold: number;
  criticalThreshold: number;
  highIsBad: boolean;
}
