import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';

interface XaiGuideModalProps {
  t: TranslationBundle;
  open: boolean;
  onClose: () => void;
}

export const XaiGuideModal: React.FC<XaiGuideModalProps> = ({ t, open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.xaiGuide.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>{t.xaiGuide.p1}</p>
          <p>{t.xaiGuide.p2}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h4 className="font-mono-tech font-bold text-slate-900 dark:text-white mb-1">
                {t.xaiGuide.baselineTitle}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {t.xaiGuide.baselineDesc}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30">
              <h4 className="font-mono-tech font-bold text-rose-700 dark:text-rose-400 mb-1">
                {t.xaiGuide.positiveTitle}
              </h4>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                {t.xaiGuide.positiveDesc}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
              <h4 className="font-mono-tech font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                {t.xaiGuide.negativeTitle}
              </h4>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                {t.xaiGuide.negativeDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-semibold transition"
          >
            {t.xaiGuide.close}
          </button>
        </div>
      </div>
    </div>
  );
};
