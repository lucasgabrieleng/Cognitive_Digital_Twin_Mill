import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  History,
  Radar,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { ShapDriver, TelemetryData } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { getRiskSeverity } from '../utils/simulationEngine';

interface DigitalTwinPanelProps {
  t: TranslationBundle;
  telemetry: TelemetryData;
  shapValues: ShapDriver[];
  risk: number;
  cursorTime: string;
  isScrubbing: boolean;
  onReturnToLive: () => void;
  selectedSensorKey: keyof TelemetryData | null;
  onSelectHotspot: (key: keyof TelemetryData) => void;
}

export const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({
  t,
  telemetry,
  shapValues,
  risk,
  cursorTime,
  isScrubbing,
  onReturnToLive,
  selectedSensorKey,
  onSelectHotspot,
}) => {
  const severity = getRiskSeverity(risk);

  const getShap = (key: ShapDriver['key']) =>
    shapValues.find((s) => s.key === key)?.value ?? 0;

  const powerShap = getShap('potencia');
  const feedShap = getShap('alimentacao');
  const pressureShap = getShap('pressaoMancal');

  const opinionText = t.digitalTwin.xaiOpinions[severity];
  const opinionTone =
    severity === 'critical'
      ? 'text-rose-700 dark:text-rose-300'
      : severity === 'warning'
        ? 'text-amber-700 dark:text-amber-300'
        : 'text-emerald-700 dark:text-emerald-300';

  const OpinionIcon =
    severity === 'critical'
      ? ShieldAlert
      : severity === 'warning'
        ? AlertTriangle
        : CheckCircle2;

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            {t.digitalTwin.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {isScrubbing && (
            <button
              type="button"
              onClick={onReturnToLive}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[11px] font-mono-tech font-semibold transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.digitalTwin.returnToLive}</span>
            </button>
          )}
          <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400">
            {t.digitalTwin.cursorLabel}:{' '}
            <strong className="text-cyan-700 dark:text-cyan-300">{cursorTime}</strong>
          </span>
        </div>
      </div>

      {/* Mill Photo Stage with Interactive Sensor Hotspots */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-950 overflow-hidden flex items-center justify-center">
        <img
          src="/assets/mill-mb04.jpg"
          alt="Primary Grinding Mill MB-04"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 dark:opacity-85 transition-transform duration-700"
        />

        {/* Subtle Edge Scrims for Hotspot Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/15 to-slate-950/75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/45 pointer-events-none" />

        {/* Technical Coordinate Grid Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="twin-coord-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#twin-coord-grid)" />
        </svg>

        {/* Historical Scrub Banner */}
        {isScrubbing && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/90 border border-amber-400/50 text-amber-200 text-[11px] font-mono-tech font-semibold whitespace-nowrap">
            <History className="w-3.5 h-3.5" />
            <span>
              {t.digitalTwin.inspectingHistory} · {cursorTime}
            </span>
          </div>
        )}

        {/* Center Drum Speed Callout */}
        <div className="relative z-20 pointer-events-none px-4 py-2 rounded-lg bg-slate-950/90 border border-cyan-500/60 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-mono-tech font-bold tracking-widest text-cyan-400 block uppercase">
            {t.digitalTwin.chamberTitle}
          </span>
          <span className="text-xs sm:text-sm font-mono-tech font-bold text-white">
            {telemetry.velocidadeRpm.toFixed(2)} RPM · {t.digitalTwin.clockwise}
          </span>
        </div>

        {/* Hotspot 1: Top-Left — Solid Ore Feed (WIT-401) */}
        <button
          type="button"
          onClick={() => onSelectHotspot('alimentacao')}
          className={`absolute left-4 sm:left-6 top-6 sm:top-8 z-30 text-left p-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border transition cursor-pointer ${
            selectedSensorKey === 'alimentacao'
              ? 'border-emerald-400 ring-2 ring-emerald-400/40'
              : 'border-emerald-500/50 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[10px] uppercase font-mono-tech font-bold text-emerald-400 tracking-wider">
              WIT-401 · {t.sensors.alimentacao.pinTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech font-bold text-white">
            {telemetry.alimentacao} t/h{' '}
            <span
              className={`text-[11px] font-semibold ${
                feedShap >= 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              ({feedShap >= 0 ? '+' : ''}
              {feedShap.toFixed(1)} pp)
            </span>
          </p>
        </button>

        {/* Hotspot 2: Top-Right — Hydrostatic Bearing Pressure (PIT-402) */}
        <button
          type="button"
          onClick={() => onSelectHotspot('pressaoMancal')}
          className={`absolute right-4 sm:right-6 top-6 sm:top-8 z-30 text-left p-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border transition cursor-pointer ${
            selectedSensorKey === 'pressaoMancal'
              ? 'border-amber-400 ring-2 ring-amber-400/40'
              : 'border-amber-500/60 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[10px] uppercase font-mono-tech font-bold text-amber-300 tracking-wider">
              PIT-402 · {t.sensors.pressaoMancal.pinTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech font-bold text-white">
            {telemetry.pressaoMancal.toFixed(1)} bar{' '}
            <span
              className={`text-[11px] font-semibold ${
                pressureShap >= 0 ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              ({pressureShap >= 0 ? '+' : ''}
              {pressureShap.toFixed(1)} pp SHAP)
            </span>
          </p>
        </button>

        {/* Hotspot 3: Bottom-Left — Pinion Motor Power (JIT-400) */}
        <button
          type="button"
          onClick={() => onSelectHotspot('potencia')}
          className={`absolute left-4 sm:left-6 bottom-6 sm:bottom-8 z-30 text-left p-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border transition cursor-pointer ${
            selectedSensorKey === 'potencia'
              ? 'border-sky-400 ring-2 ring-sky-400/40'
              : 'border-sky-500/50 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[10px] uppercase font-mono-tech font-bold text-sky-400 tracking-wider">
              JIT-400 · {t.sensors.potencia.pinTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech font-bold text-white">
            {telemetry.potencia.toLocaleString()} kW{' '}
            <span
              className={`text-[11px] font-semibold ${
                powerShap >= 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              ({powerShap >= 0 ? '+' : ''}
              {powerShap.toFixed(1)} pp)
            </span>
          </p>
        </button>

        {/* Hotspot 4: Bottom-Right — Discharge Trunnion Vibration & Temp (VIT-404 / TIT-403) */}
        <button
          type="button"
          onClick={() => onSelectHotspot('vibracao')}
          className={`absolute right-4 sm:right-6 bottom-6 sm:bottom-8 z-30 text-left p-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border transition cursor-pointer ${
            selectedSensorKey === 'vibracao' || selectedSensorKey === 'temperatura'
              ? 'border-cyan-400 ring-2 ring-cyan-400/40'
              : 'border-cyan-500/50 hover:border-cyan-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[10px] uppercase font-mono-tech font-bold text-cyan-400 tracking-wider">
              VIT-404 / TIT-403 · {t.sensors.vibracao.pinTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech font-bold text-white">
            {telemetry.vibracao.toFixed(2)} mm/s · {telemetry.temperatura.toFixed(1)} °C
          </p>
        </button>
      </div>

      {/* Bottom XAI Diagnostic Strip */}
      <div className="px-4 py-2.5 bg-slate-50/95 dark:bg-slate-950/75 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-400">
            {t.digitalTwin.xaiOpinionPrefix}:
          </span>
          <span className={`inline-flex items-center gap-1 font-semibold ${opinionTone}`}>
            <OpinionIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{opinionText}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono-tech text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
          <span>
            {t.digitalTwin.fillingLabel}:{' '}
            <strong className="text-cyan-700 dark:text-cyan-400">
              {telemetry.enchimentoMoinho.toFixed(1)}%
            </strong>
          </span>
          <span>
            {t.digitalTwin.densityLabel}:{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">
              {telemetry.densidadePolpa.toFixed(1)}%
            </strong>
          </span>
          <span>
            {t.digitalTwin.waterLabel}:{' '}
            <strong className="text-sky-700 dark:text-sky-400">
              {telemetry.aguaDiluicao} m³/h
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
};
