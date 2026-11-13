import React from 'react';
import { BarChart2 } from 'lucide-react';
import { ShapDriver } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { BASELINE_RISK } from '../utils/simulationEngine';

interface ShapBreakdownPanelProps {
  t: TranslationBundle;
  shapValues: ShapDriver[];
  risk: number;
  timestamp: string;
}

export const ShapBreakdownPanel: React.FC<ShapBreakdownPanelProps> = ({
  t,
  shapValues,
  risk,
  timestamp,
}) => {
  const netSum = shapValues.reduce((acc, s) => acc + s.value, 0);

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t.shapPanel.title}</span>
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            {t.shapPanel.subtitle}
          </p>
        </div>

        <span className="text-xs font-mono-tech font-semibold text-cyan-700 dark:text-cyan-300 shrink-0">
          {timestamp}
        </span>
      </div>

      {/* SHAP Bars */}
      <div className="space-y-3 my-auto">
        {shapValues.map((item) => {
          const isPositive = item.value >= 0;
          const widthPct = Math.min(Math.max(Math.abs(item.value) * 4.2, 4), 100);
          const sensorLabel = t.sensors[item.key].name;

          return (
            <div key={item.key} className="text-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="min-w-0 truncate">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {sensorLabel}
                  </span>{' '}
                  <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                    ({item.tag})
                  </span>
                </div>
                <span
                  className={`font-mono-tech font-bold shrink-0 ${
                    isPositive
                      ? 'text-rose-700 dark:text-rose-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.value.toFixed(1)} pp
                </span>
              </div>

              <div className="w-full h-2.5 rounded-sm bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isPositive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additive Summary Footer */}
      <div className="mt-4 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span>{t.shapPanel.baselineNote}</span>
          <span>·</span>
          <span>
            {t.shapPanel.netSum}:{' '}
            <strong
              className={
                netSum >= 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }
            >
              {netSum >= 0 ? '+' : ''}
              {netSum.toFixed(1)} pp
            </strong>
          </span>
        </div>

        <span className="font-bold text-slate-900 dark:text-white">
          {BASELINE_RISK}% {netSum >= 0 ? '+' : ''}
          {netSum.toFixed(1)} = <span className="text-cyan-700 dark:text-cyan-300">{risk}%</span>
        </span>
      </div>
    </section>
  );
};
