import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  DiagnosticMessage,
  Language,
  PlaybackSpeed,
  PredictiveAlert,
  SimulationScenario,
  SnapshotRecord,
  SubsystemCategory,
  TelemetryData,
  ThemeMode,
  TimeSeriesPoint,
} from './types/mill';
import { TRANSLATIONS } from './i18n/translations';
import {
  computeRiskFromShap,
  computeShapValues,
  createInitialSeries,
  evaluatePredictiveAlerts,
  generateDiagnosticReply,
  getRiskSeverity,
  stepTelemetry,
} from './utils/simulationEngine';
import { HeaderBar } from './components/HeaderBar';
import { SensorMatrix } from './components/SensorMatrix';
import { DigitalTwinPanel } from './components/DigitalTwinPanel';
import { DiagnosticsConsole } from './components/DiagnosticsConsole';
import { OverloadTrendChart } from './components/OverloadTrendChart';
import { ShapBreakdownPanel } from './components/ShapBreakdownPanel';
import { PredictiveAlertsPanel } from './components/PredictiveAlertsPanel';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { SnapshotsModal } from './components/SnapshotsModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { XaiGuideModal } from './components/XaiGuideModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [realTimeActive, setRealTimeActive] = useState<boolean>(true);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1000);

  const [initialSeries] = useState<TimeSeriesPoint[]>(() => createInitialSeries(24));
  const [history, setHistory] = useState<TimeSeriesPoint[]>(initialSeries);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemCategory>('all');
  const [selectedSensorKey, setSelectedSensorKey] = useState<keyof TelemetryData | null>(null);

  const [alerts, setAlerts] = useState<PredictiveAlert[]>(() =>
    evaluatePredictiveAlerts(initialSeries, [])
  );
  const [snapshots, setSnapshots] = useState<SnapshotRecord[]>([]);
  const [scenario, setScenario] = useState<SimulationScenario>({
    feedDeltaPct: 0,
    waterDeltaM3h: 0,
    p80DeltaUm: 0,
  });

  const [messages, setMessages] = useState<DiagnosticMessage[]>(() => {
    const nowStr = new Date().toTimeString().split(' ')[0];
    return [
      {
        id: 'init-msg',
        sender: 'system',
        timestamp: nowStr,
        text: TRANSLATIONS.en.diagnostics.welcome,
        meta: TRANSLATIONS.en.diagnostics.welcomeMeta,
      },
    ];
  });

  const [snapshotsModalOpen, setSnapshotsModalOpen] = useState(false);
  const [xaiGuideOpen, setXaiGuideOpen] = useState(false);
  const [reportSnapshot, setReportSnapshot] = useState<SnapshotRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const t = TRANSLATIONS[lang];

  // Sync <html> dark class for Tailwind v4 custom-variant dark
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync welcome message language when only initial/cleared message exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init-msg') {
        return [
          {
            ...prev[0],
            text: TRANSLATIONS[lang].diagnostics.welcome,
            meta: TRANSLATIONS[lang].diagnostics.welcomeMeta,
          },
        ];
      }
      return prev;
    });
  }, [lang]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  }, []);

  // Live Simulation Loop
  useEffect(() => {
    if (!realTimeActive) return;

    const timer = window.setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const nextTel = stepTelemetry(last.telemetry);
        const nextShap = computeShapValues(nextTel);
        const nextRisk = computeRiskFromShap(nextShap);
        const now = new Date();
        const nextPoint: TimeSeriesPoint = {
          timestamp: now.toTimeString().split(' ')[0],
          isoTime: now.toISOString(),
          risk: nextRisk,
          telemetry: nextTel,
          shapValues: nextShap,
        };
        const updated = [...prev.slice(1), nextPoint];
        setAlerts((prevAlerts) => evaluatePredictiveAlerts(updated, prevAlerts));
        return updated;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [realTimeActive, speed]);

  // Active point (either scrubbed history point or latest live tick)
  const latestPoint = history[history.length - 1];
  const activePoint =
    scrubIndex !== null && history[scrubIndex] ? history[scrubIndex] : latestPoint;

  const activeAlertsCount = useMemo(
    () => alerts.filter((a) => !a.resolved).length,
    [alerts]
  );

  // Capture Snapshot helper
  const buildSnapshotFromCurrent = useCallback((): SnapshotRecord => {
    const now = new Date();
    const id = 'SNAP-' + Date.now().toString().slice(-6);
    const sev = getRiskSeverity(activePoint.risk);
    const topDriver = activePoint.shapValues[0];
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';

    return {
      id,
      isoDate: now.toISOString(),
      dateStr: now.toLocaleDateString(locale),
      timeStr: activePoint.timestamp,
      risk: activePoint.risk,
      telemetry: { ...activePoint.telemetry },
      shapValues: activePoint.shapValues.map((s) => ({ ...s })),
      topDriverTag: topDriver.tag,
      topDriverValue: topDriver.value,
      diagnosticNote: TRANSLATIONS[lang].digitalTwin.xaiOpinions[sev],
    };
  }, [activePoint, lang]);

  const handleCaptureSnapshot = () => {
    const snap = buildSnapshotFromCurrent();
    setSnapshots((prev) => [snap, ...prev]);
    showToast(`${t.notifications.snapshotSaved} (${snap.id})`);
  };

  const handleOpenExecutiveReport = () => {
    const snap = buildSnapshotFromCurrent();
    setSnapshots((prev) => [snap, ...prev]);
    setReportSnapshot(snap);
  };

  const handleRestoreSnapshot = (snap: SnapshotRecord) => {
    setRealTimeActive(false);
    setScrubIndex(null);
    setHistory((prev) => [
      ...prev.slice(1),
      {
        timestamp: snap.timeStr,
        isoTime: snap.isoDate,
        risk: snap.risk,
        telemetry: { ...snap.telemetry },
        shapValues: snap.shapValues.map((s) => ({ ...s })),
      },
    ]);
    showToast(`${t.notifications.snapshotRestored} (${snap.id})`);
  };

  const handleQueryDiagnostics = useCallback(
    (query: string) => {
      const nowStr = new Date().toTimeString().split(' ')[0];
      const userMsg: DiagnosticMessage = {
        id: `u-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        sender: 'user',
        timestamp: nowStr,
        text: query,
      };
      const replyText = generateDiagnosticReply(
        query,
        lang,
        activePoint.telemetry,
        activePoint.shapValues,
        activePoint.risk,
        activePoint.timestamp
      );
      const sysMsg: DiagnosticMessage = {
        id: `s-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        sender: 'system',
        timestamp: nowStr,
        text: replyText,
        meta: 'XGBOOST + SHAP',
      };
      setMessages((prev) => [...prev, userMsg, sysMsg]);
    },
    [activePoint, lang]
  );

  const handleSelectSensorDiagnostic = (key: keyof TelemetryData) => {
    setSelectedSensorKey(key);
    const sensorName = t.sensors[key].name;
    const tagMap: Record<keyof TelemetryData, string> = {
      potencia: 'JIT-400',
      alimentacao: 'WIT-401',
      pressaoMancal: 'PIT-402',
      vibracao: 'VIT-404',
      temperatura: 'TIT-403',
      p80Granulometria: 'GIT-405',
      densidadePolpa: 'DIT-406',
      enchimentoMoinho: 'LIT-407',
      aguaDiluicao: 'FIT-408',
      velocidadeRpm: 'SIT-409',
    };
    const prompt =
      lang === 'pt'
        ? `Diagnosticar ${sensorName} (${tagMap[key]})`
        : `Diagnose ${sensorName} (${tagMap[key]})`;
    handleQueryDiagnostics(prompt);
  };

  const handleApplyScenario = (projectedTel: TelemetryData) => {
    const nextShap = computeShapValues(projectedTel);
    const nextRisk = computeRiskFromShap(nextShap);
    const now = new Date();
    setScrubIndex(null);
    setHistory((prev) => {
      const updated = [
        ...prev.slice(1),
        {
          timestamp: now.toTimeString().split(' ')[0],
          isoTime: now.toISOString(),
          risk: nextRisk,
          telemetry: projectedTel,
          shapValues: nextShap,
        },
      ];
      setAlerts((prevAlerts) => evaluatePredictiveAlerts(updated, prevAlerts));
      return updated;
    });
    showToast(t.notifications.scenarioApplied);
  };

  const handleInjectTestFault = () => {
    const spikedTel: TelemetryData = {
      ...latestPoint.telemetry,
      pressaoMancal: 72.6,
      alimentacao: 882,
      vibracao: 3.85,
      p80Granulometria: 116,
    };
    const nextShap = computeShapValues(spikedTel);
    const nextRisk = computeRiskFromShap(nextShap);
    const now = new Date();
    setScrubIndex(null);
    setHistory((prev) => {
      const updated = [
        ...prev.slice(1),
        {
          timestamp: now.toTimeString().split(' ')[0],
          isoTime: now.toISOString(),
          risk: nextRisk,
          telemetry: spikedTel,
          shapValues: nextShap,
        },
      ];
      setAlerts((prevAlerts) => evaluatePredictiveAlerts(updated, prevAlerts));
      return updated;
    });
    showToast(t.notifications.faultInjected);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full-Viewport Mill Background Image Layer with Theme-Calibrated Scrim */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
        <img
          src="/assets/mill-mb04.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/88 via-slate-100/84 to-slate-200/90 dark:from-[#070b14]/88 dark:via-[#070b14]/84 dark:to-[#050811]/94" />
      </div>

      {/* Foreground Application Shell */}
      <div className="relative z-10 flex-1 flex flex-col">
        <HeaderBar
          t={t}
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'en' ? 'pt' : 'en'))}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          realTimeActive={realTimeActive}
          onToggleRealTime={() => setRealTimeActive((prev) => !prev)}
          speed={speed}
          onChangeSpeed={(s) => setSpeed(s)}
          telemetry={activePoint.telemetry}
          topShap={activePoint.shapValues[0]}
          risk={activePoint.risk}
          snapshotCount={snapshots.length}
          onCaptureSnapshot={handleCaptureSnapshot}
          onOpenSnapshots={() => setSnapshotsModalOpen(true)}
          onOpenReport={handleOpenExecutiveReport}
          onOpenXaiGuide={() => setXaiGuideOpen(true)}
          activeAlertsCount={activeAlertsCount}
        />

        <main className="flex-1 max-w-[1780px] w-full mx-auto px-3 sm:px-5 py-4 flex flex-col gap-4 no-print">
          {/* Top Row: Digital Twin Mill Stage (7 cols) + XAI Operational Decision Console (5 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7">
              <DigitalTwinPanel
                t={t}
                telemetry={activePoint.telemetry}
                shapValues={activePoint.shapValues}
                risk={activePoint.risk}
                cursorTime={activePoint.timestamp}
                isScrubbing={scrubIndex !== null}
                onReturnToLive={() => setScrubIndex(null)}
                selectedSensorKey={selectedSensorKey}
                onSelectHotspot={handleSelectSensorDiagnostic}
              />
            </div>

            <div className="xl:col-span-5 flex flex-col">
              <DiagnosticsConsole
                t={t}
                messages={messages}
                onSubmitQuery={handleQueryDiagnostics}
                onClearLog={() =>
                  setMessages([
                    {
                      id: `cleared-${Date.now()}`,
                      sender: 'system',
                      timestamp: new Date().toTimeString().split(' ')[0],
                      text: t.diagnostics.cleared,
                      meta: 'XAI ENGINE',
                    },
                  ])
                }
              />
            </div>
          </div>

          {/* Second Row: Time-Series Overload Trajectory (7 cols) + SHAP Causal Decomposition (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7">
              <OverloadTrendChart
                t={t}
                history={history}
                scrubIndex={scrubIndex}
                onScrubIndex={setScrubIndex}
              />
            </div>

            <div className="lg:col-span-5">
              <ShapBreakdownPanel
                t={t}
                shapValues={activePoint.shapValues}
                risk={activePoint.risk}
                timestamp={activePoint.timestamp}
              />
            </div>
          </div>

          {/* Third Row: Predictive Maintenance Alert Engine (7 cols) + What-If Process Simulator (5 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7">
              <PredictiveAlertsPanel
                t={t}
                alerts={alerts}
                onAcknowledge={(id) =>
                  setAlerts((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
                  )
                }
                onResolve={(id) =>
                  setAlerts((prev) =>
                    prev.map((a) =>
                      a.id === id ? { ...a, resolved: true, acknowledged: true } : a
                    )
                  )
                }
                onInjectTestFault={handleInjectTestFault}
                onClearResolved={() =>
                  setAlerts((prev) => prev.filter((a) => !a.resolved))
                }
              />
            </div>

            <div className="xl:col-span-5">
              <ScenarioSimulator
                t={t}
                baseTelemetry={activePoint.telemetry}
                currentRisk={activePoint.risk}
                scenario={scenario}
                onChangeScenario={setScenario}
                onApplyScenario={handleApplyScenario}
              />
            </div>
          </div>

          {/* Fourth Row: Full OT Sensor Telemetry Matrix with Subsystem Filter & Sparklines */}
          <SensorMatrix
            t={t}
            telemetry={activePoint.telemetry}
            history={history}
            selectedSubsystem={selectedSubsystem}
            onSelectSubsystem={setSelectedSubsystem}
            selectedSensorKey={selectedSensorKey}
            onDiagnoseSensor={handleSelectSensorDiagnostic}
          />
        </main>
      </div>

      {/* Modals */}
      <XaiGuideModal
        t={t}
        open={xaiGuideOpen}
        onClose={() => setXaiGuideOpen(false)}
      />

      <SnapshotsModal
        t={t}
        open={snapshotsModalOpen}
        onClose={() => setSnapshotsModalOpen(false)}
        snapshots={snapshots}
        onRestoreSnapshot={handleRestoreSnapshot}
        onOpenReport={(snap) => setReportSnapshot(snap)}
        onDeleteSnapshot={(id) =>
          setSnapshots((prev) => prev.filter((s) => s.id !== id))
        }
      />

      <PrintableReportModal
        t={t}
        snapshot={reportSnapshot}
        onClose={() => setReportSnapshot(null)}
      />

      {/* Non-blocking Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 no-print flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white border border-cyan-500/50 shadow-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
