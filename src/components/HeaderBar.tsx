import React from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  Camera,
  CheckCircle2,
  FileText,
  Globe,
  HelpCircle,
  Moon,
  Pause,
  Play,
  ShieldAlert,
  Sun,
} from 'lucide-react';
import { Language, PlaybackSpeed, ShapDriver, TelemetryData, ThemeMode } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { getRiskSeverity } from '../utils/simulationEngine';

interface HeaderBarProps {
  t: TranslationBundle;
  lang: Language;
  onToggleLang: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  realTimeActive: boolean;
  onToggleRealTime: () => void;
  speed: PlaybackSpeed;
  onChangeSpeed: (s: PlaybackSpeed) => void;
  telemetry: TelemetryData;
  topShap: ShapDriver;
  risk: number;
  snapshotCount: number;
  onCaptureSnapshot: () => void;
  onOpenSnapshots: () => void;
  onOpenReport: () => void;
  onOpenXaiGuide: () => void;
  activeAlertsCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  t,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  realTimeActive,
  onToggleRealTime,
  speed,
  onChangeSpeed,
  telemetry,
  topShap,
  risk,
  snapshotCount,
  onCaptureSnapshot,
  onOpenSnapshots,
  onOpenReport,
  onOpenXaiGuide,
  activeAlertsCount,
}) => {
  const severity = getRiskSeverity(risk);

  const statusConfig = {
    normal: {
      label: t.systemNominal,
      icon: CheckCircle2,
      cls: 'text-emerald-700 dark:text-emerald-400',
    },
    warning: {
      label: t.systemWatch,
      icon: AlertTriangle,
      cls: 'text-amber-700 dark:text-amber-400',
    },
    critical: {
      label: t.systemCritical,
      icon: ShieldAlert,
      cls: 'text-rose-700 dark:text-rose-400',
    },
  }[severity];

  const StatusIcon = statusConfig.icon;
  const topShapName = t.sensors[topShap.key].shortName;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/90 bg-white/92 dark:bg-[#080f20]/92 backdrop-blur-md no-print">
      <div className="max-w-[1780px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Asset Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-cyan-600/20 border border-slate-800 dark:border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-wide text-slate-900 dark:text-white uppercase leading-none">
                {t.appTitle}
              </h1>
              <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 hidden md:inline">
                / {t.circuitName}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1 text-xs">
              <span className={`inline-flex items-center gap-1 font-mono-tech font-semibold ${statusConfig.cls}`}>
                <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{statusConfig.label}</span>
              </span>
              {activeAlertsCount > 0 && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-mono-tech text-amber-700 dark:text-amber-400 font-medium">
                    {activeAlertsCount} {t.alerts.filterAll}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: High-Frequency Key Telemetry Strip */}
        <div className="hidden 2xl:flex items-center gap-4 px-3.5 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              {t.headerMetrics.power}
            </span>
            <span className="text-xs font-mono-tech font-bold text-sky-700 dark:text-sky-400">
              {telemetry.potencia.toLocaleString()} kW
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              {t.headerMetrics.feed}
            </span>
            <span className="text-xs font-mono-tech font-bold text-emerald-700 dark:text-emerald-400">
              {telemetry.alimentacao} t/h
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              {t.headerMetrics.bearingPressure}
            </span>
            <span className="text-xs font-mono-tech font-bold text-amber-700 dark:text-amber-400">
              {telemetry.pressaoMancal.toFixed(1)} bar
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              {t.headerMetrics.topShap}
            </span>
            <span
              className={`text-xs font-mono-tech font-bold ${
                topShap.value >= 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {topShapName} ({topShap.value >= 0 ? '+' : ''}
              {topShap.value.toFixed(1)} pp)
            </span>
          </div>
        </div>

        {/* Right: Playback, Language, Theme & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Stream Playback + Speed */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-0.5">
            <button
              type="button"
              onClick={onToggleRealTime}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                realTimeActive
                  ? 'bg-emerald-600/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-amber-600/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
              }`}
            >
              {realTimeActive ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{realTimeActive ? t.live : t.paused}</span>
            </button>
            <div className="flex items-center border-l border-slate-200 dark:border-slate-700 ml-0.5 pl-0.5">
              {([1000, 500, 200] as PlaybackSpeed[]).map((spd) => {
                const label = spd === 1000 ? '1x' : spd === 500 ? '2x' : '5x';
                const active = speed === spd;
                return (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => onChangeSpeed(spd)}
                    className={`px-1.5 py-1 rounded text-[11px] font-mono-tech font-semibold transition ${
                      active
                        ? 'bg-slate-900 text-white dark:bg-cyan-500/25 dark:text-cyan-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Switcher EN / PT */}
          <button
            type="button"
            onClick={onToggleLang}
            title="Switch Language (English / Português)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-mono-tech font-semibold transition whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{lang === 'en' ? 'EN' : 'PT'}</span>
          </button>

          {/* Theme Switcher Light / Dark */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition whitespace-nowrap"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{t.themeLight}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">{t.themeDark}</span>
              </>
            )}
          </button>

          {/* Snapshot Capture */}
          <button
            type="button"
            onClick={onCaptureSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.snapshotBtn}</span>
          </button>

          {/* Snapshot Archive Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenSnapshots}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-mono-tech font-semibold transition"
            title={t.snapshots.title}
          >
            <Archive className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{snapshotCount}</span>
          </button>

          {/* Executive Report */}
          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold transition whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.reportBtn}</span>
          </button>

          {/* XAI Guide */}
          <button
            type="button"
            onClick={onOpenXaiGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden lg:inline">{t.xaiGuideBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
