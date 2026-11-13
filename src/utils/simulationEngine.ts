import {
  Language,
  PredictiveAlert,
  SensorMeta,
  SeverityLevel,
  ShapDriver,
  SimulationScenario,
  TelemetryData,
  TimeSeriesPoint,
} from '../types/mill';
import { TRANSLATIONS } from '../i18n/translations';

export const BASELINE_RISK = 45;
export const WARNING_RISK_THRESHOLD = 60;
export const CRITICAL_RISK_THRESHOLD = 75;

export const SENSOR_METADATA: SensorMeta[] = [
  {
    key: 'pressaoMancal',
    tag: 'PIT-402',
    subsystem: 'mechanical',
    unit: 'bar',
    decimals: 1,
    nominalMin: 55.0,
    nominalMax: 72.0,
    warningThreshold: 69.5,
    criticalThreshold: 72.0,
    highIsBad: true,
  },
  {
    key: 'alimentacao',
    tag: 'WIT-401',
    subsystem: 'process',
    unit: 't/h',
    decimals: 0,
    nominalMin: 750,
    nominalMax: 880,
    warningThreshold: 860,
    criticalThreshold: 885,
    highIsBad: true,
  },
  {
    key: 'potencia',
    tag: 'JIT-400',
    subsystem: 'electrical',
    unit: 'kW',
    decimals: 0,
    nominalMin: 4200,
    nominalMax: 5000,
    warningThreshold: 4950,
    criticalThreshold: 5080,
    highIsBad: true,
  },
  {
    key: 'p80Granulometria',
    tag: 'GIT-405',
    subsystem: 'granulometry',
    unit: 'µm',
    decimals: 0,
    nominalMin: 90,
    nominalMax: 115,
    warningThreshold: 112,
    criticalThreshold: 118,
    highIsBad: true,
  },
  {
    key: 'vibracao',
    tag: 'VIT-404',
    subsystem: 'mechanical',
    unit: 'mm/s',
    decimals: 2,
    nominalMin: 1.0,
    nominalMax: 4.5,
    warningThreshold: 3.4,
    criticalThreshold: 4.5,
    highIsBad: true,
  },
  {
    key: 'temperatura',
    tag: 'TIT-403',
    subsystem: 'thermal',
    unit: '°C',
    decimals: 1,
    nominalMin: 50.0,
    nominalMax: 75.0,
    warningThreshold: 70.0,
    criticalThreshold: 75.0,
    highIsBad: true,
  },
  {
    key: 'enchimentoMoinho',
    tag: 'LIT-407',
    subsystem: 'process',
    unit: '%',
    decimals: 1,
    nominalMin: 30.0,
    nominalMax: 40.0,
    warningThreshold: 38.5,
    criticalThreshold: 41.0,
    highIsBad: true,
  },
  {
    key: 'densidadePolpa',
    tag: 'DIT-406',
    subsystem: 'process',
    unit: '%',
    decimals: 1,
    nominalMin: 64.0,
    nominalMax: 72.0,
    warningThreshold: 71.5,
    criticalThreshold: 73.5,
    highIsBad: true,
  },
  {
    key: 'aguaDiluicao',
    tag: 'FIT-408',
    subsystem: 'process',
    unit: 'm³/h',
    decimals: 0,
    nominalMin: 260,
    nominalMax: 350,
    warningThreshold: 355,
    criticalThreshold: 375,
    highIsBad: false,
  },
  {
    key: 'velocidadeRpm',
    tag: 'SIT-409',
    subsystem: 'electrical',
    unit: 'RPM',
    decimals: 2,
    nominalMin: 9.2,
    nominalMax: 10.4,
    warningThreshold: 10.35,
    criticalThreshold: 10.6,
    highIsBad: true,
  },
];

