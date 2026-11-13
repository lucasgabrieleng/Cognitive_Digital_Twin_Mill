import React, { useMemo } from 'react';
import { RotateCcw, TrendingUp } from 'lucide-react';
import { TimeSeriesPoint } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import {
  BASELINE_RISK,
  CRITICAL_RISK_THRESHOLD,
  WARNING_RISK_THRESHOLD,
  getRiskSeverity,
} from '../utils/simulationEngine';

interface OverloadTrendChartProps {
  t: TranslationBundle;
  history: TimeSeriesPoint[];
  scrubIndex: number | null;
  onScrubIndex: (idx: number | null) => void;
}

export const OverloadTrendChart: React.FC<OverloadTrendChartProps> = ({
  t,
  history,
  scrubIndex,
  onScrubIndex,
}) => {
  const activeIdx = scrubIndex !== null ? scrubIndex : history.length - 1;
  const activePoint = history[activeIdx] ?? history[history.length - 1];
  const severity = getRiskSeverity(activePoint?.risk ?? 45);

  const width = 680;
  const height = 220;
  const pad = { top: 18, right: 18, bottom: 28, left: 38 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const yMin = 15;
  const yMax = 100;

  const yToPx = (val: number) =>
    pad.top + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

  const xToPx = (idx: number) =>
    history.length > 1
      ? pad.left + (idx / (history.length - 1)) * plotW
      : pad.left + plotW / 2;

  const { linePath, areaPath, points } = useMemo(() => {
    if (history.length === 0) {
      return { linePath: '', areaPath: '', points: [] as { x: number; y: number; risk: number; time: string }[] };
    }
    const pts = history.map((pt, i) => ({
      x: xToPx(i),
      y: yToPx(pt.risk),
      risk: pt.risk,
      time: pt.timestamp,
    }));

    const line = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${(pad.top + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(pad.top + plotH).toFixed(1)} Z`;

    return { linePath: line, areaPath: area, points: pts };
  }, [history]);

  const criticalY = yToPx(CRITICAL_RISK_THRESHOLD);
  const warningY = yToPx(WARNING_RISK_THRESHOLD);
  const baselineY = yToPx(BASELINE_RISK);

  const badgeTone =
    severity === 'critical'
      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/45'
      : severity === 'warning'
        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/45'
        : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/45';

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{t.trendChart.title}</span>
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            {t.trendChart.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {scrubIndex !== null && (
            <button
              type="button"
              onClick={() => onScrubIndex(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-mono-tech font-medium transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.digitalTwin.returnToLive}</span>
            </button>
          )}
          <span
            className={`text-xs font-mono-tech font-bold px-2.5 py-1 rounded-lg border ${badgeTone}`}
          >
            {t.trendChart.riskLabel}: {activePoint?.risk ?? 0}%
          </span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[220px] select-none cursor-crosshair overflow-visible"
          onMouseLeave={() => {
            // Keep locked if user clicked; otherwise clear on hover leave only if not locked?
            // Simple & predictable: hover previews, clicking pins/unpins or double click resets.
          }}
        >
          <defs>
            <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Ticks */}
          {[20, 40, 60, 80, 100].map((val) => {
            const y = yToPx(val);
            return (
              <g key={val}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono-tech"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Baseline Reference (45%) */}
          <line
            x1={pad.left}
            y1={baselineY}
            x2={width - pad.right}
            y2={baselineY}
            stroke="#64748b"
            strokeDasharray="2 4"
            strokeWidth="1"
          />

          {/* Watch Warning Line (60%) */}
          <line
            x1={pad.left}
            y1={warningY}
            x2={width - pad.right}
            y2={warningY}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Critical OT Threshold Line (75%) */}
          <line
            x1={pad.left}
            y1={criticalY}
            x2={width - pad.right}
            y2={criticalY}
            stroke="#f43f5e"
            strokeDasharray="6 4"
            strokeWidth="1.6"
          />
          <text
            x={width - pad.right - 4}
            y={criticalY - 5}
            textAnchor="end"
            className="fill-rose-600 dark:fill-rose-400 text-[10px] font-mono-tech font-bold"
          >
            75% OT LIMIT
          </text>

          {/* Area & Curve */}
          {areaPath && <path d={areaPath} fill="url(#riskAreaGrad)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Active Cursor Hairline & Point */}
          {points[activeIdx] && (
            <g>
              <line
                x1={points[activeIdx].x}
                y1={pad.top}
                x2={points[activeIdx].x}
                y2={pad.top + plotH}
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <circle
                cx={points[activeIdx].x}
                cy={points[activeIdx].y}
                r="5"
                className="fill-cyan-500 stroke-white dark:stroke-slate-900"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X Axis Sparse Timestamps */}
          {points.map((pt, idx) => {
            if (idx !== 0 && idx !== Math.floor(points.length / 2) && idx !== points.length - 1) {
              return null;
            }
            return (
              <text
                key={`${pt.time}-${idx}`}
                x={pt.x}
                y={height - 6}
                textAnchor={
                  idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle'
                }
                className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono-tech"
              >
                {pt.time}
              </text>
            );
          })}

          {/* Invisible Interactive Scrub Hit Columns */}
          {points.map((pt, idx) => {
            const colWidth = plotW / Math.max(points.length, 1);
            return (
              <rect
                key={`hit-${idx}`}
                x={pt.x - colWidth / 2}
                y={pad.top}
                width={colWidth}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => onScrubIndex(idx)}
                onClick={() => onScrubIndex(idx === scrubIndex ? null : idx)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend & Stream Mode Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] font-mono-tech text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-500 inline-block" />
            {t.trendChart.riskLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 inline-block" />
            {t.trendChart.criticalLimit}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block" />
            {t.trendChart.warningLimit}
          </span>
        </div>

        <span
          className={
            scrubIndex !== null
              ? 'text-amber-700 dark:text-amber-300 font-semibold'
              : 'text-emerald-700 dark:text-emerald-400 font-semibold'
          }
        >
          {scrubIndex !== null
            ? `${t.trendChart.scrubbingNote} · ${activePoint?.timestamp}`
            : t.trendChart.liveModeNote}
        </span>
      </div>
    </section>
  );
};
