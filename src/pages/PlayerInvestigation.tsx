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
import pvaData from '@/data/pva.json'
import type { Batter, Bowler } from '@/types'

const batters = battersData as Batter[]
const bowlers = bowlersData as Bowler[]

export function PlayerInvestigation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const playerId = Number(id)

  const batter = useMemo(() => batters.find((b) => b.striker_id === playerId), [playerId])
  const bowler = useMemo(() => bowlers.find((b) => b.bowler_id === playerId), [playerId])

  // Look up dossier
  const dossier = useMemo(() => {
    const batList = (dossiersData as any)?.batters || []
    const bowlList = (dossiersData as any)?.bowlers || []
    return (
      batList.find((d: any) => d.player_id === playerId) ||
      bowlList.find((d: any) => d.player_id === playerId) ||
      null
    )
  }, [playerId])

  // Look up PVA
  const pva = useMemo(() => {
    if (batter) {
      const bList = (pvaData as any)?.batting || []
      return bList.find((p: any) => p.striker_id === playerId) || null
    }
    if (bowler) {
      const bwList = (pvaData as any)?.bowling || []
      return bwList.find((p: any) => p.bowler_id === playerId) || null
    }
    return null
  }, [batter, bowler, playerId])

  if (!batter && !bowler) {
    return (
      <PageTransition>
        <div className="bg-surface p-10 rounded-lg border border-border-subtle text-center max-w-xl mx-auto my-12">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="font-display text-2xl text-text-primary mb-2">Player Dossier Not Found</h2>
          <p className="text-body text-text-secondary mb-6">
            Player ID <span className="font-mono text-rr-pink">#{id}</span> does not match any player in the Top 10 Batters or Top 10 Bowlers.
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

  return (
    <PageTransition>
      {/* NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <Link
          to="/"
          className="text-xs text-rr-pink hover:text-rr-pink-hover font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span>Back to Executive Decision Brief</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={isBatter ? 'pink' : 'blue'}>
            Rank #{rank} in {isBatter ? 'Batting' : 'Bowling'}
          </Badge>
          <span className="text-caption text-text-muted font-mono">ID: {playerId}</span>
        </div>
      </div>

      {/* HERO STRIP */}
      <div className="bg-surface p-6 rounded-lg border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="muted">{roleType}</Badge>
            {dossier?.category && <Badge variant="gold">{dossier.category}</Badge>}
            {dossier?.is_overseas ? (
              <Badge variant="blue">Overseas</Badge>
            ) : (
              <Badge variant="success">Indian Domestic</Badge>
            )}
          </div>
          <h1 className="font-display text-hero text-text-primary tracking-wide leading-none">
            {playerName}
          </h1>
          <p className="text-body text-text-secondary mt-2 max-w-2xl">
            {isBatter
              ? `Demonstrates significant scoring elevation when situational pressure exceeds 0.60, sustaining a shrunk SR of ${fmt.sr(
                  batter!.shrunk_press_strike_rate
                )} across ${batter!.press_balls} high-leverage deliveries.`
              : `High-leverage bowling specialist maintaining a shrunk pressure economy of ${fmt.econ(
                  bowler!.shrunk_press_economy
                )} with an economy lift of ${fmt.lift(bowler!.shrunk_econ_lift)}.`}
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
            {fmt.pct(player.match_success_rate * 100)}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">
            {player.successful_matches} of {player.pressure_matches} matches won/drawn
          </div>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">
            {isBatter ? 'Press Deliveries Faced' : 'Press Overs Bowled'}
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary mt-1 tabular">
            {isBatter ? batter!.press_balls : bowler!.press_overs.toFixed(1)}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">Under P_sit ≥ 0.60</div>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border-subtle">
          <div className="text-caption text-text-muted">Shrunk Pressure Metric</div>
          <div className="font-mono text-2xl font-bold text-success mt-1 tabular">
            {isBatter
              ? fmt.sr(batter!.shrunk_press_strike_rate)
              : fmt.econ(bowler!.shrunk_press_economy)}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">
            {isBatter ? 'Shrunk Strike Rate' : 'Shrunk Economy Rate'}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: BASE VS PRESSURE & CONFIDENCE */}
        <div className="lg:col-span-7 space-y-6">
          {/* BASE VS PRESSURE TABLE */}
          <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/40">
              <h3 className="font-display text-xl text-text-primary tracking-wide">
                BASE VS PRESSURE PERFORMANCE
              </h3>
              <span className="text-caption text-text-muted">Shrinkage Regularized</span>
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
                        {bowler!.base_wickets} wkts
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary">
                        {bowler!.press_wickets} wkts
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
              EMPIRICAL BAYES CONFIDENCE INTERVAL (95%)
            </h4>
            <p className="text-caption text-text-secondary">
              Shaded band reflects the 95% credible range of true pressure skill after shrinking against population sample prior (M=45).
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
        </div>

        {/* RIGHT COLUMN: RADAR & SQUAD FIT */}
        <div className="lg:col-span-5 space-y-6">
          {/* RADAR SUB-SCORE */}
          <div className="bg-surface p-5 rounded-lg border border-border-subtle">
            <h4 className="font-display text-lg text-text-primary mb-1">
              PRI SUBSCORE PROFILE
            </h4>
            <div className="text-caption text-text-muted mb-2">
              Level: {player.level_subscore.toFixed(1)} | Lift: {player.lift_subscore.toFixed(1)} | Consistency: {player.consistency_subscore.toFixed(1)}
            </div>
            <ChartWrapper data={radarData} layout={radarLayout} height={280} />
          </div>

          {/* SQUAD FIT CARD */}
          {dossier?.squad_fit ? (
            <div className="bg-surface p-5 rounded-lg border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="gold">{dossier.squad_fit.status}</Badge>
                <div className="font-mono text-sm font-bold text-rr-pink">
                  Fit Score: {dossier.squad_fit.fit_score}/100
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted block">
                  Gap Addressed:
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {dossier.squad_fit.gap_addressed || 'General Pressure Depth'}
                </span>
              </div>
              <p className="text-caption text-text-secondary leading-relaxed bg-canvas/40 p-3 rounded border border-border-subtle">
                {dossier.squad_fit.tactical_rationale}
              </p>
            </div>
          ) : (
            <Callout title="TACTICAL BENCHMARK CONTEXT" accent="blue">
              This player serves as a critical competition benchmark for high-leverage execution. Their statistical elevation under P_sit ≥ 0.60 validates our expectation models against premier international opposition.
            </Callout>
          )}

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
                  ? 'Runs Above Average Expected across pressure balls'
                  : 'Runs Saved Below Expected across pressure overs'}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
