import { PageHeader } from '@/components/layout/PageHeader'
import { PageTransition } from '@/components/layout/PageTransition'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import { Callout } from '@/components/ui/Callout'
import { Badge } from '@/components/ui/Badge'
import modelMetricsData from '@/data/modelMetrics.json'
import compScopeData from '@/data/competitionScope.json'

export function ModelTrust() {
  const modelMetrics = modelMetricsData as any
  const evalMetrics = modelMetrics.evaluation || {}
  const expMetrics = modelMetrics.experiments || {}
  const calibBins = evalMetrics.batting_pressure_calibration || []
  const compScope = compScopeData as any

  // RMSE comparison horizontal bar chart
  const rmseChartData = [
    {
      type: 'bar',
      orientation: 'h',
      y: ['2026 Chrono Holdout', '5-Fold OOF Validation'],
      x: [1.8127, 1.8264],
      name: 'Phase Par Baseline',
      marker: { color: 'rgba(255,255,255,0.18)' },
      text: ['1.8127', '1.8264'],
      textposition: 'inside',
      textfont: { family: 'JetBrains Mono', color: '#94A3B8', size: 11 },
    },
    {
      type: 'bar',
      orientation: 'h',
      y: ['2026 Chrono Holdout', '5-Fold OOF Validation'],
      x: [1.7969, 1.8076],
      name: 'Pressure ML Engine',
      marker: { color: '#E83E8C' },
      text: ['1.7969 (-0.87%)', '1.8076 (-1.03%)'],
      textposition: 'inside',
      textfont: { family: 'JetBrains Mono', color: '#FFFFFF', size: 11, weight: 'bold' },
    },
  ]

  const rmseLayout = {
    title: {
      text: 'Expected Runs RMSE Comparison (Lower is Better)',
      font: { family: 'Bebas Neue', size: 18, color: '#F8FAFC' },
    },
    barmode: 'group',
    xaxis: {
      title: 'Root Mean Squared Error (RMSE)',
      range: [1.75, 1.85],
      dtick: 0.02,
      gridcolor: 'rgba(255,255,255,0.06)',
    },
    yaxis: {
      tickfont: { family: 'Source Sans 3', color: '#F8FAFC', size: 12 },
    },
    legend: { orientation: 'h', y: -0.22, x: 0.5, xanchor: 'center' },
  }

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Evidence Layer 02"
        title="MODEL TRUST & REPRODUCIBILITY"
        subtitle="Complete scientific transparency: 200,961 delivery provenance, chronological holdouts, calibration curves, and honest modeling limitations."
      />

      {/* SECTION 1: DATASET PROVENANCE STRIP */}
      <section className="bg-surface p-6 rounded-lg border border-border-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <h3 className="font-display text-xl tracking-wider text-text-primary">
              CERTIFIED DATASET UNIVERSE (2022–2026)
            </h3>
          </div>
          <Badge variant="success">All 36 Consistency Checks Passed</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border-l-2 border-rr-pink pl-4">
            <div className="text-caption text-text-muted">Total Deliveries</div>
            <div className="font-mono text-3xl font-bold text-text-primary mt-1 tabular">200,961</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Strict ball-by-ball ledger</div>
          </div>
          <div className="border-l-2 border-rr-blue pl-4">
            <div className="text-caption text-text-muted">Total Matches</div>
            <div className="font-mono text-3xl font-bold text-text-primary mt-1 tabular">867</div>
            <div className="text-[11px] text-text-secondary mt-0.5">IPL 367 · T20I 470 · Reg. 30</div>
          </div>
          <div className="border-l-2 border-rr-gold pl-4">
            <div className="text-caption text-text-muted">Competitions</div>
            <div className="font-mono text-3xl font-bold text-text-primary mt-1 tabular">134</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Global high-standard leagues</div>
          </div>
          <div className="border-l-2 border-success pl-4">
            <div className="text-caption text-text-muted">Chronological Split</div>
            <div className="font-mono text-xl font-bold text-text-primary mt-2 tabular">168K / 33K</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Train: 2022–25 | Test: 2026</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THREE-STAGE SCIENTIFIC VALIDATION PIPELINE */}
      <section className="bg-surface p-6 rounded-lg border border-border-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="blue">Three-Stage Protocol</Badge>
            <h3 className="font-display text-xl text-text-primary">
              EXPERIMENTAL EVALUATION ARCHITECTURE
            </h3>
          </div>
          <span className="text-caption text-text-muted font-mono">Zero Look-Ahead Leakage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-surface-elevated/50 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rr-pink font-mono uppercase text-[11px]">Stage 1 · Training Set</span>
              <Badge variant="muted">2022–2025</Badge>
            </div>
            <div className="font-mono text-2xl font-bold text-text-primary">167,879 del</div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Historical multi-league delivery base tracking Required Run Rate, wickets remaining, par delta, and phase baselines.
            </p>
          </div>

          <div className="p-4 bg-surface-elevated/50 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rr-blue font-mono uppercase text-[11px]">Stage 2 · 5-Fold OOF CV</span>
              <Badge variant="blue">-1.03% RMSE</Badge>
            </div>
            <div className="font-mono text-2xl font-bold text-text-primary">1.8076 RMSE</div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Grouped 5-fold cross-validation by match (prevents cross-innings data leakage). Baseline 1.8264 vs ML 1.8076 (R² = 0.0164, MAE 1.3735).
            </p>
          </div>

          <div className="p-4 bg-surface-elevated/50 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rr-gold font-mono uppercase text-[11px]">Stage 3 · Chrono Holdout</span>
              <Badge variant="gold">-0.87% RMSE</Badge>
            </div>
            <div className="font-mono text-2xl font-bold text-text-primary">33,082 del (2026)</div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Strict out-of-time chronological test on the 2026 season. Baseline 1.8127 vs ML 1.7969 (R² = 0.0136, MAE 1.3545).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: ML PERFORMANCE & RANK CONCORDANCE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ChartWrapper data={rmseChartData} layout={rmseLayout} height={320} />
        </div>

        <div className="lg:col-span-5 bg-surface p-6 rounded-lg border border-border-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="blue">CONCORDANCE METRICS</Badge>
              <span className="text-caption text-text-muted">Statistical Validation</span>
            </div>
            <h4 className="font-display text-xl text-text-primary mb-3">
              PREDICTIVE RANK STABILITY
            </h4>
            <div className="space-y-3.5">
              <div className="p-3 bg-surface-elevated rounded border border-border-subtle">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-primary">Batting Spearman Correlation</span>
                  <span className="font-mono text-sm font-bold text-success">ρ = 0.824</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  Evaluated across N=218 qualified batters (p = 3.28e-55). High monotone rank stability.
                </div>
              </div>

              <div className="p-3 bg-surface-elevated rounded border border-border-subtle">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-primary">Bowling Spearman Correlation</span>
                  <span className="font-mono text-sm font-bold text-success">ρ = 0.732</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  Evaluated across N=193 qualified bowlers (p = 1.33e-33). Consistent defensive ordering.
                </div>
              </div>

              <div className="p-3 bg-surface-elevated rounded border border-border-subtle">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-primary">Expected Wickets Discrimination</span>
                  <span className="font-mono text-sm font-bold text-rr-blue">ROC AUC = 0.584</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  Brier score: 0.05041. Reliable probability calibration for dismissal odds in clutch phases.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALIBRATION CURVES & TABLE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-surface p-5 rounded-lg border border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display text-lg text-text-primary">
              ML CALIBRATION ARTIFACT
            </h4>
            <span className="text-caption text-text-muted">Actual vs Predicted Runs</span>
          </div>
          <div className="rounded overflow-hidden border border-border-subtle bg-canvas">
            <img
              src="/figures/ml_calibration_curve.png"
              alt="Model Calibration Curve"
              className="w-full h-auto object-contain max-h-[300px] mx-auto"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-6 bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-lg text-text-primary">
                BATTING PRESSURE RESIDUAL CALIBRATION
              </h4>
              <span className="text-caption text-text-muted">5 Calibration Quintiles</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] text-text-muted font-semibold uppercase bg-canvas/40">
                    <th className="py-2 px-3">Bin Range</th>
                    <th className="py-2 px-3 text-right">Deliveries</th>
                    <th className="py-2 px-3 text-right">Actual Mean</th>
                    <th className="py-2 px-3 text-right">Pred Mean</th>
                    <th className="py-2 px-3 text-right">Residual Bias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono tabular">
                  {calibBins.length > 0 ? (
                    calibBins.map((bin: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-elevated/50">
                        <td className="py-2 px-3 font-semibold text-text-primary">{bin.bin_range}</td>
                        <td className="py-2 px-3 text-right text-text-secondary">{bin.n_deliveries?.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">{bin.mean_actual?.toFixed(3)}</td>
                        <td className="py-2 px-3 text-right text-rr-blue">{bin.mean_predicted?.toFixed(3)}</td>
                        <td className="py-2 px-3 text-right">
                          <span className={Math.abs(bin.residual_bias) < 0.08 ? 'text-success' : 'text-warning'}>
                            {bin.residual_bias > 0 ? '+' : ''}{bin.residual_bias?.toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-text-muted">Loading calibration table...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[11px] text-text-secondary mt-3 p-3 bg-surface-elevated/40 rounded border border-border-subtle leading-relaxed">
            <strong className="text-text-primary">Calibration Transparency:</strong> Residual bias remains bounded under 0.10 runs/ball across all quintiles (+0.06 to +0.10 in low/medium pressure; -0.076 in extreme leverage bin 0.8–1.0). This demonstrates well-calibrated expectation surfaces without making unsupported claims of absolute zero bias.
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURE IMPORTANCE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-5 rounded-lg border border-border-subtle">
          <h4 className="font-display text-lg text-text-primary mb-2">
            BATTING FEATURE IMPORTANCE
          </h4>
          <p className="text-caption text-text-secondary mb-3">
            Gini importance confirms Required Run Rate and Death Overs drive 60%+ of predictive split decisions.
          </p>
          <div className="rounded overflow-hidden border border-border-subtle bg-canvas">
            <img
              src="/figures/ml_feature_importance_bat.png"
              alt="Batting Feature Importance"
              className="w-full h-auto object-contain max-h-[300px] mx-auto"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border-subtle">
          <h4 className="font-display text-lg text-text-primary mb-2">
            BOWLING FEATURE IMPORTANCE
          </h4>
          <p className="text-caption text-text-secondary mb-3">
            Wickets in hand and Par Diff dictate bowler pressure responses across matches.
          </p>
          <div className="rounded overflow-hidden border border-border-subtle bg-canvas">
            <img
              src="/figures/ml_feature_importance_bowl.png"
              alt="Bowling Feature Importance"
              className="w-full h-auto object-contain max-h-[300px] mx-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SECTION 6: HONEST LIMITATIONS */}
      <Callout title="HONEST MODELING LIMITATIONS & ASSUMPTIONS" accent="gold">
        <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
          <p>
            <strong className="text-text-primary">1. Why R² ≈ 1.4%–1.6% and ~1% RMSE Reduction is Scientifically Expected:</strong> Single-ball delivery outcomes in T20 cricket are inherently discrete and high-variance (0, 1, 2, 4, 6, W). A run expectation model cannot deterministically forecast whether a batter edges a four or holes out on ball 18.2; its purpose is establishing an unbiased, context-adjusted counterfactual par so that when aggregated over 30 to 350+ deliveries, true player value added (RAAE & RSBE) is cleanly isolated.
          </p>
          <p>
            <strong className="text-text-primary">2. Empirical Bayes Shrinkage (M = 35 balls):</strong> Players with limited sample sizes have their metrics shrunk proportionally toward the empirical population mean. This eliminates small-sample outliers (e.g. batters with 10 balls at 300 SR) while preserving statistical confidence for high-volume performers.
          </p>
          <p>
            <strong className="text-text-primary">3. Global Universe Inclusion (134 Leagues):</strong> While IPL is the gold standard (367 matches analyzed), international T20Is and recognized high-standard franchise leagues provide the requisite sample volume for emerging domestic talent like Sakib Hussain and Ashutosh Sharma.
          </p>
          <p>
            <strong className="text-text-primary">4. Fitness and Acute Form Excluded:</strong> Rankings reflect multi-year historical pressure elevation (2022–2026) and do not model acute injury status or non-cricketing external variables.
          </p>
        </div>
      </Callout>
    </PageTransition>
  )
}
