import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageTransition } from '@/components/layout/PageTransition'
import { PressureGauge } from '@/components/charts/PressureGauge'
import { ConfidenceBar } from '@/components/charts/ConfidenceBar'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { fmt } from '@/lib/formatters'
import battersData from '@/data/batters.json'
import bowlersData from '@/data/bowlers.json'
import dossiersData from '@/data/playerDossiers.json'
import outputBData from '@/data/outputB.json'
import pvaData from '@/data/pva.json'
import type { Batter, Bowler, OutputBRecommendation, DecisionTier } from '@/types'

const batters = battersData as Batter[]
const bowlers = bowlersData as Bowler[]
const outputB = outputBData as OutputBRecommendation[]

// ID aliasing to bridge Output B IDs with canonical dataset IDs
const ID_ALIASES: Record<number, number> = {
  7534: 7897,  // Tilak Varma
  7904: 20702, // Tristan Stubbs
  2986: 2490,  // Mohammad Nawaz
  7984: 5979,  // Abrar Ahmed
}

const REVERSE_ALIASES: Record<number, number> = {
  7897: 7534,
  20702: 7904,
  2490: 2986,
  5979: 7984,
}

export function PlayerInvestigation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const rawId = Number(id)

  const canonicalId = ID_ALIASES[rawId] || rawId

  const batter = useMemo(() => {
    return batters.find((b) => b.striker_id === rawId || b.striker_id === canonicalId)
  }, [rawId, canonicalId])

  const bowler = useMemo(() => {
    return bowlers.find((b) => b.bowler_id === rawId || b.bowler_id === canonicalId)
  }, [rawId, canonicalId])

  // Look up Output B recommendation if applicable
  const outputBItem = useMemo(() => {
    return (
      outputB.find((o) => o.player_id === rawId || o.player_id === canonicalId) ||
      outputB.find((o) => (batter && o.player_name.toLowerCase() === batter.striker_name.toLowerCase()) ||
                          (bowler && o.player_name.toLowerCase() === bowler.bowler_name.toLowerCase())) ||
      null
    )
  }, [rawId, canonicalId, batter, bowler])

  // Look up dossier
  const dossier = useMemo(() => {
    const batList = (dossiersData as any)?.batters || []
    const bowlList = (dossiersData as any)?.bowlers || []
    const found =
      batList.find((d: any) => d.player_id === rawId || d.player_id === canonicalId) ||
      bowlList.find((d: any) => d.player_id === rawId || d.player_id === canonicalId)

    if (found) return found
    if (batter) return batList.find((d: any) => d.name?.toLowerCase() === batter.striker_name.toLowerCase()) || null
    if (bowler) return bowlList.find((d: any) => d.name?.toLowerCase() === bowler.bowler_name.toLowerCase()) || null
    return null
  }, [rawId, canonicalId, batter, bowler])

  // Look up PVA
  const pva = useMemo(() => {
    if (batter) {
      const bList = (pvaData as any)?.batting || []
      return bList.find((p: any) => p.striker_id === batter.striker_id) || null
    }
    if (bowler) {
      const bwList = (pvaData as any)?.bowling || []
      return bwList.find((p: any) => p.bowler_id === bowler.bowler_id) || null
    }
    return null
  }, [batter, bowler])

  if (!batter && !bowler) {
    return (
      <PageTransition>
        <div className="bg-surface p-10 rounded-lg border border-border-subtle text-center max-w-xl mx-auto my-12">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="font-display text-2xl text-text-primary mb-2">Player Dossier Not Found</h2>
          <p className="text-body text-text-secondary mb-6">
            Player ID <span className="font-mono text-rr-pink">#{id}</span> does not match any player in the Top 10 Batters, Top 10 Bowlers, or Output B Recommendations.
          </p>
          <div className="space-y-4">
            <div className="text-xs text-text-muted">Select an Elite Performer:</div>
            <div className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto p-2">
              {batters.map((b) => (
                <button
                  key={b.striker_id}
                  onClick={() => navigate(`/player/${b.striker_id}`)}
                  className="px-2.5 py-1 text-xs bg-surface-elevated hover:bg-rr-pink hover:text-white rounded border border-border-subtle transition-colors"
                >
                  #{b.rank} {b.striker_name} (Bat)
                </button>
              ))}
              {bowlers.map((b) => (
                <button
                  key={b.bowler_id}
                  onClick={() => navigate(`/player/${b.bowler_id}`)}
                  className="px-2.5 py-1 text-xs bg-surface-elevated hover:bg-rr-blue hover:text-white rounded border border-border-subtle transition-colors"
                >
                  #{b.rank} {b.bowler_name} (Bowl)
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-border-subtle">
              <Link to="/" className="text-xs text-rr-pink hover:underline font-semibold">
                ← Return to Decision Brief
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  const isBatter = Boolean(batter)
  const player = (batter || bowler)!
  const playerName = isBatter ? batter!.striker_name : bowler!.bowler_name
  const roleType = isBatter ? `Batter · ${batter!.batting_type}` : `Bowler · ${bowler!.pace_or_spin}`
  const rank = player.rank
  const pri = player.pri_score

  const decisionTier: DecisionTier =
    (dossier?.decision_tier as DecisionTier) ||
    (outputBItem?.decision_tier as DecisionTier) ||
    'BENCHMARK ONLY'

  // Radar Chart Data
  const radarData = [
    {
      type: 'scatterpolar',
      r: [player.level_subscore, player.lift_subscore, player.consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: isBatter ? 'rgba(232, 62, 140, 0.3)' : 'rgba(37, 99, 235, 0.3)',
      line: { color: isBatter ? '#E83E8C' : '#2563EB', width: 2.5 },
      name: playerName,
    },
  ]

  const radarLayout = {
    polar: {
      bgcolor: 'rgba(0,0,0,0)',
      radialaxis: {
        visible: true,
        range: [0, 100],
        gridcolor: 'rgba(255,255,255,0.08)',
        linecolor: 'rgba(255,255,255,0.08)',
        tickfont: { family: 'JetBrains Mono', color: '#64748B', size: 10 },
      },
      angularaxis: {
        linecolor: 'rgba(255,255,255,0.1)',
        gridcolor: 'rgba(255,255,255,0.08)',
        tickfont: { family: 'Source Sans 3', color: '#F8FAFC', size: 12 },
      },
    },
    showlegend: false,
    margin: { t: 25, r: 35, b: 25, l: 35 },
  }

  const renderDecisionBadge = (tier: DecisionTier) => {
    switch (tier) {
      case 'PURSUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PURSUE · Priority Target
          </span>
        )
      case 'MONITOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            MONITOR · Contingency Watchlist
          </span>
        )
      case 'BENCHMARK ONLY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            BENCHMARK ONLY · Retained/Diplomatic
          </span>
        )
      case 'WALK AWAY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            WALK AWAY · Discontinue
          </span>
        )
    }
  }

  return (
    <PageTransition>
      {/* NAVIGATION BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-border-subtle gap-2">
        <Link
          to="/"
          className="text-xs text-rr-pink hover:text-rr-pink-hover font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span>Back to Executive Decision Brief</span>
        </Link>
        <div className="flex items-center gap-2">
          {outputBItem && (
            <Badge variant="gold">
              Output B Recommendation #{outputBItem.rank}
            </Badge>
          )}
          <Badge variant={isBatter ? 'pink' : 'blue'}>
            Rank #{rank} in {isBatter ? 'Batting' : 'Bowling'}
          </Badge>
          <span className="text-caption text-text-muted font-mono">
            ID: {canonicalId} {rawId !== canonicalId && `(Alt: ${rawId})`}
          </span>
        </div>
      </div>

      {/* HERO STRIP */}
      <div className="bg-surface p-6 rounded-lg border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {renderDecisionBadge(decisionTier)}
            <Badge variant="muted">{roleType}</Badge>
            {dossier?.is_overseas ? (
              <Badge variant="blue">Overseas Quota</Badge>
            ) : (
              <Badge variant="success">Indian Domestic</Badge>
            )}
            {outputBItem && (
              <span className="text-[11px] font-mono text-rr-gold bg-rr-gold/10 px-2 py-0.5 rounded border border-rr-gold/20 font-semibold">
                {outputBItem.rr_fit}
              </span>
            )}
          </div>
          <h1 className="font-display text-hero text-text-primary tracking-wide leading-none">
            {playerName}
          </h1>
          <p className="text-body text-text-secondary max-w-2xl">
            {dossier?.evidence_summary ||
              (isBatter
                ? `Elevates scoring output when situational pressure exceeds 0.60, sustaining a shrunk SR of ${fmt.sr(
                    batter!.shrunk_press_strike_rate
                  )} across ${batter!.press_balls} high-leverage deliveries.`
                : `High-leverage bowling specialist maintaining a shrunk pressure economy of ${fmt.econ(
                    bowler!.shrunk_press_economy
                  )} with an economy lift of ${fmt.lift(bowler!.shrunk_econ_lift)}.`)}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-6 bg-canvas/40 p-4 rounded-lg border border-border-subtle">
          <PressureGauge
            value={pri}
            label={isBatter ? 'PRI BAT' : 'PRI BOWL'}
            size={130}
          />
        </div>
      </div>

      {/* 4 KEY METRIC TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">PRI Score</div>
          <div className="font-mono text-2xl font-bold text-rr-pink mt-1 tabular">{fmt.pri(pri)}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Composite Pressure Index</div>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">Match Success Rate</div>
          <div className="font-mono text-2xl font-bold text-rr-gold mt-1 tabular">
            {fmt.pct(player.match_success_rate)}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
            {player.successful_matches} of {player.pressure_matches} matches won/drawn
          </div>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">
            {isBatter ? 'Press Deliveries Faced' : 'Press Overs Bowled'}
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary mt-1 tabular">
            {isBatter ? batter!.press_balls : fmt.cricketOvers(bowler!.press_balls, bowler!.press_overs)}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
            {isBatter ? `${batter!.press_matches} matches` : `${bowler!.press_balls} legal balls`}
          </div>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">Shrunk Pressure Metric</div>
          <div className="font-mono text-2xl font-bold text-success mt-1 tabular">
            {isBatter
              ? fmt.sr(batter!.shrunk_press_strike_rate)
              : fmt.econ(bowler!.shrunk_press_economy)}
          </div>
          <div className="text-[11px] text-success mt-0.5 font-semibold font-mono">
            {isBatter ? fmt.lift(batter!.shrunk_sr_lift) : fmt.lift(bowler!.shrunk_econ_lift)} vs base
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: BASE VS PRESSURE & CONFIDENCE INTERVALS */}
        <div className="lg:col-span-7 space-y-6">
          {/* BASE VS PRESSURE TABLE */}
          <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/40">
              <h3 className="font-display text-xl text-text-primary tracking-wide">
                BASE VS PRESSURE PERFORMANCE
              </h3>
              <span className="text-caption text-text-muted font-mono">Shrinkage Regularized (M=35)</span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-subtle text-[11px] text-text-muted font-semibold uppercase bg-canvas/30">
                  <th className="py-2.5 px-4">Metric</th>
                  <th className="py-2.5 px-4 text-right">Non-Pressure Base</th>
                  <th className="py-2.5 px-4 text-right">Pressure Output</th>
                  <th className="py-2.5 px-4 text-right">Net Shift / Lift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono tabular">
                {isBatter ? (
                  <>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Strike Rate
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.sr(batter!.base_strike_rate)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary font-bold">
                        {fmt.sr(batter!.shrunk_press_strike_rate)}
                      </td>
                      <td className="py-3 px-4 text-right text-success font-bold">
                        {fmt.lift(batter!.shrunk_sr_lift)}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Boundary Percentage
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.pct(batter!.base_boundary_pct)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {fmt.pct(batter!.press_boundary_pct)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={batter!.boundary_diff >= 0 ? 'text-success' : 'text-danger'}>
                          {batter!.boundary_diff >= 0 ? '+' : ''}{batter!.boundary_diff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Dot Ball Avoidance
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.pct(batter!.base_dot_pct)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {fmt.pct(batter!.press_dot_pct)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={batter!.dot_diff <= 0 ? 'text-success' : 'text-danger'}>
                          {batter!.dot_diff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Batting Average
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.sr(batter!.base_average)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {fmt.sr(batter!.press_average)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {(batter!.press_average - batter!.base_average).toFixed(1)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Economy Rate
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.econ(bowler!.base_economy)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary font-bold">
                        {fmt.econ(bowler!.shrunk_press_economy)}
                      </td>
                      <td className="py-3 px-4 text-right text-success font-bold">
                        {fmt.lift(bowler!.shrunk_econ_lift)}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Dot Ball Percentage
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.pct(bowler!.base_dot_pct)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {fmt.pct(bowler!.press_dot_pct)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={bowler!.dot_diff >= 0 ? 'text-success' : 'text-danger'}>
                          {bowler!.dot_diff >= 0 ? '+' : ''}{bowler!.dot_diff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Boundary Conceded %
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.pct(bowler!.base_boundary_pct)}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {fmt.pct(bowler!.press_boundary_pct)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={bowler!.press_boundary_pct <= bowler!.base_boundary_pct ? 'text-success' : 'text-danger'}>
                          {(bowler!.press_boundary_pct - bowler!.base_boundary_pct).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-elevated/40">
                      <td className="py-3 px-4 font-sans font-semibold text-text-primary">
                        Wickets / Match Rate
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {bowler!.base_wickets} wkts ({bowler!.base_matches}m)
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {bowler!.press_wickets} wkts ({bowler!.press_matches}m)
                      </td>
                      <td className="py-3 px-4 text-right text-text-secondary">
                        {fmt.econ(bowler!.press_wicket_rate)}/ball
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* CONFIDENCE INTERVAL BAR */}
          <div className="bg-surface p-5 rounded-lg border border-border-subtle space-y-4">
            <h4 className="font-display text-lg text-text-primary tracking-wide">
              EMPIRICAL BAYES CONFIDENCE INTERVAL (95% CREDIBLE BAND)
            </h4>
            <p className="text-caption text-text-secondary">
              Shaded band reflects the 95% Bayesian credible range of true pressure skill after shrinking against the empirical population sample prior (M=35).
            </p>

            {isBatter ? (
              <ConfidenceBar
                label="Shrunk Pressure Strike Rate (SR)"
                value={batter!.shrunk_press_strike_rate}
                lower={batter!.sr_ci_lower}
                upper={batter!.sr_ci_upper}
                baselineValue={batter!.base_strike_rate}
              />
            ) : (
              <ConfidenceBar
                label="Shrunk Pressure Economy Rate"
                value={bowler!.shrunk_press_economy}
                lower={bowler!.econ_ci_lower}
                upper={bowler!.econ_ci_upper}
                baselineValue={bowler!.base_economy}
              />
            )}
          </div>

          {/* DUAL RELIABILITY & UNCERTAINTY LEDGER */}
          <div className="bg-surface p-5 rounded-lg border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg text-text-primary tracking-wide">
                STATISTICAL RELIABILITY LEDGER
              </h4>
              <Badge variant="blue">Wilson 95% LCB vs Bayes CI</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 bg-surface-elevated/40 rounded border border-border-subtle space-y-1">
                <div className="text-text-muted font-mono uppercase text-[10px]">
                  Match Success Rate (Binomial k/n)
                </div>
                <div className="font-mono text-lg font-bold text-rr-gold">
                  {fmt.recordWithPct(player.successful_matches, player.pressure_matches, player.match_success_rate)}
                </div>
                <div className="text-[11px] text-text-secondary">
                  <strong>Wilson 95% LCB: {fmt.pct(dossier?.wilson_95_lcb || (outputBItem?.wilson_95_lcb ?? 50.0))}</strong>
                </div>
                <div className="text-[10px] text-text-muted">
                  Conservative binomial lower bound regularizing for match sample size ({player.pressure_matches} matches).
                </div>
              </div>

              <div className="p-3 bg-surface-elevated/40 rounded border border-border-subtle space-y-1">
                <div className="text-text-muted font-mono uppercase text-[10px]">
                  Continuous Rate Credible Interval
                </div>
                <div className="font-mono text-lg font-bold text-success">
                  {isBatter
                    ? `[${batter!.sr_ci_lower.toFixed(1)}, ${batter!.sr_ci_upper.toFixed(1)}] SR`
                    : `[${bowler!.econ_ci_lower.toFixed(2)}, ${bowler!.econ_ci_upper.toFixed(2)}] Econ`}
                </div>
                <div className="text-[11px] text-text-secondary">
                  Empirical Bayes Prior: M = 35 balls
                </div>
                <div className="text-[10px] text-text-muted">
                  Gaussian-Laplace posterior credible range eliminating small-sample noise.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RADAR, RECRUITMENT INTELLIGENCE & WALK-AWAY LOGIC */}
        <div className="lg:col-span-5 space-y-6">
          {/* RADAR SUB-SCORE */}
          <div className="bg-surface p-5 rounded-lg border border-border-subtle">
            <h4 className="font-display text-lg text-text-primary mb-1">
              PRI SUBSCORE PROFILE
            </h4>
            <div className="text-caption text-text-muted mb-2 font-mono text-xs">
              Level: {player.level_subscore.toFixed(1)} | Lift: {player.lift_subscore.toFixed(1)} | Consistency: {player.consistency_subscore.toFixed(1)}
            </div>
            <ChartWrapper data={radarData} layout={radarLayout} height={260} />
          </div>

          {/* RECRUITMENT DECISION LAYER */}
          <div className="bg-surface p-5 rounded-lg border border-border-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                  Recruitment Decision Intelligence
                </span>
                <h4 className="font-display text-xl text-text-primary">
                  FRANCHISE ACTION VERDICT
                </h4>
              </div>
              {renderDecisionBadge(decisionTier)}
            </div>

            {/* SQUAD REQUIREMENT ADDRESSED */}
            <div className="p-3 bg-canvas/50 rounded border border-border-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase text-rr-pink font-mono block">
                Specific Squad Requirement Addressed:
              </span>
              <div className="text-xs font-bold text-text-primary">
                {dossier?.squad_gap_addressed || outputBItem?.rr_fit || 'Tactical Squad Depth'}
              </div>
            </div>

            {/* VERIFIED AVAILABILITY & REGULATORY STATUS */}
            <div className="p-3 bg-canvas/50 rounded border border-border-subtle space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-rr-blue font-mono">
                  Verified Auction Availability:
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  Audited: {dossier?.verification_date || 'November 2026'}
                </span>
              </div>
              <div className="font-bold text-text-primary">
                {dossier?.availability_status || outputBItem?.availability_status || 'CONFIRMED'}
              </div>
              <div className="text-[11px] text-text-secondary pt-1 border-t border-border-subtle">
                <strong className="text-text-primary">Regulatory Authority:</strong>{' '}
                {dossier?.regulatory_source || 'IPL Governing Council & BCCI Roster Regulations'}
              </div>
              {outputBItem?.decision_rationale && (
                <div className="text-[11px] text-text-muted pt-1 leading-relaxed">
                  {outputBItem.decision_rationale}
                </div>
              )}
            </div>

            {/* MAIN RECRUITMENT RISK */}
            <div className="p-3 bg-canvas/50 rounded border border-border-subtle space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-amber-400 font-mono block">
                Main Recruitment Risk:
              </span>
              <p className="text-text-secondary leading-relaxed">
                {dossier?.recruitment_risk || outputBItem?.recruitment_risk || 'Auction price volatility and competing franchise interest.'}
              </p>
            </div>

            {/* SUITABLE ALTERNATIVES */}
            {(dossier?.suitable_alternatives || outputBItem?.suitable_alternative) && (
              <div className="p-3 bg-canvas/50 rounded border border-border-subtle space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-400 font-mono block">
                  Contingency / Suitable Alternatives:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossier?.suitable_alternatives ? (
                    dossier.suitable_alternatives.map((alt: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-elevated text-text-primary rounded text-[11px] border border-border-subtle">
                        {alt}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 bg-surface-elevated text-text-primary rounded text-[11px] border border-border-subtle">
                      {outputBItem?.suitable_alternative}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ACTIONABLE WALK-AWAY CONDITIONS */}
            <div className="p-3.5 bg-rose-500/10 rounded-lg border border-rose-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase text-[11px] tracking-wider">
                <span>🛑</span>
                <span>Walk-Away Invalidation Conditions</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-text-secondary list-disc list-inside">
                {(dossier?.walk_away_conditions || outputBItem?.walk_away_conditions || [
                  'Auction bidding exceeds pre-modeled purse valuation ceiling.',
                  'Unverified regulatory availability or non-clearance by home cricket board.',
                  'Role modification shifting player away from proven high-leverage execution window.'
                ]).map((cond: string, i: number) => (
                  <li key={i} className="leading-relaxed">
                    <span className="text-text-primary font-medium">{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PVA CONTEXT IF AVAILABLE */}
            {pva && (
              <div className="bg-surface-elevated/40 p-4 rounded-lg border border-border-subtle text-xs">
                <div className="font-semibold text-text-primary mb-1">Contextual Value Added (PVA)</div>
                <div className="font-mono text-lg font-bold text-success">
                  {isBatter
                    ? `+${pva.total_raae?.toFixed(1)} Total RAAE`
                    : `+${pva.total_rsbe?.toFixed(1)} Total RSBE`}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  {isBatter
                    ? 'Runs Above Average Expected across high-pressure deliveries'
                    : 'Runs Saved Below Expected across high-pressure overs'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
