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
import type { Batter, Bowler } from '@/types'

const batters = battersData as Batter[]
const bowlers = bowlersData as Bowler[]

export function ExecutiveBrief() {
  const navigate = useNavigate()
  const [selectedDiscipline, setSelectedDiscipline] = useState<'both' | 'bat' | 'bowl'>('both')

  const topBatter = batters[0]
  const topBowler = bowlers[0]

  // Radar traces for top 3 batters
  const radarData = [
    {
      type: 'scatterpolar',
      r: [topBatter.level_subscore, topBatter.lift_subscore, topBatter.consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(232, 62, 140, 0.25)',
      line: { color: '#E83E8C', width: 2.5 },
      name: `#1 ${topBatter.striker_name}`,
    },
    {
      type: 'scatterpolar',
      r: [batters[1].level_subscore, batters[1].lift_subscore, batters[1].consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(251, 191, 36, 0.15)',
      line: { color: '#FBBF24', width: 1.5, dash: 'dash' },
      name: `#2 ${batters[1].striker_name}`,
    },
    {
      type: 'scatterpolar',
      r: [topBowler.level_subscore, topBowler.lift_subscore, topBowler.consistency_subscore],
      theta: ['Level (40%)', 'Lift (35%)', 'Consistency (25%)'],
      fill: 'toself',
      fillcolor: 'rgba(37, 99, 235, 0.2)',
      line: { color: '#2563EB', width: 2.5 },
      name: `#1 ${topBowler.bowler_name}`,
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

  return (
    <PageTransition>
      <PageHeader
        eyebrow="SupeRR Selector Season 2 · Round 1 Submission"
        title="EXECUTIVE DECISION BRIEF"
        subtitle="Independent Top 10 rankings of batters and bowlers who statistically elevate under situational pressure (P_sit ≥ 0.60)."
        actions={
          <div className="flex items-center gap-2 bg-surface p-1 rounded border border-border-subtle">
            <button
              onClick={() => setSelectedDiscipline('both')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'both' ? 'bg-rr-pink text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              All Top 20
            </button>
            <button
              onClick={() => setSelectedDiscipline('bat')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'bat' ? 'bg-rr-pink text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Batters Only
            </button>
            <button
              onClick={() => setSelectedDiscipline('bowl')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                selectedDiscipline === 'bowl' ? 'bg-rr-pink text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              Bowlers Only
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
                  <div className="font-mono text-sm font-bold text-success">+{topBatter.shrunk_sr_lift.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-text-muted">Match Success</div>
                  <div className="font-mono text-sm font-bold text-rr-gold">{fmt.pct(topBatter.match_success_rate * 100)}</div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <PressureGauge value={topBatter.pri_score} label="PRI BAT" size={120} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-rr-pink font-semibold pt-2">
            <span>Investigate Tilak Varma's Dossier →</span>
            <span className="text-text-muted font-normal">Wilson 95% LCB: 61.2%</span>
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
              </div>
              <h2 className="font-display text-display text-text-primary group-hover:text-rr-blue transition-colors">
                {topBowler.bowler_name}
              </h2>
              <p className="text-caption text-text-secondary mt-1">
                Stifling pressure choke. Shrinkage-adjusted economy of{' '}
                <span className="font-mono text-text-primary font-bold">{fmt.econ(topBowler.shrunk_press_economy)}</span> under high leverage.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle text-caption">
                <div>
                  <div className="text-text-muted">Press Overs</div>
                  <div className="font-mono text-sm font-bold text-text-primary">{topBowler.press_overs.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-text-muted">Econ Lift</div>
                  <div className="font-mono text-sm font-bold text-success">+{topBowler.shrunk_econ_lift.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-text-muted">Match Success</div>
                  <div className="font-mono text-sm font-bold text-rr-gold">{fmt.pct(topBowler.match_success_rate * 100)}</div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <PressureGauge value={topBowler.pri_score} label="PRI BOWL" size={120} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-rr-blue font-semibold pt-2">
            <span>Investigate Abrar Ahmed's Dossier →</span>
            <span className="text-text-muted font-normal">Wilson 95% LCB: 52.0%</span>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN EVIDENCE TABLES */}
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
                    <th className="py-2.5 px-3 text-right">Consistency</th>
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
                        <div className="font-semibold text-text-primary group-hover:text-rr-pink transition-colors">
                          {b.striker_name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-text-muted font-mono">{b.batting_type}</span>
                          <span className="text-[10px] text-text-muted">· SR: {fmt.sr(b.shrunk_press_strike_rate)}</span>
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
                        {fmt.pct(b.match_success_rate * 100)}
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
                    <th className="py-2.5 px-3 text-right">Press Overs</th>
                    <th className="py-2.5 px-3 text-right">Consistency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
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
                        <div className="font-semibold text-text-primary group-hover:text-rr-blue transition-colors">
                          {bw.bowler_name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-text-muted font-mono">{bw.pace_or_spin}</span>
                          <span className="text-[10px] text-text-muted">· Econ: {fmt.econ(bw.shrunk_press_economy)}</span>
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
                        {bw.press_overs.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-text-secondary tabular">
                        {fmt.pct(bw.match_success_rate * 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* PRI SUBSCORE RADAR & METHODOLOGY NARRATIVE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-surface rounded-lg border border-border-subtle p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rr-gold" />
              <h3 className="font-display text-lg tracking-wider text-text-primary">
                PRI SUBSCORE COMPOSITION
              </h3>
            </div>
            <p className="text-caption text-text-secondary mb-3">
              Triangulation of Level (40%), Lift (35%), and Consistency (25%) avoids single-dimension bias.
            </p>
          </div>
          <ChartWrapper data={radarData} layout={radarLayout} height={300} />
          <div className="text-[11px] text-text-muted mt-2 text-center">
            Empirical Bayes shrinkage applied with prior sample M = 45
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Callout title="EXECUTIVE METHODOLOGY RATIONALE" accent="pink">
            We analyzed <strong className="text-text-primary">200,961 T20 deliveries</strong> across{' '}
            <strong className="text-text-primary">134 global competitions</strong> (2022–2026) to identify players who
            statistically elevate their output when situational pressure exceeds the 60th percentile (<code className="text-rr-pink font-mono text-xs">P_sit ≥ 0.60</code>).
            The Pressure Rating Index (PRI) combines three independently measured dimensions:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-text-primary">
              <li><strong>Level (40%):</strong> Raw performance against elite opposition under pressure.</li>
              <li><strong>Lift (35%):</strong> Relative gain above the player's personal non-pressure baseline.</li>
              <li><strong>Consistency (25%):</strong> Repeated match-to-match execution verified by Wilson 95% LCB bounds.</li>
            </ul>
            <div className="mt-3 text-xs text-text-secondary">
              Strictly non-overlapping lists eliminate cross-discipline distortion. All metrics have passed 36/36 automated consistency verification gates.
            </div>
          </Callout>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface p-4 rounded border border-border-subtle">
              <div className="text-caption text-text-muted">Threshold</div>
              <div className="font-mono text-lg font-bold text-rr-pink mt-1">P_sit ≥ 0.60</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Top ~40% stress moments</div>
            </div>
            <div className="bg-surface p-4 rounded border border-border-subtle">
              <div className="text-caption text-text-muted">Shrinkage Prior</div>
              <div className="font-mono text-lg font-bold text-rr-blue mt-1">M = 45 Balls</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Empirical Bayes</div>
            </div>
            <div className="bg-surface p-4 rounded border border-border-subtle">
              <div className="text-caption text-text-muted">Reliability Gate</div>
              <div className="font-mono text-lg font-bold text-rr-gold mt-1">Wilson 95%</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Lower conf. bound</div>
            </div>
            <div className="bg-surface p-4 rounded border border-border-subtle">
              <div className="text-caption text-text-muted">Rank Stability</div>
              <div className="font-mono text-lg font-bold text-success mt-1">ρ = 0.824</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Concordance (p &lt; 0.001)</div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