export const INITIAL_TELEMETRY: TelemetryData = {
  potencia: 4840,
  alimentacao: 835,
  pressaoMancal: 67.8,
  vibracao: 2.38,
  temperatura: 62.4,
  p80Granulometria: 108,
  densidadePolpa: 68.5,
  enchimentoMoinho: 36.2,
  aguaDiluicao: 305,
  velocidadeRpm: 9.82,
};

export function computeShapValues(t: TelemetryData): ShapDriver[] {
  const bearingShap = parseFloat(((t.pressaoMancal - 57) * 1.45).toFixed(1));
  const feedShap = parseFloat(((t.alimentacao - 795) * 0.23).toFixed(1));
  const p80Shap = parseFloat(((t.p80Granulometria - 98) * 0.41).toFixed(1));
  const powerShap = parseFloat(((t.potencia - 4910) * 0.03).toFixed(1));
  const tempShap = parseFloat(((t.temperatura - 66.5) * 0.39).toFixed(1));

  const drivers: ShapDriver[] = [
    { key: 'pressaoMancal', tag: 'PIT-402', value: bearingShap },
    { key: 'alimentacao', tag: 'WIT-401', value: feedShap },
    { key: 'p80Granulometria', tag: 'GIT-405', value: p80Shap },
    { key: 'potencia', tag: 'JIT-400', value: powerShap },
    { key: 'temperatura', tag: 'TIT-403', value: tempShap },
  ];

  return drivers.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

export function computeRiskFromShap(shapValues: ShapDriver[]): number {
  const sum = shapValues.reduce((acc, item) => acc + item.value, 0);
  return Math.min(Math.max(Math.round(BASELINE_RISK + sum), 18), 98);
}

export function getSensorSeverity(meta: SensorMeta, value: number): SeverityLevel {
  if (meta.highIsBad) {
    if (value >= meta.criticalThreshold) return 'critical';
    if (value >= meta.warningThreshold) return 'warning';
    return 'normal';
  }
  return 'normal';
}

export function getRiskSeverity(risk: number): SeverityLevel {
  if (risk >= CRITICAL_RISK_THRESHOLD) return 'critical';
  if (risk >= WARNING_RISK_THRESHOLD) return 'warning';
  return 'normal';
}

function formatClock(date: Date): string {
  return date.toTimeString().split(' ')[0];
}

export function createInitialSeries(length = 24): TimeSeriesPoint[] {
  const now = new Date();
  const points: TimeSeriesPoint[] = [];

  for (let i = length - 1; i >= 0; i--) {
    const tDate = new Date(now.getTime() - i * 2500);
    const wave = Math.sin((length - i) / 3.2);
    const jitter = (Math.random() - 0.5) * 0.4;

    const telemetry: TelemetryData = {
      potencia: Math.round(INITIAL_TELEMETRY.potencia + wave * 42 + (Math.random() - 0.5) * 20),
      alimentacao: Math.round(INITIAL_TELEMETRY.alimentacao + wave * 14 + (Math.random() - 0.5) * 8),
      pressaoMancal: parseFloat((INITIAL_TELEMETRY.pressaoMancal + wave * 1.4 + jitter).toFixed(1)),
      vibracao: parseFloat((INITIAL_TELEMETRY.vibracao + Math.cos(i / 2) * 0.14).toFixed(2)),
      temperatura: parseFloat((INITIAL_TELEMETRY.temperatura + wave * 0.7).toFixed(1)),
      p80Granulometria: Math.round(INITIAL_TELEMETRY.p80Granulometria + wave * 2.5),
      densidadePolpa: parseFloat((INITIAL_TELEMETRY.densidadePolpa + wave * 0.6).toFixed(1)),
      enchimentoMoinho: parseFloat((INITIAL_TELEMETRY.enchimentoMoinho + wave * 0.7).toFixed(1)),
      aguaDiluicao: Math.round(INITIAL_TELEMETRY.aguaDiluicao - wave * 5),
      velocidadeRpm: parseFloat((INITIAL_TELEMETRY.velocidadeRpm + (Math.random() - 0.5) * 0.04).toFixed(2)),
    };

    const shapValues = computeShapValues(telemetry);
    const risk = computeRiskFromShap(shapValues);

    points.push({
      timestamp: formatClock(tDate),
      isoTime: tDate.toISOString(),
      risk,
      telemetry,
      shapValues,
    });
  }

  return points;
}

export function stepTelemetry(prev: TelemetryData): TelemetryData {
  // Subtle mean-reverting random walk around nominal industrial dynamics
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const nextFeed = Math.round(
    clamp(prev.alimentacao + (Math.random() - 0.5) * 12 + (838 - prev.alimentacao) * 0.04, 745, 905)
  );
  const nextP80 = Math.round(
    clamp(prev.p80Granulometria + (Math.random() - 0.5) * 3 + (108 - prev.p80Granulometria) * 0.06, 88, 122)
  );
  // Bearing pressure responds to feed & P80 slightly
  const feedInfluence = (nextFeed - 835) * 0.015 + (nextP80 - 108) * 0.03;
  const nextPressure = parseFloat(
    clamp(prev.pressaoMancal + (Math.random() - 0.48) * 0.65 + feedInfluence * 0.15 + (67.5 - prev.pressaoMancal) * 0.03, 55.5, 74.8).toFixed(1)
  );
  const nextPower = Math.round(
    clamp(prev.potencia + (Math.random() - 0.5) * 32 + (nextPressure - prev.pressaoMancal) * 18 + (4840 - prev.potencia) * 0.05, 4250, 5120)
  );
  const nextVib = parseFloat(
    clamp(prev.vibracao + (Math.random() - 0.49) * 0.09 + (2.45 - prev.vibracao) * 0.04, 1.45, 4.85).toFixed(2)
  );
  const nextTemp = parseFloat(
    clamp(prev.temperatura + (Math.random() - 0.49) * 0.25 + (62.8 - prev.temperatura) * 0.03, 52.0, 76.5).toFixed(1)
  );
  const nextFilling = parseFloat(
    clamp(30 + (nextPressure - 58) * 0.62 + (Math.random() - 0.5) * 0.2, 29.5, 42.0).toFixed(1)
  );
  const nextDensity = parseFloat(
    clamp(prev.densidadePolpa + (Math.random() - 0.5) * 0.35 + (68.5 - prev.densidadePolpa) * 0.05, 63.5, 73.5).toFixed(1)
  );
  const nextWater = Math.round(
    clamp(prev.aguaDiluicao + (Math.random() - 0.5) * 6 + (305 - prev.aguaDiluicao) * 0.06, 265, 355)
  );
  const nextRpm = parseFloat(
    clamp(prev.velocidadeRpm + (Math.random() - 0.5) * 0.03 + (9.82 - prev.velocidadeRpm) * 0.1, 9.55, 10.15).toFixed(2)
  );

  return {
    potencia: nextPower,
    alimentacao: nextFeed,
    pressaoMancal: nextPressure,
    vibracao: nextVib,
    temperatura: nextTemp,
    p80Granulometria: nextP80,
    densidadePolpa: nextDensity,
    enchimentoMoinho: nextFilling,
    aguaDiluicao: nextWater,
    velocidadeRpm: nextRpm,
  };
}

export function evaluatePredictiveAlerts(
  history: TimeSeriesPoint[],
  existingAlerts: PredictiveAlert[]
): PredictiveAlert[] {
  if (history.length < 4) return existingAlerts;

  const latest = history[history.length - 1];
  const prevWindow = history[history.length - 4];
  const nextAlerts = [...existingAlerts];

  const addOrUpdateAlert = (
    code: PredictiveAlert['code'],
    sensorKey: keyof TelemetryData,
    tag: string,
    severity: 'warning' | 'critical',
    currentValue: number,
    unit: string,
    thresholdValue: number,
    slopePerStep: number
  ) => {
    const slopePerMin = parseFloat((slopePerStep * 12).toFixed(2));
    const diffToLimit = thresholdValue - currentValue;
    const etaMinutes =
      diffToLimit <= 0
        ? 0
        : slopePerMin > 0.02
          ? Math.min(Math.round(diffToLimit / slopePerMin), 45)
          : null;

    const existingActiveIdx = nextAlerts.findIndex((a) => a.code === code && !a.resolved);
    if (existingActiveIdx >= 0) {
      nextAlerts[existingActiveIdx] = {
        ...nextAlerts[existingActiveIdx],
        severity:
          severity === 'critical' || nextAlerts[existingActiveIdx].severity === 'critical'
            ? 'critical'
            : 'warning',
        currentValue,
        rateOfChange: slopePerMin,
        etaMinutes,
        timestamp: latest.timestamp,
      };
    } else {
      nextAlerts.unshift({
        id: `ALT-${code}-${Date.now().toString().slice(-5)}`,
        sensorKey,
        tag,
        severity,
        timestamp: latest.timestamp,
        currentValue,
        unit,
        thresholdValue,
        rateOfChange: slopePerMin,
        etaMinutes,
        acknowledged: false,
        resolved: false,
        code,
      });
    }
  };

  // 1. Bearing hydrostatic pressure check
  const pSlope = (latest.telemetry.pressaoMancal - prevWindow.telemetry.pressaoMancal) / 3;
  if (latest.telemetry.pressaoMancal >= 71.5) {
    addOrUpdateAlert(
      'HIGH_BEARING_PRESSURE',
      'pressaoMancal',
      'PIT-402',
      'critical',
      latest.telemetry.pressaoMancal,
      'bar',
      72.0,
      pSlope
    );
  } else if (latest.telemetry.pressaoMancal >= 69.2 || (latest.telemetry.pressaoMancal >= 67.5 && pSlope > 0.35)) {
    addOrUpdateAlert(
      'HIGH_BEARING_PRESSURE',
      'pressaoMancal',
      'PIT-402',
      'warning',
      latest.telemetry.pressaoMancal,
      'bar',
      72.0,
      pSlope
    );
  }

  // 2. Feed surge check
  const fSlope = (latest.telemetry.alimentacao - prevWindow.telemetry.alimentacao) / 3;
  if (latest.telemetry.alimentacao >= 880) {
    addOrUpdateAlert(
      'FEED_OVERLOAD_SURGE',
      'alimentacao',
      'WIT-401',
      'critical',
      latest.telemetry.alimentacao,
      't/h',
      885,
      fSlope
    );
  } else if (latest.telemetry.alimentacao >= 862) {
    addOrUpdateAlert(
      'FEED_OVERLOAD_SURGE',
      'alimentacao',
      'WIT-401',
      'warning',
      latest.telemetry.alimentacao,
      't/h',
      885,
      fSlope
    );
  }

  // 3. Vibration check
  const vSlope = (latest.telemetry.vibracao - prevWindow.telemetry.vibracao) / 3;
  if (latest.telemetry.vibracao >= 4.2) {
    addOrUpdateAlert(
      'VIBRATION_HARMONIC_DRIFT',
      'vibracao',
      'VIT-404',
      'critical',
      latest.telemetry.vibracao,
      'mm/s',
      4.5,
      vSlope
    );
  } else if (latest.telemetry.vibracao >= 3.35) {
    addOrUpdateAlert(
      'VIBRATION_HARMONIC_DRIFT',
      'vibracao',
      'VIT-404',
      'warning',
      latest.telemetry.vibracao,
      'mm/s',
      4.5,
      vSlope
    );
  }

  // 4. Thermal check
  const tSlope = (latest.telemetry.temperatura - prevWindow.telemetry.temperatura) / 3;
  if (latest.telemetry.temperatura >= 73.5) {
    addOrUpdateAlert(
      'THERMAL_TRUNNION_RISE',
      'temperatura',
      'TIT-403',
      'critical',
      latest.telemetry.temperatura,
      '°C',
      75.0,
      tSlope
    );
  } else if (latest.telemetry.temperatura >= 69.8) {
    addOrUpdateAlert(
      'THERMAL_TRUNNION_RISE',
      'temperatura',
      'TIT-403',
      'warning',
      latest.telemetry.temperatura,
      '°C',
      75.0,
      tSlope
    );
  }

  // 5. Coarse P80 spike
  const gSlope = (latest.telemetry.p80Granulometria - prevWindow.telemetry.p80Granulometria) / 3;
  if (latest.telemetry.p80Granulometria >= 115) {
    addOrUpdateAlert(
      'COARSE_P80_SPIKE',
      'p80Granulometria',
      'GIT-405',
      'warning',
      latest.telemetry.p80Granulometria,
      'µm',
      118,
      gSlope
    );
  }

  // 6. Predicted overload risk
  const rSlope = (latest.risk - prevWindow.risk) / 3;
  if (latest.risk >= CRITICAL_RISK_THRESHOLD) {
    addOrUpdateAlert(
      'OVERLOAD_RISK_LIMIT',
      'pressaoMancal',
      'XAI-RISK',
      'critical',
      latest.risk,
      '%',
      CRITICAL_RISK_THRESHOLD,
      rSlope
    );
  }

  return nextAlerts.slice(0, 14);
}

export function projectScenario(
  base: TelemetryData,
  scenario: SimulationScenario
): {
  telemetry: TelemetryData;
  shapValues: ShapDriver[];
  risk: number;
} {
  const feedFactor = 1 + scenario.feedDeltaPct / 100;
  const newFeed = Math.round(base.alimentacao * feedFactor);
  const newWater = Math.round(base.aguaDiluicao + scenario.waterDeltaM3h);
  const newP80 = Math.round(base.p80Granulometria + scenario.p80DeltaUm);

  // Physical approximation: feed delta & P80 delta drive bearing pressure; dilution water relieves viscosity/holdup
  const pressureDelta =
    (newFeed - base.alimentacao) * 0.052 +
    scenario.p80DeltaUm * 0.14 -
    scenario.waterDeltaM3h * 0.075;
  const newPressure = parseFloat(Math.min(Math.max(base.pressaoMancal + pressureDelta, 53.0), 76.0).toFixed(1));

  const powerDelta = (newFeed - base.alimentacao) * 1.35 + scenario.p80DeltaUm * 5.2;
  const newPower = Math.round(Math.min(Math.max(base.potencia + powerDelta, 4050), 5200));

  const newDensity = parseFloat(
    Math.min(Math.max(base.densidadePolpa + scenario.feedDeltaPct * 0.12 - scenario.waterDeltaM3h * 0.09, 61.0), 74.5).toFixed(1)
  );
  const newFilling = parseFloat(
    Math.min(Math.max(base.enchimentoMoinho + pressureDelta * 0.48, 28.0), 43.0).toFixed(1)
  );

  const projectedTelemetry: TelemetryData = {
    ...base,
    alimentacao: newFeed,
    aguaDiluicao: newWater,
    p80Granulometria: newP80,
    pressaoMancal: newPressure,
    potencia: newPower,
    densidadePolpa: newDensity,
    enchimentoMoinho: newFilling,
  };

  const shapValues = computeShapValues(projectedTelemetry);
  const risk = computeRiskFromShap(shapValues);

  return {
    telemetry: projectedTelemetry,
    shapValues,
    risk,
  };
}

export function generateDiagnosticReply(
  query: string,
  lang: Language,
  telemetry: TelemetryData,
  shapValues: ShapDriver[],
  risk: number,
  cursorTime: string
): string {
  const lower = query.toLowerCase();
  const topDriver = shapValues[0];
  const secondDriver = shapValues[1];
  const t = TRANSLATIONS[lang];
  const topName = t.sensors[topDriver.key].name;
  const secondName = t.sensors[secondDriver.key].name;

  if (lang === 'pt') {
    if (lower.includes('risco') || lower.includes('analis') || lower.includes('risk')) {
      return `Probabilidade instantânea de sobrecarga em ${risk}% às ${cursorTime} (teto crítico OT: 75%). O principal vetor de elevação é ${topName} (${topDriver.tag}) com ${topDriver.value >= 0 ? '+' : ''}${topDriver.value.toFixed(1)} pp SHAP, operando em ${telemetry.pressaoMancal.toFixed(1)} bar.`;
    }
    if (lower.includes('causa') || lower.includes('shap') || lower.includes('root')) {
      return `Decomposição Causal XAI (${cursorTime}): 1) ${topName} (${topDriver.tag}): ${topDriver.value >= 0 ? '+' : ''}${topDriver.value.toFixed(1)} pp · 2) ${secondName} (${secondDriver.tag}): ${secondDriver.value >= 0 ? '+' : ''}${secondDriver.value.toFixed(1)} pp · 3) Enchimento aparente do tambor em ${telemetry.enchimentoMoinho.toFixed(1)}% com P80 em ${telemetry.p80Granulometria} µm.`;
    }
    if (lower.includes('sop') || lower.includes('recomend') || lower.includes('ot') || lower.includes('mancal') || lower.includes('pressão')) {
      return `Prescrição SOP-MB04: 1) Modular alimentação WIT-401 em -40 t/h (~5%) por 6 minutos; 2) Incrementar água de diluição FIT-408 em +15 m³/h para favorecer o arraste da polpa (densidade atual ${telemetry.densidadePolpa.toFixed(1)}%); 3) Monitorar recuo de PIT-402 abaixo de 66.0 bar.`;
    }
    if (lower.includes('simul') || lower.includes('15%')) {
      const proj = projectScenario(telemetry, { feedDeltaPct: -15, waterDeltaM3h: 10, p80DeltaUm: 0 });
      return `Simulação -15% carga (+10 m³/h água): Alimentação cai de ${telemetry.alimentacao} para ${proj.telemetry.alimentacao} t/h · Pressão do mancal recua para ~${proj.telemetry.pressaoMancal.toFixed(1)} bar · Risco previsto reduz para ${proj.risk}% (Zona Segura).`;
    }
    if (lower.includes('potência') || lower.includes('potencia') || lower.includes('jit-400') || lower.includes('motor')) {
      return `Diagnóstico Elétrico JIT-400: Motor principal absorvendo ${telemetry.potencia.toLocaleString()} kW a ${telemetry.velocidadeRpm.toFixed(2)} RPM. Torque dentro da faixa nominal (4.200–5.000 kW) sem indício de escorregamento ou travamento de carga.`;
    }
    if (lower.includes('vibra') || lower.includes('temp') || lower.includes('vit-404') || lower.includes('tit-403') || lower.includes('munhão')) {
      return `Saúde Mecânica & Térmica: Vibração no mancal de descarga (VIT-404) em ${telemetry.vibracao.toFixed(2)} mm/s (limite 4.50 mm/s) e óleo de lubrificação (TIT-403) a ${telemetry.temperatura.toFixed(1)} °C (limite 75.0 °C). Filme hidrostático estável.`;
    }
    if (lower.includes('p80') || lower.includes('granulo') || lower.includes('git-405')) {
      return `Granulometria GIT-405: P80 da alimentação em ${telemetry.p80Granulometria} µm (faixa ideal 90–115 µm). Frações acima de 110 µm aumentam o tempo de residência na câmara e pressionam PIT-402.`;
    }
    return `Telemetria às ${cursorTime}: Potência ${telemetry.potencia.toLocaleString()} kW · Alimentação ${telemetry.alimentacao} t/h · Pressão Mancal ${telemetry.pressaoMancal.toFixed(1)} bar · Vibração ${telemetry.vibracao.toFixed(2)} mm/s · Risco XAI ${risk}%.`;
  }

  // English deterministic replies
  if (lower.includes('risk') || lower.includes('analyz')) {
    return `Instantaneous overload probability is ${risk}% at ${cursorTime} (OT critical cap: 75%). Dominant risk driver is ${topName} (${topDriver.tag}) contributing ${topDriver.value >= 0 ? '+' : ''}${topDriver.value.toFixed(1)} pp SHAP at ${telemetry.pressaoMancal.toFixed(1)} bar.`;
  }
  if (lower.includes('root') || lower.includes('cause') || lower.includes('shap')) {
    return `XAI Causal Breakdown (${cursorTime}): 1) ${topName} (${topDriver.tag}): ${topDriver.value >= 0 ? '+' : ''}${topDriver.value.toFixed(1)} pp · 2) ${secondName} (${secondDriver.tag}): ${secondDriver.value >= 0 ? '+' : ''}${secondDriver.value.toFixed(1)} pp · 3) Mill filling at ${telemetry.enchimentoMoinho.toFixed(1)}% with P80 at ${telemetry.p80Granulometria} µm.`;
  }
  if (lower.includes('sop') || lower.includes('recommend') || lower.includes('action') || lower.includes('bearing') || lower.includes('pressure')) {
    return `SOP-MB04 Action Plan: 1) Trim ore feed WIT-401 by -40 t/h (~5%) for 6 minutes; 2) Boost dilution water FIT-408 by +15 m³/h to reduce slurry viscosity (current density ${telemetry.densidadePolpa.toFixed(1)}%); 3) Verify PIT-402 returns below 66.0 bar.`;
  }
  if (lower.includes('simulat') || lower.includes('15%')) {
    const proj = projectScenario(telemetry, { feedDeltaPct: -15, waterDeltaM3h: 10, p80DeltaUm: 0 });
    return `Simulation -15% Feed (+10 m³/h water): Ore feed drops from ${telemetry.alimentacao} to ${proj.telemetry.alimentacao} t/h · Bearing pressure settles to ~${proj.telemetry.pressaoMancal.toFixed(1)} bar · Predicted overload risk drops to ${proj.risk}% (Safe Envelope).`;
  }
  if (lower.includes('power') || lower.includes('motor') || lower.includes('jit-400')) {
    return `Electrical Drive JIT-400: Main synchronous motor drawing ${telemetry.potencia.toLocaleString()} kW at ${telemetry.velocidadeRpm.toFixed(2)} RPM. Torque remains inside nominal envelope (4,200–5,000 kW) with no slip anomaly.`;
  }
  if (lower.includes('vibrat') || lower.includes('temp') || lower.includes('vit-404') || lower.includes('tit-403') || lower.includes('trunnion')) {
    return `Mechanical & Thermal Health: Discharge bearing vibration (VIT-404) at ${telemetry.vibracao.toFixed(2)} mm/s (limit 4.50 mm/s) and lube return oil (TIT-403) at ${telemetry.temperatura.toFixed(1)} °C (limit 75.0 °C). Oil film remains stable.`;
  }
  if (lower.includes('p80') || lower.includes('granul') || lower.includes('git-405') || lower.includes('size')) {
    return `Optical Sizer GIT-405: Feed P80 measured at ${telemetry.p80Granulometria} µm (nominal 90–115 µm). Coarse fractions >110 µm increase chamber residence time and elevate PIT-402 load.`;
  }
  return `Telemetry snapshot at ${cursorTime}: Power ${telemetry.potencia.toLocaleString()} kW · Feed ${telemetry.alimentacao} t/h · Bearing ${telemetry.pressaoMancal.toFixed(1)} bar · Vibration ${telemetry.vibracao.toFixed(2)} mm/s · XAI Risk ${risk}%.`;
}
