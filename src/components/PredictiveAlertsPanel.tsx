import React, { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  FlaskConical,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { PredictiveAlert } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';

interface PredictiveAlertsPanelProps {
  t: TranslationBundle;
  alerts: PredictiveAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onInjectTestFault: () => void;
  onClearResolved: () => void;
}

type AlertFilter = 'active' | 'critical' | 'warning' | 'resolved';

export const PredictiveAlertsPanel: React.FC<PredictiveAlertsPanelProps> = ({
  t,
  alerts,
  onAcknowledge,
  onResolve,
  onInjectTestFault,
  onClearResolved,
}) => {
  const [filter, setFilter] = useState<AlertFilter>('active');

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  const visibleAlerts = alerts.filter((a) => {
    if (filter === 'active') return !a.resolved;
    if (filter === 'critical') return !a.resolved && a.severity === 'critical';
    if (filter === 'warning') return !a.resolved && a.severity === 'warning';
    return a.resolved;
  });

  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'warning').length;

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md p-4 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.alerts.title}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {t.alerts.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onInjectTestFault}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/12 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{t.alerts.injectTestFault}</span>
          </button>

          {resolvedAlerts.length > 0 && (
            <button
              type="button"
              onClick={onClearResolved}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.alerts.clearResolved}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Segmented Bar */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {(
          [
            { key: 'active', label: `${t.alerts.filterAll} (${activeAlerts.length})` },
            { key: 'critical', label: `${t.alerts.filterCritical} (${criticalCount})` },
            { key: 'warning', label: `${t.alerts.filterWarning} (${warningCount})` },
            { key: 'resolved', label: `${t.alerts.filterResolved} (${resolvedAlerts.length})` },
          ] as const
        ).map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-tech font-semibold border transition ${
                active
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/50'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-950/60 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Alert Cards List */}
      {visibleAlerts.length === 0 ? (
        <div className="flex-1 min-h-[150px] flex flex-col items-center justify-center text-center p-5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mb-2" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {t.alerts.emptyTitle}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
            {t.alerts.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
          {visibleAlerts.map((alert) => {
            const copy = t.alerts.codes[alert.code];
            const isCrit = alert.severity === 'critical';
            const SevIcon = isCrit ? ShieldAlert : AlertTriangle;

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
                  alert.resolved
                    ? 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isCrit
                      ? 'bg-rose-50/80 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/45'
                      : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold ${
                          alert.resolved
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : isCrit
                              ? 'text-rose-700 dark:text-rose-400'
                              : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        <SevIcon className="w-3.5 h-3.5" />
                        <span>
                          {alert.resolved
                            ? t.alerts.resolved.toUpperCase()
                            : isCrit
                              ? t.status.critical
                              : t.status.warning}
                        </span>
                      </span>
                      <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                        · {alert.tag} · {alert.timestamp}
                      </span>
                    </div>

                    <span className="text-xs font-mono-tech font-bold text-slate-900 dark:text-white shrink-0">
                      {alert.currentValue} {alert.unit}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {copy.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {copy.cause}
                  </p>
                  <p className="text-[11px] font-medium text-cyan-800 dark:text-cyan-300 mt-1">
                    SOP: {copy.action}
                  </p>
                </div>

                {/* Prediction telemetry & actions */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2.5 font-mono-tech text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.etaMinutes === 0
                        ? t.alerts.etaImmediate
                        : alert.etaMinutes !== null
                          ? `${t.alerts.etaPrefix} ~${alert.etaMinutes} min`
                          : `${t.alerts.thresholdLabel}: ${alert.thresholdValue} ${alert.unit}`}
                    </span>
                  </div>

                  {!alert.resolved && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={alert.acknowledged}
                        onClick={() => onAcknowledge(alert.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition ${
                          alert.acknowledged
                            ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 cursor-default'
                            : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{alert.acknowledged ? t.alerts.acknowledged : t.alerts.acknowledge}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onResolve(alert.id)}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition"
                      >
                        {t.alerts.resolve}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
