import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageTransition } from '@/components/layout/PageTransition'
import { PressureGauge } from '@/components/charts/PressureGauge'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { fmt } from '@/lib/formatters'
import battersData from '@/data/batters.json'
import bowlersData from '@/data/bowlers.json'
import outputBData from '@/data/outputB.json'
import type { Batter, Bowler, OutputBRecommendation } from '@/types'

const batters = battersData as Batter[]
const bowlers = bowlersData as Bowler[]
const outputB = outputBData as OutputBRecommendation[]

export function ExecutiveBrief() {
  const navigate = useNavigate()
  const [selectedDiscipline, setSelectedDiscipline] = useState<'output_b' | 'both' | 'bat' | 'bowl'>('output_b')

  const topBatter = batters[0]
  const topBowler = bowlers[0]

  // Radar traces for top batters vs top bowler
  const radarData = [
    {
      type: 'scatterpolar',
      r: [topBatter.level_subscore, topBatter.lift_subscore, topBatter.consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(232, 62, 140, 0.25)',
      line: { color: '#E83E8C', width: 2.5 },
      name: `#1 Bat: ${topBatter.striker_name}`,
    },
    {
      type: 'scatterpolar',
      r: [batters[3].level_subscore, batters[3].lift_subscore, batters[3].consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(251, 191, 36, 0.15)',
      line: { color: '#FBBF24', width: 1.5, dash: 'dash' },
      name: `#4 Bat: ${batters[3].striker_name} (Priority #1)`,
    },
    {
      type: 'scatterpolar',
      r: [topBowler.level_subscore, topBowler.lift_subscore, topBowler.consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(37, 99, 235, 0.2)',
      line: { color: '#2563EB', width: 2.5 },
      name: `#1 Bowl: ${topBowler.bowler_name}`,
    },
  ]

  const radarLayout = {
    polar: {
      bgcolor: 'rgba(0,0,0,0)',
      radialaxis: {
        visible: true,
        range: [40, 100],
        gridcolor: 'rgba(255,255,255,0.08)',
        linecolor: 'rgba(255,255,255,0.08)',
        tickfont: { family: 'JetBrains Mono', color: '#64748B', size: 10 },
      },
      angularaxis: {
        linecolor: 'rgba(255,255,255,0.1)',
        gridcolor: 'rgba(255,255,255,0.08)',
        tickfont: { family: 'Source Sans 3', color: '#F8FAFC', size: 12, weight: 600 },
      },
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.15,
      font: { color: '#94A3B8', size: 11 },
    },
    margin: { t: 25, r: 35, b: 65, l: 35 },
  }

  const renderDecisionBadge = (tier: string) => {
    switch (tier) {
      case 'PURSUE':
        return <Badge variant="success">PURSUE</Badge>
      case 'MONITOR':
        return <Badge variant="gold">MONITOR</Badge>
      case 'BENCHMARK ONLY':
        return <Badge variant="blue">BENCHMARK ONLY</Badge>
      case 'WALK AWAY':
        return <Badge variant="pink">WALK AWAY</Badge>
      default:
        return <Badge variant="muted">{tier}</Badge>
    }
  }

  return (
    <PageTransition>
      <PageHeader
        eyebrow="SupeRR Selector Season 2 · Round 1 Submission"
        title="EXECUTIVE DECISION BRIEF"
        subtitle="Independent Top 10 rankings and definitive Output B recruitment recommendations under situational pressure (P_sit ≥ 0.60)."
        actions={
          <div className="flex flex-wrap items-center gap-1.5 bg-surface p-1 rounded-lg border border-border-subtle">
            <button
              onClick={() => setSelectedDiscipline('output_b')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                selectedDiscipline === 'output_b'
                  ? 'bg-gradient-to-r from-rr-pink to-rr-blue text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span>⭐</span>
              <span>Final 10 Recommendations</span>
            </button>
            <button
              onClick={() => setSelectedDiscipline('both')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'both' ? 'bg-rr-pink text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              All 20 Evaluated
            </button>
            <button
              onClick={() => setSelectedDiscipline('bat')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'bat' ? 'bg-rr-pink text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Top 10 Batters
            </button>
            <button
              onClick={() => setSelectedDiscipline('bowl')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'bowl' ? 'bg-rr-blue text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Top 10 Bowlers
            </button>
          </div>
        }
      />

      {/* VERDICT STRIP — #1 Batter & #1 Bowler */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* #1 BATTER SPOTLIGHT */}
        <div
          onClick={() => navigate(`/player/${topBatter.striker_id}`)}
          className="group cursor-pointer bg-gradient-to-br from-surface via-surface to-rr-pink/5 p-6 rounded-lg border border-rr-pink/30 hover:border-rr-pink transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rr-pink/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rr-pink/20 transition-all" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="pink">#1 RANKED BATTER</Badge>
                <Badge variant="muted">{topBatter.batting_type}</Badge>
                <Badge variant="blue">BENCHMARK ONLY</Badge>
              </div>
              <h2 className="font-display text-display text-text-primary group-hover:text-rr-pink transition-colors">
                {topBatter.striker_name}
              </h2>
              <p className="text-caption text-text-secondary mt-1">
                Elite high-leverage anchor. Shrinkage-adjusted SR of{' '}
                <span className="font-mono text-text-primary font-bold">{fmt.sr(topBatter.shrunk_press_strike_rate)}</span> vs base {fmt.sr(topBatter.base_strike_rate)}.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle text-caption">
                <div>
                  <div className="text-text-muted">Press Deliveries</div>
                  <div className="font-mono text-sm font-bold text-text-primary">{topBatter.press_balls}</div>
                </div>
                <div>
                  <div className="text-text-muted">SR Lift</div>
                  <div className="font-mono text-sm font-bold text-success">
                    {fmt.lift(topBatter.shrunk_sr_lift)}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted">Match Success</div>
                  <div className="font-mono text-sm font-bold text-rr-gold">
                    {fmt.recordWithPct(topBatter.successful_matches, topBatter.pressure_matches, topBatter.match_success_rate)}
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <PressureGauge value={topBatter.pri_score} label="PRI BAT" size={120} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-rr-pink font-semibold pt-2">
            <span>Investigate Tilak Varma's Dossier →</span>
            <span className="text-text-muted font-normal">Wilson 95% LCB: 50.0% · Retained MI</span>
          </div>
        </div>

        {/* #1 BOWLER SPOTLIGHT */}
        <div
          onClick={() => navigate(`/player/${topBowler.bowler_id}`)}
          className="group cursor-pointer bg-gradient-to-br from-surface via-surface to-rr-blue/5 p-6 rounded-lg border border-rr-blue/30 hover:border-rr-blue transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rr-blue/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rr-blue/20 transition-all" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="blue">#1 RANKED BOWLER</Badge>
                <Badge variant="muted">{topBowler.pace_or_spin} · {topBowler.bowling_type.split(' ')[0]}</Badge>
                <Badge variant="blue">BENCHMARK ONLY</Badge>
              </div>
              <h2 className="font-display text-display text-text-primary group-hover:text-rr-blue transition-colors">
                {topBowler.bowler_name}
              </h2>
              <p className="text-caption text-text-secondary mt-1">
                Stifling pressure choke. Shrinkage-adjusted economy of{' '}
                <span className="font-mono text-text-primary font-bold">{fmt.econ(topBowler.shrunk_press_economy)}</span> vs base {fmt.econ(topBowler.base_economy)}.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle text-caption">
                <div>
                  <div className="text-text-muted">Press Exposure</div>
                  <div className="font-mono text-sm font-bold text-text-primary">
                    {fmt.oversWithBalls(topBowler.press_balls, topBowler.press_overs)}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted">Econ Lift</div>
                  <div className="font-mono text-sm font-bold text-success">
                    {fmt.lift(topBowler.shrunk_econ_lift)}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted">Match Success</div>
                  <div className="font-mono text-sm font-bold text-rr-gold">
                    {fmt.recordWithPct(topBowler.successful_matches, topBowler.pressure_matches, topBowler.match_success_rate)}
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <PressureGauge value={topBowler.pri_score} label="PRI BOWL" size={120} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-rr-blue font-semibold pt-2">
            <span>Investigate Abrar Ahmed's Dossier →</span>
            <span className="text-text-muted font-normal">Wilson 95% LCB: 54.8% · Diplomatic Benchmark</span>
          </div>
        </div>
      </section>

      {/* VIEW 1: FINAL 10 SQUAD RECOMMENDATIONS (OUTPUT B) */}
      {selectedDiscipline === 'output_b' && (
        <section className="space-y-6">
          <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
            <div className="p-5 border-b border-border-subtle bg-gradient-to-r from-surface-elevated/80 to-surface flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rr-pink to-rr-blue animate-pulse" />
                  <h3 className="font-display text-2xl tracking-wider text-text-primary">
                    DEFINITIVE FINAL 10 RECOMMENDATIONS (OUTPUT B)
                  </h3>
                  <Badge variant="gold">Competition Brief Requirement</Badge>
                </div>
                <p className="text-caption text-text-secondary max-w-3xl">
                  Official franchise decision portfolio synthesized from independent pressure evaluation (P_sit ≥ 0.60), RR squad deficit index (SDI 75.5), strategic role allocation, and verified BCCI auction availability.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-text-muted uppercase">Role Archetypes:</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-rr-pink/20 text-rr-pink font-semibold border border-rr-pink/30">Finisher (2)</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-rr-gold/20 text-rr-gold font-semibold border border-rr-gold/30">Anchor (2)</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">Enforcer (1)</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">Death Pace (2)</span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">Spin Control (3)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-canvas/30">
                    <th className="py-3 px-3 w-12 text-center">Rank</th>
                    <th className="py-3 px-3">Player & Tactical Role</th>
                    <th className="py-3 px-3 text-center">Recruitment Tier</th>
                    <th className="py-3 px-3 text-right">Pressure Metric</th>
                    <th className="py-3 px-3 text-right">Exposure</th>
                    <th className="py-3 px-3 text-right">Reliability (Record / LCB)</th>
                    <th className="py-3 px-3 text-right">Contextual PVA</th>
                    <th className="py-3 px-3">Franchise Fit & Auction Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
                  {outputB.map((p) => (
                    <tr
                      key={p.player_id}
                      onClick={() => navigate(`/player/${p.player_id}`)}
                      className="hover:bg-surface-interactive/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block font-mono font-bold text-xs px-2.5 py-0.5 rounded ${
                            p.rank <= 3
                              ? 'bg-gradient-to-r from-rr-pink to-rr-blue text-white font-black'
                              : 'bg-white/5 text-text-secondary'
                          }`}
                        >
                          #{p.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-text-primary group-hover:text-rr-pink transition-colors text-sm flex items-center gap-2">
                          <span>{p.player_name}</span>
                          {p.rank === 2 && <span className="text-[10px] px-1.5 py-0.2 bg-rr-pink text-white rounded font-black">RR #1</span>}
                          {p.rank === 7 && <span className="text-[10px] px-1.5 py-0.2 bg-rr-blue text-white rounded font-black">RR #2</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-muted">
                          <span className="font-mono text-text-secondary">{p.primary_role}</span>
                          <span>·</span>
                          <span>{p.handedness}</span>
                          <span>·</span>
                          <span className="text-text-muted">{p.discipline}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderDecisionBadge(p.decision_tier)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular">
                        <div className="font-bold text-text-primary">{p.shrunk_press_metric}</div>
                        <div className="text-[10px] text-success font-semibold">
                          {fmt.lift(p.shrunk_lift_pct)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-text-secondary tabular">
                        <div>
                          {p.discipline === 'Bowling'
                            ? fmt.oversWithBalls(p.canonical_balls)
                            : `${p.canonical_balls} balls`}
                        </div>
                        <div className="text-[10px] text-text-muted">P_sit ≥ 0.60</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular">
                        <div className="text-rr-gold font-bold">{p.match_record} ({fmt.pct(p.match_success_rate)})</div>
                        <div className="text-[10px] text-text-muted">Wilson 95%: {fmt.pct(p.wilson_95_lcb)}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular">
                        <div className="text-success font-bold">{p.pva_label}</div>
                        <div className="text-[10px] text-text-muted">95% CI: [{p.ci_lower}, {p.ci_upper}]</div>
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="text-[11px] text-text-primary line-clamp-1 font-medium">{p.rr_fit}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 line-clamp-1 font-mono">{p.availability_status}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROLE ALLOCATION & SELECTION TRADE-OFFS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="pink">FINISHER TRADE-OFF</Badge>
                  <span className="text-[11px] font-mono text-text-muted">Gap 1 vs Overseas Slot</span>
                </div>
                <h4 className="font-display text-lg text-text-primary mb-2">
                  Ashutosh Sharma over David Miller
                </h4>
                <p className="text-caption text-text-secondary leading-relaxed">
                  While David Miller boasts peerless multi-year volume (370 balls, PRI 77.6), securing <strong>Ashutosh Sharma (Priority #1, Shrunk SR 191.28)</strong> as a domestic Indian finisher preserves an invaluable overseas slot. This allows RR to recruit express overseas bowling reinforcement without compromising death-phase finishing velocity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-text-muted">Domestic Purse Efficiency</span>
                <span className="font-mono text-success font-bold">+61.87 PVA over Dubey</span>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="blue">DEATH PACE SELECTION</Badge>
                  <span className="text-[11px] font-mono text-text-muted">Gap 3 Speed vs Age</span>
                </div>
                <h4 className="font-display text-lg text-text-primary mb-2">
                  Sakib Hussain over Mohit Sharma
                </h4>
                <p className="text-caption text-text-secondary leading-relaxed">
                  <strong>Sakib Hussain (Priority #2, Age 21y 11m)</strong> delivers 142.4 kph yorkers with 100% match success rate and 7.39 shrunk pressure economy. Veteran Mohit Sharma (PRI 64.5, 92.9% success) provides an exceptional contingency, but Sakib offers multi-cycle franchise upside and saves ₹3.0+ Cr in auction outlay.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-text-muted">Projected Spend</span>
                <span className="font-mono text-rr-blue font-bold">₹1.5–2.5 Cr vs ₹4.0+ Cr</span>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gold">SCIENTIFIC PURITY</Badge>
                  <span className="text-[11px] font-mono text-text-muted">No Blended Formulas</span>
                </div>
                <h4 className="font-display text-lg text-text-primary mb-2">
                  Independent Evaluation Scales
                </h4>
                <p className="text-caption text-text-secondary leading-relaxed">
                  Batting PRI and Bowling PRI are evaluated on distinct mathematical dimensions (Level 40%, Lift 35%, Consistency 25%). We <strong>never combine batting and bowling scores using an invented composite formula</strong>. Output B reflects tactical squad portfolio optimization rather than an artificial blended math score.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-text-muted">Methodology Compliance</span>
                <span className="font-mono text-rr-gold font-bold">100% Validated</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW 2: TWO-COLUMN EVIDENCE TABLES (ALL 20, BATTERS ONLY, OR BOWLERS ONLY) */}
      {selectedDiscipline !== 'output_b' && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TOP 10 BATTERS TABLE */}
          {(selectedDiscipline === 'both' || selectedDiscipline === 'bat') && (
            <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rr-pink" />
                  <h3 className="font-display text-xl tracking-wider text-text-primary">
                    TOP 10 BATTERS UNDER PRESSURE
                  </h3>
                </div>
                <span className="text-caption text-text-muted">P_sit ≥ 0.60 | Min 30 Balls</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-canvas/30">
                      <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                      <th className="py-2.5 px-3">Player</th>
                      <th className="py-2.5 px-3 text-right">PRI Score</th>
                      <th className="py-2.5 px-3 text-right">SR Lift</th>
                      <th className="py-2.5 px-3 text-right">Press Balls</th>
                      <th className="py-2.5 px-3 text-right">Match Success (k/n)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-xs">
                    {batters.map((b) => (
                      <tr
                        key={b.striker_id}
                        onClick={() => navigate(`/player/${b.striker_id}`)}
                        className="hover:bg-surface-interactive/80 cursor-pointer transition-colors group"
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              b.rank <= 3
                                ? 'bg-rr-pink text-white font-black'
                                : 'bg-white/5 text-text-secondary'
                            }`}
                          >
                            #{b.rank}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-text-primary group-hover:text-rr-pink transition-colors flex items-center gap-1.5">
                            <span>{b.striker_name}</span>
                            {b.rank === 4 && <span className="text-[9px] px-1 bg-rr-pink text-white rounded font-bold">RR #1</span>}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-text-muted font-mono">{b.batting_type}</span>
                            <span className="text-[10px] text-text-muted">· Shrunk SR: {fmt.sr(b.shrunk_press_strike_rate)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-mono text-sm font-bold text-text-primary tabular">
                            {fmt.pri(b.pri_score)}
                          </div>
                          <div className="w-20 ml-auto h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-rr-blue to-rr-pink rounded-full"
                              style={{ width: `${(b.pri_score / 85) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular">
                          <span className={b.shrunk_sr_lift >= 0 ? 'text-success font-semibold' : 'text-danger'}>
                            {fmt.lift(b.shrunk_sr_lift)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-text-secondary tabular">
                          {b.press_balls}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-text-secondary tabular">
                          <span className="text-rr-gold font-bold">{b.successful_matches}/{b.pressure_matches}</span>
                          <span className="text-[10px] text-text-muted ml-1">({fmt.pct(b.match_success_rate)})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOP 10 BOWLERS TABLE */}
          {(selectedDiscipline === 'both' || selectedDiscipline === 'bowl') && (
            <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated/40">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rr-blue" />
                  <h3 className="font-display text-xl tracking-wider text-text-primary">
                    TOP 10 BOWLERS UNDER PRESSURE
                  </h3>
                </div>
                <span className="text-caption text-text-muted">P_sit ≥ 0.60 | Min 30 Balls</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-canvas/30">
                      <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                      <th className="py-2.5 px-3">Player</th>
                      <th className="py-2.5 px-3 text-right">PRI Score</th>
                      <th className="py-2.5 px-3 text-right">Econ Lift</th>
                      <th className="py-2.5 px-3 text-right">Press Overs (Balls)</th>
                      <th className="py-2.5 px-3 text-right">Match Success (k/n)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-subtle text-xs">
                    {bowlers.map((bw) => (
                      <tr
                        key={bw.bowler_id}
                        onClick={() => navigate(`/player/${bw.bowler_id}`)}
                        className="hover:bg-surface-interactive/80 cursor-pointer transition-colors group"
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              bw.rank <= 3
                                ? 'bg-rr-blue text-white font-black'
                                : 'bg-white/5 text-text-secondary'
                            }`}
                          >
                            #{bw.rank}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-text-primary group-hover:text-rr-blue transition-colors flex items-center gap-1.5">
                            <span>{bw.bowler_name}</span>
                            {bw.rank === 4 && <span className="text-[9px] px-1 bg-rr-blue text-white rounded font-bold">RR #2</span>}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-text-muted font-mono">{bw.pace_or_spin}</span>
                            <span className="text-[10px] text-text-muted">· Shrunk Econ: {fmt.econ(bw.shrunk_press_economy)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-mono text-sm font-bold text-text-primary tabular">
                            {fmt.pri(bw.pri_score)}
                          </div>
                          <div className="w-20 ml-auto h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-rr-blue to-rr-gold rounded-full"
                              style={{ width: `${(bw.pri_score / 75) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular">
                          <span className={bw.shrunk_econ_lift >= 0 ? 'text-success font-semibold' : 'text-danger'}>
                            {fmt.lift(bw.shrunk_econ_lift)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-text-secondary tabular">
                          <div>{fmt.cricketOvers(bw.press_balls, bw.press_overs)}</div>
                          <div className="text-[10px] text-text-muted">({bw.press_balls} legal balls)</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-text-secondary tabular">
                          <span className="text-rr-gold font-bold">{bw.successful_matches}/{bw.pressure_matches}</span>
                          <span className="text-[10px] text-text-muted ml-1">({fmt.pct(bw.match_success_rate)})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* RADAR CHART & METHODOLOGY CALLOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-surface p-6 rounded-lg border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="pink">Subscore Breakdown</Badge>
                <span className="text-caption text-text-muted font-mono">PRI Architecture</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">
                POLAR SUBSCORE COMPARISON
              </h3>
            </div>
            <span className="text-caption text-text-muted font-mono">40 / 35 / 25 Weights</span>
          </div>
          <ChartWrapper data={radarData} layout={radarLayout} height={320} />
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <Callout title="THE RR DECISION EVIDENCE ARCHITECTURE" accent="pink">
            <div className="space-y-2 text-xs leading-relaxed text-text-secondary">
              <p>
                Our <strong>Pressure Resilience Index (PRI)</strong> combines three empirically regularized sub-scores:
              </p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-text-primary">
                <li><strong className="text-rr-pink">Level Subscore (40%):</strong> Empirical Bayes shrunk performance under P_sit ≥ 0.60.</li>
                <li><strong className="text-rr-blue">Lift Subscore (35%):</strong> Percentage elevation over non-pressure baseline.</li>
                <li><strong className="text-rr-gold">Consistency Subscore (25%):</strong> Inter-match variance stability & Wilson 95% LCB.</li>
              </ul>
              <p className="pt-2 border-t border-border-subtle">
                Every player dossier links raw ball-by-ball micro-data through to replacement-level contextual run additions (RAAE/RSBE), eliminating subjective scout bias.
              </p>
            </div>
          </Callout>

          <div className="bg-surface p-5 rounded-lg border border-border-subtle">
            <h4 className="font-display text-lg text-text-primary mb-2">
              WHY NO INVENTED COMPOSITE FORMULA?
            </h4>
            <p className="text-caption text-text-secondary leading-relaxed">
              Batting and bowling pressure resistance operate on entirely distinct mathematical baselines (e.g. Strike Rate vs Economy Rate). Output B orders players by <strong>strategic squad impact</strong> and <strong>auction feasibility</strong>, rather than blending unrelated numbers into an artificial composite index.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
