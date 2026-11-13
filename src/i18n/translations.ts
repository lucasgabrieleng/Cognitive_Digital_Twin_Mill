import { Language, PredictiveAlert, SubsystemCategory, TelemetryData } from '../types/mill';

export interface TranslationBundle {
  appTitle: string;
  assetPath: string;
  circuitName: string;
  systemNominal: string;
  systemWatch: string;
  systemCritical: string;
  live: string;
  paused: string;
  speedLabel: string;
  snapshotBtn: string;
  reportBtn: string;
  xaiGuideBtn: string;
  themeDark: string;
  themeLight: string;
  headerMetrics: {
    power: string;
    feed: string;
    bearingPressure: string;
    topShap: string;
  };
  subsystems: Record<SubsystemCategory, { label: string; desc: string }>;
  sensors: Record<
    keyof TelemetryData,
    {
      name: string;
      shortName: string;
      pinTitle: string;
      description: string;
    }
  >;
  status: {
    normal: string;
    warning: string;
    critical: string;
  };
  digitalTwin: {
    title: string;
    cursorLabel: string;
    chamberTitle: string;
    clockwise: string;
    xaiOpinionPrefix: string;
    xaiOpinions: {
      normal: string;
      warning: string;
      critical: string;
    };
    fillingLabel: string;
    densityLabel: string;
    waterLabel: string;
    clickPinHint: string;
    inspectingHistory: string;
    returnToLive: string;
  };
  sensorMatrix: {
    title: string;
    subtitle: string;
    nominalRange: string;
    inspectBtn: string;
    clearFilter: string;
    noMatch: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterCritical: string;
    filterWarning: string;
    filterResolved: string;
    emptyTitle: string;
    emptyDesc: string;
    acknowledge: string;
    acknowledged: string;
    resolve: string;
    resolved: string;
    etaPrefix: string;
    etaImmediate: string;
    slopeLabel: string;
    thresholdLabel: string;
    injectTestFault: string;
    clearResolved: string;
    codes: Record<
      PredictiveAlert['code'],
      { title: string; cause: string; action: string }
    >;
  };
  trendChart: {
    title: string;
    subtitle: string;
    riskLabel: string;
    criticalLimit: string;
    warningLimit: string;
    baselineLabel: string;
    scrubbingNote: string;
    liveModeNote: string;
  };
  shapPanel: {
    title: string;
    subtitle: string;
    baselineNote: string;
    riskDriver: string;
    stabilizer: string;
    netSum: string;
    predictedRisk: string;
  };
  simulator: {
    title: string;
    subtitle: string;
    feedSlider: string;
    waterSlider: string;
    p80Slider: string;
    projectedRisk: string;
    projectedPressure: string;
    projectedPower: string;
    projectedDelta: string;
    applyToTwin: string;
    resetSliders: string;
    safeZone: string;
    cautionZone: string;
    overloadZone: string;
  };
  diagnostics: {
    title: string;
    activeEngine: string;
    clearLog: string;
    welcome: string;
    welcomeMeta: string;
    cleared: string;
    inputPlaceholder: string;
    send: string;
    quickPrompts: {
      analyzeRisk: string;
      rootCause: string;
      sopRecommendation: string;
      simulateDrop: string;
    };
  };
  snapshots: {
    title: string;
    empty: string;
    loadToTwin: string;
    exportJson: string;
    exportCsv: string;
    openReport: string;
    deleteSnap: string;
    risk: string;
    power: string;
    feed: string;
    pressure: string;
  };
  report: {
    title: string;
    subtitle: string;
    systemLine: string;
    overloadProb: string;
    alertLimit: string;
    dominantShap: string;
    aboveBaseline: string;
    belowBaseline: string;
    opStatus: string;
    syncedTwin: string;
    telemetryMatrixTitle: string;
    colVariable: string;
    colTag: string;
    colInstant: string;
    colLimits: string;
    colShap: string;
    shapSectionTitle: string;
    summaryTitle: string;
    prescriptionsTitle: string;
    printBtn: string;
    closeBtn: string;
    downloadJsonBtn: string;
  };
  xaiGuide: {
    title: string;
    p1: string;
    p2: string;
    baselineTitle: string;
    baselineDesc: string;
    positiveTitle: string;
    positiveDesc: string;
    negativeTitle: string;
    negativeDesc: string;
    close: string;
  };
  notifications: {
    snapshotSaved: string;
    snapshotRestored: string;
    scenarioApplied: string;
    faultInjected: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    appTitle: 'PRIMARY GRINDING MILL MB-04',
    assetPath: 'Concentrator Plant / Primary Comminution / Mill MB-04',
    circuitName: 'SAG / Ball Mill Circuit MB-04',
    systemNominal: 'NOMINAL OPERATION',
    systemWatch: 'ELEVATED LOAD WATCH',
    systemCritical: 'CRITICAL OVERLOAD ALERT',
    live: 'Live',
    paused: 'Paused',
    speedLabel: 'Rate',
    snapshotBtn: 'Snapshot',
    reportBtn: 'Executive Report',
    xaiGuideBtn: 'XAI Guide',
    themeDark: 'Dark',
    themeLight: 'Light',
    headerMetrics: {
      power: 'Motor Power',
      feed: 'Feed Rate',
      bearingPressure: 'Bearing Pressure',
      topShap: 'Top SHAP Driver',
    },
    subsystems: {
      all: { label: 'All Sensors', desc: 'Complete OT telemetry matrix' },
      electrical: { label: 'Motor Electrical', desc: 'Power, torque draw, efficiency' },
      process: { label: 'Process & Flow', desc: 'Ore feed, dilution water, slurry density' },
      granulometry: { label: 'Granulometry P80', desc: 'Apparent ore hardness, particle size' },
      mechanical: { label: 'Mechanical Health', desc: 'Trunnion vibration, bearing load' },
      thermal: { label: 'Thermal Monitoring', desc: 'Lubrication oil, discharge trunnion' },
    },
    sensors: {
      potencia: {
        name: 'Motor Active Power',
        shortName: 'Motor Power',
        pinTitle: 'Pinion Drive Motor',
        description: 'Main synchronous drive electrical load and torque absorption.',
      },
      alimentacao: {
        name: 'Solid Ore Feed Rate',
        shortName: 'Ore Feed',
        pinTitle: 'Solids Conveyor Feed',
        description: 'Belt weightometer mass flow entering primary feed chute.',
      },
      pressaoMancal: {
        name: 'Hydrostatic Bearing Pressure',
        shortName: 'Bearing Press.',
        pinTitle: 'Hydrostatic Trunnion Bearing',
        description: 'Oil film pressure supporting drum mass and internal charge.',
      },
      vibracao: {
        name: 'Discharge Bearing Vibration',
        shortName: 'Vibration',
        pinTitle: 'Discharge Trunnion',
        description: 'RMS velocity spectrum on discharge bearing housing.',
      },
      temperatura: {
        name: 'Trunnion Oil Temperature',
        shortName: 'Bearing Temp.',
        pinTitle: 'Lube Oil Return',
        description: 'Hydrostatic lubrication return temperature at discharge end.',
      },
      p80Granulometria: {
        name: 'Feed Granulometry (P80)',
        shortName: 'Feed P80',
        pinTitle: 'Online Optical Sizer',
        description: '80% passing particle size indicating ore competency/hardness.',
      },
      densidadePolpa: {
        name: 'Discharge Slurry Density',
        shortName: 'Slurry Density',
        pinTitle: 'Discharge Sump',
        description: 'Solids-to-water mass ratio inside the grinding chamber.',
      },
      enchimentoMoinho: {
        name: 'Apparent Mill Charge Filling',
        shortName: 'Mill Filling',
        pinTitle: 'Load Cell / Acoustic',
        description: 'Estimated volumetric ball + ore occupancy inside cylinder.',
      },
      aguaDiluicao: {
        name: 'Feed Chute Dilution Water',
        shortName: 'Dilution Water',
        pinTitle: 'Injection Manifold',
        description: 'Process water flow regulating pulp viscosity and transport.',
      },
      velocidadeRpm: {
        name: 'Cylinder Rotational Speed',
        shortName: 'Drum Speed',
        pinTitle: 'VFD Drive Encoder',
        description: 'Operating rotational speed (% of critical speed).',
      },
    },
    status: {
      normal: 'NOMINAL',
      warning: 'WARNING',
      critical: 'CRITICAL',
    },
    digitalTwin: {
      title: 'Digital Twin Viewport & Telemetry Hotspots',
      cursorLabel: 'Operational Cursor',
      chamberTitle: 'Grinding Chamber MB-04',
      clockwise: 'Clockwise',
      xaiOpinionPrefix: 'XAI Twin Diagnosis',
      xaiOpinions: {
        normal: 'Balanced charge transport and hydrostatic film margin within OT targets.',
        warning: 'Moderate overload pressure driven by elevated bearing load and coarse ore P80.',
        critical: 'Critical charge buildup detected; immediate feed trim and dilution boost required.',
      },
      fillingLabel: 'Filling',
      densityLabel: 'Pulp Density',
      waterLabel: 'Water',
      clickPinHint: 'Select any hotspot to inspect diagnostics',
      inspectingHistory: 'Inspecting historical timestamp',
      returnToLive: 'Resume Live',
    },
    sensorMatrix: {
      title: 'OT Sensor Telemetry Matrix',
      subtitle: 'Real-time instrumentation with nominal limits and short-term trend sparks',
      nominalRange: 'Nominal',
      inspectBtn: 'Diagnose',
      clearFilter: 'Show All',
      noMatch: 'No sensors match the active subsystem filter.',
    },
    alerts: {
      title: 'Predictive Maintenance & Anomaly Engine',
      subtitle: 'Slope-based threshold forecasting, early bearing protection, and SOP actions',
      filterAll: 'Active',
      filterCritical: 'Critical',
      filterWarning: 'Warning',
      filterResolved: 'Resolved',
      emptyTitle: 'No active predictive alerts',
      emptyDesc: 'All monitored OT channels remain inside predictive safety envelopes.',
      acknowledge: 'Acknowledge',
      acknowledged: 'Ack.',
      resolve: 'Resolve',
      resolved: 'Resolved',
      etaPrefix: 'Est. Time to Limit:',
      etaImmediate: 'Threshold exceeded',
      slopeLabel: 'Trend',
      thresholdLabel: 'Limit',
      injectTestFault: 'Simulate Bearing Spike',
      clearResolved: 'Clear History',
      codes: {
        HIGH_BEARING_PRESSURE: {
          title: 'Hydrostatic Bearing Pressure Drift',
          cause: 'Retained pulp & charge mass elevating oil film pressure toward 72.0 bar OT limit.',
          action: 'Reduce ore feed by 5% and verify HP lubrication pump flow pressure.',
        },
        FEED_OVERLOAD_SURGE: {
          title: 'Primary Feed Rate Surge',
          cause: 'Conveyor tonnage exceeding 870 t/h steady-state grinding capacity.',
          action: 'Throttle apron feeder setpoint by -40 t/h for 6 minutes.',
        },
        VIBRATION_HARMONIC_DRIFT: {
          title: 'Trunnion Vibration Velocity Escalation',
          cause: 'Elevated RMS vibration indicates liner impact or incipient bearing misalignment.',
          action: 'Schedule ultrasonic bearing inspection and verify charge filling < 38%.',
        },
        THERMAL_TRUNNION_RISE: {
          title: 'Lube Oil Thermal Gradient',
          cause: 'Discharge bearing oil temperature trending toward upper thermal boundary.',
          action: 'Inspect oil cooler heat exchanger valve and coolant flow rate.',
        },
        COARSE_P80_SPIKE: {
          title: 'Coarse Ore Competency Shift (P80)',
          cause: 'Harder feed fraction (>112 µm) slowing breakage rate and increasing mill holdup.',
          action: 'Increase dilution water +15 m³/h and trim feed tonnage.',
        },
        OVERLOAD_RISK_LIMIT: {
          title: 'Predicted Mill Overload Risk ≥ 75%',
          cause: 'Combined SHAP attribution from bearing pressure and feed rate breached OT safety cap.',
          action: 'Execute SOP-MB04 immediate load reduction sequence.',
        },
      },
    },
    trendChart: {
      title: 'Overload Risk Trajectory vs. OT Critical Limit (75%)',
      subtitle: 'Hover or click any point on the curve to scrub historical SHAP vectors',
      riskLabel: 'Predicted Risk',
      criticalLimit: 'OT Critical Limit (75%)',
      warningLimit: 'Watch Band (60%)',
      baselineLabel: 'SHAP Baseline (45%)',
      scrubbingNote: 'Historical Scrub Active',
      liveModeNote: 'Live Telemetry Stream',
    },
    shapPanel: {
      title: 'SHAP Causal Decomposition (pp Impact)',
      subtitle: 'Additive risk attribution relative to 45% calibrated baseline',
      baselineNote: 'Baseline: 45%',
      riskDriver: 'Risk Driver (+pp)',
      stabilizer: 'Stabilizer (-pp)',
      netSum: 'Net SHAP Sum',
      predictedRisk: 'Predicted Risk',
    },
    simulator: {
      title: 'What-If Process & Load Simulator',
      subtitle: 'Test feed, dilution water, and ore hardness shifts before applying to control room',
      feedSlider: 'Ore Feed Adjustment',
      waterSlider: 'Dilution Water Delta',
      p80Slider: 'Ore Hardness / P80 Shift',
      projectedRisk: 'Projected Risk',
      projectedPressure: 'Proj. Bearing Press.',
      projectedPower: 'Proj. Motor Power',
      projectedDelta: 'Net Risk Delta',
      applyToTwin: 'Inject Scenario to Twin',
      resetSliders: 'Reset Baseline',
      safeZone: 'Safe Envelope',
      cautionZone: 'Watch Envelope',
      overloadZone: 'Overload Zone',
    },
    diagnostics: {
      title: 'Operational XAI Decision Console',
      activeEngine: 'LOCAL XAI ENGINE',
      clearLog: 'Clear Log',
      welcome:
        'Operational diagnostics ready for Primary Grinding Mill MB-04. Real-time XGBoost + SHAP attribution is synchronized across all sensors. Select a quick query or ask about any tag.',
      welcomeMeta: 'INTEGRATED TELEMETRY · SHAP EXPLAINABILITY ENGINE',
      cleared: 'Diagnostic log reset. Telemetry stream and predictive monitor remain active.',
      inputPlaceholder: "Ask engineering query (e.g. 'how to lower bearing pressure')...",
      send: 'Run',
      quickPrompts: {
        analyzeRisk: 'Analyze Current Risk',
        rootCause: 'SHAP Root Cause',
        sopRecommendation: 'OT SOP Action',
        simulateDrop: 'Simulate -15% Load',
      },
    },
    snapshots: {
      title: 'Operational Snapshots in Memory',
      empty: 'No snapshots recorded yet. Capture a snapshot from the top bar to store telemetry state.',
      loadToTwin: 'Restore to Twin',
      exportJson: 'Export JSON',
      exportCsv: 'Export CSV',
      openReport: 'Report',
      deleteSnap: 'Delete',
      risk: 'Risk',
      power: 'Power',
      feed: 'Feed',
      pressure: 'Press.',
    },
    report: {
      title: 'Industrial Operation & XAI Diagnostic Report',
      subtitle: 'Primary Grinding Mill MB-04 · Comminution & Classification Circuit',
      systemLine: 'Advanced Process Control, Digital Twin & Causal Explainability (SHAP)',
      overloadProb: 'Overload Probability',
      alertLimit: 'OT Alert Limit: 75%',
      dominantShap: 'Dominant SHAP Factor',
      aboveBaseline: 'pp above baseline',
      belowBaseline: 'pp below baseline',
      opStatus: 'Operational Status',
      syncedTwin: 'Synchronized with Digital Twin',
      telemetryMatrixTitle: 'Field Telemetry & OT Nominal Limits Matrix',
      colVariable: 'Process Variable',
      colTag: 'SCADA Tag',
      colInstant: 'Instant Value',
      colLimits: 'OT Nominal Limits',
      colShap: 'SHAP Impact',
      shapSectionTitle: 'SHAP Causal Decomposition (Additive Risk Attribution)',
      summaryTitle: 'Circuit Operating Summary',
      prescriptionsTitle: 'Engineering Prescriptions & Preventive Actions (SOP-MB04)',
      printBtn: 'Print / Save PDF',
      closeBtn: 'Close',
      downloadJsonBtn: 'Download JSON',
    },
    xaiGuide: {
      title: 'XAI Architecture & SHAP Risk Attribution Fundamentals',
      p1: 'This dashboard computes additive Shapley (SHAP) contributions at each telemetry cycle to explain why predicted mill overload probability deviates from steady-state operation.',
      p2: 'Every sensor feature either pushes overload probability upward toward the 75% OT trip ceiling (+pp) or stabilizes the circuit (-pp).',
      baselineTitle: '45% Baseline Calibration',
      baselineDesc: 'Represents nominal steady-state risk under ideal ore competency (P80 ~98 µm) and balanced charge.',
      positiveTitle: 'Positive Attribution (+pp)',
      positiveDesc: 'Indicates retained pulp/charge load (PIT-402), excess tonnage (WIT-401), or coarse rock hardness (GIT-405).',
      negativeTitle: 'Negative Attribution (-pp)',
      negativeDesc: 'Indicates stabilizing headroom in motor torque efficiency (JIT-400) or optimal bearing cooling (TIT-403).',
      close: 'Close Guide',
    },
    notifications: {
      snapshotSaved: 'Snapshot recorded in operational memory',
      snapshotRestored: 'Snapshot state restored to Digital Twin (paused)',
      scenarioApplied: 'Simulated operating scenario injected into Digital Twin',
      faultInjected: 'Bearing pressure surge test injected for predictive alert verification',
    },
  },
  pt: {
    appTitle: 'MOAGEM INDUSTRIAL PRIMÁRIA MB-04',
    assetPath: 'Usina de Concentração / Cominuição Primária / Moinho MB-04',
    circuitName: 'Circuito SAG / Bolas MB-04',
    systemNominal: 'OPERAÇÃO NOMINAL',
    systemWatch: 'VIGILÂNCIA DE CARGA',
    systemCritical: 'ALERTA CRÍTICO DE SOBRECARGA',
    live: 'Ao Vivo',
    paused: 'Pausado',
    speedLabel: 'Taxa',
    snapshotBtn: 'Snapshot',
    reportBtn: 'Relatório Executivo',
    xaiGuideBtn: 'Guia XAI',
    themeDark: 'Escuro',
    themeLight: 'Claro',
    headerMetrics: {
      power: 'Potência Motor',
      feed: 'Taxa Alimentação',
      bearingPressure: 'Pressão Mancal',
      topShap: 'Fator SHAP Dominante',
    },
    subsystems: {
      all: { label: 'Todos Sensores', desc: 'Matriz completa de telemetria OT' },
      electrical: { label: 'Elétrica do Motor', desc: 'Potência, corrente, rendimento' },
      process: { label: 'Processo & Fluxo', desc: 'Alimentação, água, densidade' },
      granulometry: { label: 'Granulometria P80', desc: 'Dureza aparente, finura' },
      mechanical: { label: 'Saúde Mecânica', desc: 'Vibração trunnion, mancais' },
      thermal: { label: 'Monitoramento Térmico', desc: 'Óleo lubrificação, descarga' },
    },
    sensors: {
      potencia: {
        name: 'Potência Elétrica do Motor',
        shortName: 'Potência Motor',
        pinTitle: 'Acionamento do Pinhão',
        description: 'Carga elétrica absorvida pelo motor síncrono principal.',
      },
      alimentacao: {
        name: 'Taxa de Alimentação de Sólidos',
        shortName: 'Alimentação',
        pinTitle: 'Alimentação Sólidos',
        description: 'Vazão mássica na balança integradora da correia primária.',
      },
      pressaoMancal: {
        name: 'Pressão Hidrostática do Mancal',
        shortName: 'Pressão Mancal',
        pinTitle: 'Mancal Hidrostático',
        description: 'Pressão do filme de óleo sustentando a carga do tambor.',
      },
      vibracao: {
        name: 'Vibração do Mancal de Descarga',
        shortName: 'Vibração',
        pinTitle: 'Munhão / Trunnion Descarga',
        description: 'Velocidade vibratória RMS na caixa do mancal de descarga.',
      },
      temperatura: {
        name: 'Temperatura do Óleo do Trunnion',
        shortName: 'Temp. Mancal',
        pinTitle: 'Retorno Lubrificação',
        description: 'Temperatura do óleo lubrificante no mancal de descarga.',
      },
      p80Granulometria: {
        name: 'Granulometria da Alimentação (P80)',
        shortName: 'Granulometria P80',
        pinTitle: 'Analisador Óptico em Linha',
        description: 'Tamanho passante 80% indicando dureza/competência do minério.',
      },
      densidadePolpa: {
        name: 'Densidade da Polpa na Descarga',
        shortName: 'Densidade Polpa',
        pinTitle: 'Caixa de Descarga',
        description: 'Percentual de sólidos em massa no interior da câmara.',
      },
      enchimentoMoinho: {
        name: 'Enchimento Aparente do Moinho',
        shortName: 'Enchimento',
        pinTitle: 'Célula de Carga / Acústica',
        description: 'Volume ocupado por bolas e minério no cilindro.',
      },
      aguaDiluicao: {
        name: 'Água de Diluição na Calha',
        shortName: 'Água Diluição',
        pinTitle: 'Manifold de Injeção',
        description: 'Vazão de água de processo para controle de viscosidade.',
      },
      velocidadeRpm: {
        name: 'Velocidade de Rotação do Tambor',
        shortName: 'Rotação',
        pinTitle: 'Encoder Inversor VFD',
        description: 'Rotação operacional em regime (% da velocidade crítica).',
      },
    },
    status: {
      normal: 'NOMINAL',
      warning: 'ATENÇÃO',
      critical: 'CRÍTICO',
    },
    digitalTwin: {
      title: 'Gêmeo Digital & Pontos de Telemetria',
      cursorLabel: 'Cursor Operacional',
      chamberTitle: 'Câmara de Moagem MB-04',
      clockwise: 'Sentido Horário',
      xaiOpinionPrefix: 'Parecer XAI do Gêmeo',
      xaiOpinions: {
        normal: 'Transporte de carga equilibrado e margem hidrostática dentro dos limites OT.',
        warning: 'Sobrecarga moderada induzida por pressão no mancal e elevação do P80.',
        critical: 'Acúmulo crítico de carga detectado; reduzir alimentação e elevar diluição.',
      },
      fillingLabel: 'Enchimento',
      densityLabel: 'Densidade',
      waterLabel: 'Água',
      clickPinHint: 'Selecione um ponto no moinho para diagnosticar',
      inspectingHistory: 'Inspecionando instante histórico',
      returnToLive: 'Voltar ao Vivo',
    },
    sensorMatrix: {
      title: 'Matriz de Telemetria OT',
      subtitle: 'Instrumentação em tempo real com faixas nominais e tendência instantânea',
      nominalRange: 'Nominal',
      inspectBtn: 'Diagnosticar',
      clearFilter: 'Mostrar Todos',
      noMatch: 'Nenhum sensor corresponde ao subsistema selecionado.',
    },
    alerts: {
      title: 'Manutenção Preditiva & Motor de Anomalias',
      subtitle: 'Previsão de rompimento de limite por inclinação de curva e ações SOP',
      filterAll: 'Ativos',
      filterCritical: 'Críticos',
      filterWarning: 'Atenção',
      filterResolved: 'Resolvidos',
      emptyTitle: 'Nenhum alerta preditivo ativo',
      emptyDesc: 'Todos os canais OT operam dentro dos envelopes de segurança preditivos.',
      acknowledge: 'Reconhecer',
      acknowledged: 'Reconhecido',
      resolve: 'Resolver',
      resolved: 'Resolvido',
      etaPrefix: 'Tempo est. até limite:',
      etaImmediate: 'Limite ultrapassado',
      slopeLabel: 'Taxa',
      thresholdLabel: 'Limite',
      injectTestFault: 'Simular Pico Mancal',
      clearResolved: 'Limpar Histórico',
      codes: {
        HIGH_BEARING_PRESSURE: {
          title: 'Deriva de Pressão no Mancal Hidrostático',
          cause: 'Massa retida de polpa e carga elevando o filme de óleo rumo a 72.0 bar.',
          action: 'Reduzir alimentação em 5% e checar pressão das bombas de alta.',
        },
        FEED_OVERLOAD_SURGE: {
          title: 'Pico na Taxa de Alimentação Primária',
          cause: 'Tonelagem acima de 870 t/h excedendo a capacidade de cominuição.',
          action: 'Reduzir setpoint dos alimentadores em -40 t/h por 6 minutos.',
        },
        VIBRATION_HARMONIC_DRIFT: {
          title: 'Elevação de Vibração no Trunnion',
          cause: 'Velocidade RMS alta sugere impacto de revestimento ou desalinhamento.',
          action: 'Programar inspeção ultrassônica e manter enchimento < 38%.',
        },
        THERMAL_TRUNNION_RISE: {
          title: 'Gradiente Térmico no Óleo de Lubrificação',
          cause: 'Temperatura de retorno do mancal subindo em direção ao teto térmico.',
          action: 'Inspecionar trocador de calor do óleo e vazão de água fria.',
        },
        COARSE_P80_SPIKE: {
          title: 'Alteração de Dureza / P80 Grosso',
          cause: 'Minério mais competente (>112 µm) reduzindo moabilidade e retendo carga.',
          action: 'Elevar água de diluição em +15 m³/h e modular tonelagem.',
        },
        OVERLOAD_RISK_LIMIT: {
          title: 'Risco Predito de Sobrecarga ≥ 75%',
          cause: 'Soma SHAP de pressão do mancal e alimentação rompeu o teto OT.',
          action: 'Executar protocolo imediato de alívio de carga SOP-MB04.',
        },
      },
    },
    trendChart: {
      title: 'Tendência Temporal de Risco de Sobrecarga x Limite OT (75%)',
      subtitle: 'Passe ou clique na curva para sincronizar os vetores SHAP no tempo',
      riskLabel: 'Risco Predito',
      criticalLimit: 'Limite Crítico OT (75%)',
      warningLimit: 'Zona de Vigilância (60%)',
      baselineLabel: 'Baseline SHAP (45%)',
      scrubbingNote: 'Modo Inspeção Histórica',
      liveModeNote: 'Fluxo Contínuo ao Vivo',
    },
    shapPanel: {
      title: 'Decomposição Causal SHAP (Impacto em pp)',
      subtitle: 'Atribuição aditiva de risco relativa à baseline calibrada de 45%',
      baselineNote: 'Baseline: 45%',
      riskDriver: 'Fator de Risco (+pp)',
      stabilizer: 'Atenuante (-pp)',
      netSum: 'Soma SHAP Líquida',
      predictedRisk: 'Risco Predito',
    },
    simulator: {
      title: 'Simulador Interativo de Processo (What-If)',
      subtitle: 'Teste ajustes de carga, água e dureza P80 antes de atuar na sala de controle',
      feedSlider: 'Ajuste na Alimentação',
      waterSlider: 'Delta Água de Diluição',
      p80Slider: 'Desvio Dureza / P80',
      projectedRisk: 'Risco Projetado',
      projectedPressure: 'Pressão Est. Mancal',
      projectedPower: 'Potência Est. Motor',
      projectedDelta: 'Variação de Risco',
      applyToTwin: 'Aplicar Cenário no Gêmeo',
      resetSliders: 'Resetar Baseline',
      safeZone: 'Zona Segura',
      cautionZone: 'Zona de Vigilância',
      overloadZone: 'Zona de Sobrecarga',
    },
    diagnostics: {
      title: 'Console Operacional de Decisão XAI',
      activeEngine: 'MOTOR XAI LOCAL',
      clearLog: 'Limpar Log',
      welcome:
        'Diagnóstico operacional pronto para o Moinho Primário MB-04. Atribuição XGBoost + SHAP sincronizada em tempo real. Selecione uma consulta rápida ou digite um comando técnico.',
      welcomeMeta: 'TELEMETRIA INTEGRADA · MOTOR DE EXPLICABILIDADE SHAP',
      cleared: 'Histórico reiniciado. Telemetria e monitoramento preditivo seguem ativos.',
      inputPlaceholder: "Digite uma dúvida técnica (ex: 'como reduzir pressão do mancal')...",
      send: 'Executar',
      quickPrompts: {
        analyzeRisk: 'Analisar Risco Atual',
        rootCause: 'Causa Raiz SHAP',
        sopRecommendation: 'Recomendação SOP OT',
        simulateDrop: 'Simular -15% Carga',
      },
    },
    snapshots: {
      title: 'Snapshots Operacionais em Memória',
      empty: 'Nenhum snapshot gravado. Capture um snapshot na barra superior para salvar o estado.',
      loadToTwin: 'Carregar no Gêmeo',
      exportJson: 'Exportar JSON',
      exportCsv: 'Exportar CSV',
      openReport: 'Relatório',
      deleteSnap: 'Excluir',
      risk: 'Risco',
      power: 'Potência',
      feed: 'Alim.',
      pressure: 'Pressão',
    },
    report: {
      title: 'Relatório Executivo de Operação & Diagnóstico XAI',
      subtitle: 'Moinho Industrial Primário MB-04 · Circuito de Cominuição e Moagem',
      systemLine: 'Controle Avançado de Processo, Gêmeo Digital & Explicabilidade Causal (SHAP)',
      overloadProb: 'Probabilidade de Sobrecarga',
      alertLimit: 'Limite Alerta OT: 75%',
      dominantShap: 'Fator SHAP Dominante',
      aboveBaseline: 'pp acima da baseline',
      belowBaseline: 'pp abaixo da baseline',
      opStatus: 'Status Operacional',
      syncedTwin: 'Sincronizado com Gêmeo Digital',
      telemetryMatrixTitle: 'Matriz de Telemetria e Limites Nominais OT',
      colVariable: 'Variável de Processo',
      colTag: 'Tag SCADA',
      colInstant: 'Valor Instantâneo',
      colLimits: 'Limites Nominais OT',
      colShap: 'Impacto SHAP',
      shapSectionTitle: 'Decomposição Causal SHAP (Atribuição Aditiva de Risco)',
      summaryTitle: 'Resumo Operacional do Circuito',
      prescriptionsTitle: 'Prescrições de Engenharia & Ações Preventivas (SOP-MB04)',
      printBtn: 'Imprimir / Salvar PDF',
      closeBtn: 'Fechar',
      downloadJsonBtn: 'Baixar JSON',
    },
    xaiGuide: {
      title: 'Fundamentos do Modelo XAI & Atribuição Causal SHAP',
      p1: 'Este painel calcula contribuições aditivas de Shapley (SHAP) a cada ciclo de telemetria para explicar por que a probabilidade de sobrecarga do moinho desvia da condição nominal.',
      p2: 'Cada sensor atua empurrando o risco em direção ao teto operacional de 75% (+pp) ou estabilizando o processo (-pp).',
      baselineTitle: 'Calibração Baseline (45%)',
      baselineDesc: 'Representa o risco nominal de regime permanente sob dureza média (P80 ~98 µm) e carga equilibrada.',
      positiveTitle: 'Contribuição Positiva (+pp)',
      positiveDesc: 'Indica retenção de polpa/carga (PIT-402), excesso de alimentação (WIT-401) ou minério mais grosso (GIT-405).',
      negativeTitle: 'Contribuição Negativa (-pp)',
      negativeDesc: 'Indica folga de torque e eficiência elétrica (JIT-400) ou bom resfriamento do mancal (TIT-403).',
      close: 'Fechar Guia',
    },
    notifications: {
      snapshotSaved: 'Snapshot registrado em memória operacional',
      snapshotRestored: 'Estado do snapshot restaurado no Gêmeo Digital (pausado)',
      scenarioApplied: 'Cenário simulado aplicado ao Gêmeo Digital',
      faultInjected: 'Pico simulado no mancal injetado para validação de alerta preditivo',
    },
  },
};
