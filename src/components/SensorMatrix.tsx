import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Gauge,
  Layers,
  ShieldAlert,
  Wrench,
  Zap,
} from 'lucide-react';
import { SubsystemCategory, TelemetryData, TimeSeriesPoint } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { SENSOR_METADATA, getSensorSeverity } from '../utils/simulationEngine';

interface SensorMatrixProps {
  t: TranslationBundle;
  telemetry: TelemetryData;
  history: TimeSeriesPoint[];
  selectedSubsystem: SubsystemCategory;
  onSelectSubsystem: (sub: SubsystemCategory) => void;
  selectedSensorKey: keyof TelemetryData | null;
  onDiagnoseSensor: (key: keyof TelemetryData) => void;
}

const SUBSYSTEM_ORDER: SubsystemCategory[] = [
  'all',
  'electrical',
  'process',
  'granulometry',
  'mechanical',
  'thermal',
];

const SUBSYSTEM_ICON: Record<SubsystemCategory, React.ComponentType<{ className?: string }>> = {
  all: Layers,
  electrical: Zap,
  process: Gauge,
  granulometry: Cpu,
  mechanical: Wrench,
  thermal: Flame,
};

const SUBSYSTEM_ACCENT: Record<SubsystemCategory, string> = {
  all: 'bg-cyan-500',
  electrical: 'bg-amber-500',
  process: 'bg-sky-500',
  granulometry: 'bg-indigo-500',
  mechanical: 'bg-emerald-500',
  thermal: 'bg-rose-500',
};

export const SensorMatrix: React.FC<SensorMatrixProps> = ({
  t,
  telemetry,
  history,
  selectedSubsystem,
  onSelectSubsystem,
  selectedSensorKey,
  onDiagnoseSensor,
}) => {
  const filteredSensors =
    selectedSubsystem === 'all'
      ? SENSOR_METADATA
      : SENSOR_METADATA.filter((s) => s.subsystem === selectedSubsystem);

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md p-4">
      {/* Header & Subsystem Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            {t.sensorMatrix.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t.sensorMatrix.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SUBSYSTEM_ORDER.map((sub) => {
            const Icon = SUBSYSTEM_ICON[sub];
            const active = selectedSubsystem === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => onSelectSubsystem(sub)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/50'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/60 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-xs ${SUBSYSTEM_ACCENT[sub]}`} />
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{t.subsystems[sub].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensor Telemetry Grid */}
      {filteredSensors.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {t.sensorMatrix.noMatch}
          </p>
          <button
            type="button"
            onClick={() => onSelectSubsystem('all')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            {t.sensorMatrix.clearFilter}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {filteredSensors.map((meta) => {
            const val = telemetry[meta.key];
            const severity = getSensorSeverity(meta, val);
            const isSelected = selectedSensorKey === meta.key;

            // Compute sparkline coordinates from history
            const series = history.map((pt) => pt.telemetry[meta.key]);
            const minVal = Math.min(...series, meta.nominalMin);
            const maxVal = Math.max(...series, meta.nominalMax);
            const span = Math.max(maxVal - minVal, 0.001);

            const pointsAttr = series
              .map((v, idx) => {
                const x = series.length > 1 ? (idx / (series.length - 1)) * 100 : 50;
                const y = 26 - ((v - minVal) / span) * 22;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            // Normalized position inside nominal range for bar indicator
            const pct = Math.min(
              Math.max(((val - meta.nominalMin) / (meta.nominalMax - meta.nominalMin)) * 100, 4),
              100
            );

            const statusMeta = {
              normal: {
                text: t.status.normal,
                icon: CheckCircle2,
                textCls: 'text-emerald-700 dark:text-emerald-400',
                stroke: '#10b981',
                barCls: 'bg-emerald-500',
              },
              warning: {
                text: t.status.warning,
                icon: AlertTriangle,
                textCls: 'text-amber-700 dark:text-amber-400',
                stroke: '#f59e0b',
                barCls: 'bg-amber-500',
              },
              critical: {
                text: t.status.critical,
                icon: ShieldAlert,
                textCls: 'text-rose-700 dark:text-rose-400',
                stroke: '#f43f5e',
                barCls: 'bg-rose-500',
              },
            }[severity];

            const StatusIcon = statusMeta.icon;
            const formattedVal =
              meta.decimals === 0 ? val.toLocaleString() : val.toFixed(meta.decimals);

            return (
              <button
                key={meta.key}
                type="button"
                onClick={() => onDiagnoseSensor(meta.key)}
                className={`text-left p-3 rounded-lg border transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-cyan-950/35 border-cyan-500/70 dark:border-cyan-400/70'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-950/60 dark:hover:bg-slate-800/70 border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-xs shrink-0 ${SUBSYSTEM_ACCENT[meta.subsystem]}`} />
                      <span className="text-[11px] font-mono-tech font-bold text-slate-500 dark:text-slate-400">
                        {meta.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                      {t.sensors[meta.key].shortName}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono-tech font-bold shrink-0 ${statusMeta.textCls}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusMeta.text}</span>
                  </span>
                </div>

                {/* Big numeric figure + Sparkline */}
                <div className="flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-mono-tech font-bold text-slate-900 dark:text-white leading-none">
                      {formattedVal}
                    </span>
                    <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                      {meta.unit}
                    </span>
                  </div>

                  <svg
                    viewBox="0 0 100 28"
                    className="w-16 h-6 shrink-0 overflow-visible"
                    aria-hidden="true"
                  >
                    <polyline
                      fill="none"
                      stroke={statusMeta.stroke}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsAttr}
                    />
                  </svg>
                </div>

                {/* Nominal operating band progress bar */}
                <div>
                  <div className="w-full h-1.5 rounded-sm bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${statusMeta.barCls}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      {t.sensorMatrix.nominalRange}: {meta.nominalMin}–{meta.nominalMax} {meta.unit}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
