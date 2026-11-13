import React from 'react';
import { Archive, Download, FileSpreadsheet, FileText, RotateCcw, Trash2, X } from 'lucide-react';
import { SnapshotRecord } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';

interface SnapshotsModalProps {
  t: TranslationBundle;
  open: boolean;
  onClose: () => void;
  snapshots: SnapshotRecord[];
  onRestoreSnapshot: (snap: SnapshotRecord) => void;
  onOpenReport: (snap: SnapshotRecord) => void;
  onDeleteSnapshot: (id: string) => void;
}

export const SnapshotsModal: React.FC<SnapshotsModalProps> = ({
  t,
  open,
  onClose,
  snapshots,
  onRestoreSnapshot,
  onOpenReport,
  onDeleteSnapshot,
}) => {
  if (!open) return null;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(snapshots, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mb04_snapshots_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = [
      'SnapshotID',
      'Timestamp',
      'OverloadRiskPct',
      'MotorPower_kW',
      'FeedRate_th',
      'BearingPressure_bar',
      'Vibration_mms',
      'Temp_C',
      'P80_um',
      'TopSHAP_Tag',
      'TopSHAP_pp',
    ];
    const rows = snapshots.map((s) =>
      [
        s.id,
        s.isoDate,
        s.risk,
        s.telemetry.potencia,
        s.telemetry.alimentacao,
        s.telemetry.pressaoMancal,
        s.telemetry.vibracao,
        s.telemetry.temperatura,
        s.telemetry.p80Granulometria,
        s.topDriverTag,
        s.topDriverValue,
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mb04_snapshots_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.snapshots.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {snapshots.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.snapshots.exportCsv}</span>
                </button>
                <button
                  type="button"
                  onClick={exportJson}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{t.snapshots.exportJson}</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="py-4 overflow-y-auto flex-1">
          {snapshots.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.snapshots.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-col justify-between gap-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech font-bold text-cyan-700 dark:text-cyan-400">
                      {snap.id}
                    </span>
                    <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                      {snap.timeStr}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 font-mono-tech text-[11px]">
                    <div className="text-slate-600 dark:text-slate-400">
                      {t.snapshots.risk}:{' '}
                      <strong className="text-slate-900 dark:text-white">{snap.risk}%</strong>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {t.snapshots.power}:{' '}
                      <strong className="text-slate-900 dark:text-white">
                        {snap.telemetry.potencia} kW
                      </strong>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {t.snapshots.feed}:{' '}
                      <strong className="text-slate-900 dark:text-white">
                        {snap.telemetry.alimentacao} t/h
                      </strong>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {t.snapshots.pressure}:{' '}
                      <strong className="text-slate-900 dark:text-white">
                        {snap.telemetry.pressaoMancal.toFixed(1)} bar
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        onRestoreSnapshot(snap);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-[11px] font-semibold transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t.snapshots.loadToTwin}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenReport(snap);
                        onClose();
                      }}
                      title={t.snapshots.openReport}
                      className="p-1.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-500/35 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSnapshot(snap.id)}
                      title={t.snapshots.deleteSnap}
                      className="p-1.5 rounded bg-rose-500/12 hover:bg-rose-500/22 text-rose-700 dark:text-rose-400 border border-rose-500/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
