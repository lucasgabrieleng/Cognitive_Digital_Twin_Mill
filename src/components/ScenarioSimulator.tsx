import React from 'react';
import { PlayCircle, RotateCcw, Sliders } from 'lucide-react';
import { SimulationScenario, TelemetryData } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';
import { getRiskSeverity, projectScenario } from '../utils/simulationEngine';

interface ScenarioSimulatorProps {
  t: TranslationBundle;
  baseTelemetry: TelemetryData;
  currentRisk: number;
  scenario: SimulationScenario;
  onChangeScenario: (next: SimulationScenario) => void;
  onApplyScenario: (projected: TelemetryData) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  t,
  baseTelemetry,
  currentRisk,
  scenario,
  onChangeScenario,
  onApplyScenario,
}) => {
  const projected = projectScenario(baseTelemetry, scenario);
  const deltaRisk = projected.risk - currentRisk;
  const severity = getRiskSeverity(projected.risk);

  const zoneLabel =
    severity === 'critical'
      ? t.simulator.overloadZone
      : severity === 'warning'
        ? t.simulator.cautionZone
        : t.simulator.safeZone;

  const zoneCls =
    severity === 'critical'
      ? 'text-rose-700 dark:text-rose-400'
      : severity === 'warning'
        ? 'text-amber-700 dark:text-amber-400'
        : 'text-emerald-700 dark:text-emerald-400';

  const isDirty =
    scenario.feedDeltaPct !== 0 ||
    scenario.waterDeltaM3h !== 0 ||
    scenario.p80DeltaUm !== 0;

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md p-4 flex flex-col justify-between gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{t.simulator.title}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {t.simulator.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onChangeScenario({ feedDeltaPct: 0, waterDeltaM3h: 0, p80DeltaUm: 0 })
          }
          disabled={!isDirty}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-45 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.simulator.resetSliders}</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3.5">
        {/* Feed Rate Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t.simulator.feedSlider} (WIT-401)
            </span>
            <span className="font-mono-tech font-bold text-slate-900 dark:text-cyan-300">
              {scenario.feedDeltaPct > 0 ? '+' : ''}
              {scenario.feedDeltaPct}% ({projected.telemetry.alimentacao} t/h)
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={1}
            value={scenario.feedDeltaPct}
            onChange={(e) =>
              onChangeScenario({
                ...scenario,
                feedDeltaPct: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 dark:text-slate-400">
            <span>-15%</span>
            <span>0%</span>
            <span>+15%</span>
          </div>
        </div>

        {/* Dilution Water Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t.simulator.waterSlider} (FIT-408)
            </span>
            <span className="font-mono-tech font-bold text-slate-900 dark:text-sky-300">
              {scenario.waterDeltaM3h > 0 ? '+' : ''}
              {scenario.waterDeltaM3h} m³/h ({projected.telemetry.aguaDiluicao} m³/h)
            </span>
          </div>
          <input
            type="range"
            min={-25}
            max={35}
            step={5}
            value={scenario.waterDeltaM3h}
            onChange={(e) =>
              onChangeScenario({
                ...scenario,
                waterDeltaM3h: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 dark:text-slate-400">
            <span>-25 m³/h</span>
            <span>0</span>
            <span>+35 m³/h</span>
          </div>
        </div>

        {/* P80 Hardness Shift Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t.simulator.p80Slider} (GIT-405)
            </span>
            <span className="font-mono-tech font-bold text-slate-900 dark:text-indigo-300">
              {scenario.p80DeltaUm > 0 ? '+' : ''}
              {scenario.p80DeltaUm} µm ({projected.telemetry.p80Granulometria} µm)
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={20}
            step={1}
            value={scenario.p80DeltaUm}
            onChange={(e) =>
              onChangeScenario({
                ...scenario,
                p80DeltaUm: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 dark:text-slate-400">
            <span>-15 µm</span>
            <span>0 µm</span>
            <span>+20 µm</span>
          </div>
        </div>
      </div>

      {/* Projected Output Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
            {t.simulator.projectedRisk}
          </span>
          <span className={`text-base font-mono-tech font-bold ${zoneCls}`}>
            {projected.risk}%
          </span>
          <span className={`text-[10px] font-mono-tech block ${zoneCls}`}>
            {zoneLabel}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
            {t.simulator.projectedDelta}
          </span>
          <span
            className={`text-base font-mono-tech font-bold ${
              deltaRisk > 0
                ? 'text-rose-700 dark:text-rose-400'
                : deltaRisk < 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {deltaRisk > 0 ? '+' : ''}
            {deltaRisk} pp
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
            {t.simulator.projectedPressure}
          </span>
          <span className="text-base font-mono-tech font-bold text-slate-900 dark:text-white">
            {projected.telemetry.pressaoMancal.toFixed(1)} bar
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
            {t.simulator.projectedPower}
          </span>
          <span className="text-base font-mono-tech font-bold text-slate-900 dark:text-white">
            {projected.telemetry.potencia.toLocaleString()} kW
          </span>
        </div>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={() => onApplyScenario(projected.telemetry)}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-semibold transition"
      >
        <PlayCircle className="w-4 h-4" />
        <span>{t.simulator.applyToTwin}</span>
      </button>
    </section>
  );
};
