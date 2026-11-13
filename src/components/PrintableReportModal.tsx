import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { SnapshotRecord } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { SENSOR_METADATA, getRiskSeverity } from '../utils/simulationEngine';

interface PrintableReportModalProps {
  t: TranslationBundle;
  snapshot: SnapshotRecord | null;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  t,
  snapshot,
  onClose,
}) => {
  if (!snapshot) return null;

  const topDriver = snapshot.shapValues[0];
  const severity = getRiskSeverity(snapshot.risk);
  const statusText =
    severity === 'critical'
      ? t.systemCritical
      : severity === 'warning'
        ? t.systemWatch
        : t.systemNominal;

  const downloadSingleJson = () => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_mb04_${snapshot.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex justify-center items-start print:static print:bg-white print:p-0 print:block"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-xl border border-slate-300 shadow-2xl overflow-hidden print:max-w-none print:border-none print:shadow-none print:rounded-none">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 no-print">
          <span className="text-xs font-mono-tech font-bold text-slate-700">
            {snapshot.id} · {snapshot.dateStr} {snapshot.timeStr}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadSingleJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.report.downloadJsonBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.report.printBtn}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Document Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 uppercase tracking-tight">
                {t.report.title}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {t.report.subtitle}
              </p>
              <p className="text-[11px] text-slate-500 font-mono-tech mt-1">
                {t.report.systemLine}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-mono-tech text-xs font-bold">
                {snapshot.id}
              </span>
              <p className="text-xs text-slate-600 font-mono-tech mt-1">
                {snapshot.dateStr} {snapshot.timeStr}
              </p>
            </div>
          </div>

          {/* Executive Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {t.report.overloadProb}
              </span>
              <p
                className={`text-2xl font-mono-tech font-bold mt-1 ${
                  severity === 'critical'
                    ? 'text-rose-600'
                    : severity === 'warning'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                }`}
              >
                {snapshot.risk}%
              </p>
              <span className="text-[11px] text-slate-500">{t.report.alertLimit}</span>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {t.report.dominantShap}
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {t.sensors[topDriver.key].name}
              </p>
              <span
                className={`text-[11px] font-mono-tech font-bold ${
                  topDriver.value >= 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {topDriver.value >= 0 ? '+' : ''}
                {topDriver.value.toFixed(1)}{' '}
                {topDriver.value >= 0 ? t.report.aboveBaseline : t.report.belowBaseline}
              </span>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {t.report.opStatus}
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">{statusText}</p>
              <span className="text-[11px] text-slate-500">{t.report.syncedTwin}</span>
            </div>
          </div>

          {/* Telemetry Matrix Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1.5 mb-2">
              {t.report.telemetryMatrixTitle}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300">
                    <th className="p-2">{t.report.colVariable}</th>
                    <th className="p-2">{t.report.colTag}</th>
                    <th className="p-2">{t.report.colInstant}</th>
                    <th className="p-2">{t.report.colLimits}</th>
                    <th className="p-2">{t.report.colShap}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {SENSOR_METADATA.slice(0, 8).map((meta) => {
                    const val = snapshot.telemetry[meta.key];
                    const shap = snapshot.shapValues.find((s) => s.key === meta.key);
                    const formatted =
                      meta.decimals === 0 ? val.toLocaleString() : val.toFixed(meta.decimals);

                    return (
                      <tr key={meta.key}>
                        <td className="p-2 font-medium text-slate-800">
                          {t.sensors[meta.key].name}
                        </td>
                        <td className="p-2 font-mono-tech text-slate-600">{meta.tag}</td>
                        <td className="p-2 font-mono-tech font-bold text-slate-900">
                          {formatted} {meta.unit}
                        </td>
                        <td className="p-2 font-mono-tech text-slate-600">
                          {meta.nominalMin} – {meta.nominalMax} {meta.unit}
                        </td>
                        <td className="p-2 font-mono-tech font-bold">
                          {shap ? (
                            <span
                              className={
                                shap.value >= 0 ? 'text-rose-600' : 'text-emerald-600'
                              }
                            >
                              {shap.value >= 0 ? '+' : ''}
                              {shap.value.toFixed(1)} pp
                            </span>
                          ) : (
                            <span className="text-slate-500">{t.status.normal}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SHAP Causal Bars */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1.5 mb-2.5">
              {t.report.shapSectionTitle}
            </h3>
            <div className="space-y-2">
              {snapshot.shapValues.map((item) => {
                const isPos = item.value >= 0;
                const widthPct = Math.min(Math.max(Math.abs(item.value) * 4.5, 4), 100);
                return (
                  <div key={item.key} className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-medium text-slate-800">
                        {t.sensors[item.key].name} ({item.tag})
                      </span>
                      <span
                        className={`font-mono-tech font-bold ${
                          isPos ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {item.value.toFixed(1)} pp
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                      <div
                        className={`h-2 ${isPos ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Prescription */}
          <div className="p-4 rounded-lg border border-slate-300 bg-slate-50">
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-1">
              {t.report.prescriptionsTitle}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {snapshot.diagnosticNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
