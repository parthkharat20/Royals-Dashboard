import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageTransition } from '@/components/layout/PageTransition'
import { ChartWrapper } from '@/components/charts/ChartWrapper'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { fmt } from '@/lib/formatters'
import deficitData from '@/data/squadDeficit.json'
import squadAuditData from '@/data/squadAudit.json'
import scenariosData from '@/data/auctionScenarios.json'
import rosterData from '@/data/rrRoster.json'
import type { SquadDeficit, RosterPlayer } from '@/types'

const deficit = (deficitData as unknown) as SquadDeficit
const audit = squadAuditData as any
const rawScenarios = scenariosData as any
const roster = rosterData as RosterPlayer[]

export function SquadImpact() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('1')
  const [searchRoster, setSearchRoster] = useState<string>('')

  // Scenarios normalization
  const scenariosList = useMemo(() => {
    if (Array.isArray(rawScenarios)) return rawScenarios
    return Object.entries(rawScenarios).map(([key, val]: [string, any]) => ({
      ...val,
      scenario_key: key,
    }))
  }, [])

  const currentScenario = useMemo(() => {
    return (
      scenariosList.find((s: any) => String(s.scenario_id) === selectedScenarioKey || s.scenario_key === selectedScenarioKey) ||
      scenariosList[0] ||
      null
    )
  }, [scenariosList, selectedScenarioKey])

  // Waterfall chart for Squad Deficit Index
  const gapEntries = Object.entries(deficit.gap_breakdown || {})
  const gapLabels = gapEntries.map(([k]) =>
    k.replace('GAP_', '').replace(/_/g, ' ')
  )
  const gapContributions = gapEntries.map(([, v]) => v.weighted_contribution)

  const sdiChartData = [
    {
      type: 'waterfall',
      orientation: 'v',
      measure: [...gapLabels.map(() => 'relative'), 'total'],
      x: [...gapLabels, 'TOTAL SDI'],
      y: [...gapContributions, null],
      text: [...gapContributions.map((c) => c.toFixed(1)), deficit.total_sdi.toFixed(1)],
      textposition: 'outside',
      textfont: { family: 'JetBrains Mono', color: '#F8FAFC', size: 11 },
      connector: { line: { color: 'rgba(255,255,255,0.15)' } },
      increasing: { marker: { color: '#E83E8C' } },
      totals: { marker: { color: '#DC2626' } },
    },
  ]

  const sdiLayout = {
    title: {
      text: `Squad Deficit Index: ${deficit.total_sdi.toFixed(1)} (${deficit.urgency})`,
      font: { family: 'Bebas Neue', size: 18, color: '#F8FAFC' },
    },
    xaxis: {
      tickfont: { family: 'Source Sans 3', size: 10, color: '#94A3B8' },
    },
    yaxis: {
      title: 'Weighted Deficit Points',
      gridcolor: 'rgba(255,255,255,0.06)',
    },
    margin: { t: 40, r: 20, b: 60, l: 45 },
  }

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    if (!searchRoster) return roster
    const q = searchRoster.toLowerCase()
    return roster.filter(
      (p) =>
        p.player_name?.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q) ||
        p.nationality?.toLowerCase().includes(q)
    )
  }, [searchRoster])

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Tactical Strategy Synthesis"
        title="SQUAD IMPACT LAB"
        subtitle="Auditing Rajasthan Royals' current structural vulnerabilities and evaluating 5 auction scenarios to ingest pressure talent."
      />

      {/* SECTION 1: SQUAD DEFICIT INDEX & HANDEDNESS IMBALANCE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
          <ChartWrapper data={sdiChartData} layout={sdiLayout} height={340} />
          <div className="text-caption text-text-muted mt-3">
            Primary bottlenecks concentrated in domestic finishing (30% weight) and middle-order right-hand batting (25% weight).
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rr-pink">
                TACTICAL IMBALANCE AUDIT
              </span>
              <Badge variant="danger">Extreme Vulnerability</Badge>
            </div>
            <h4 className="font-display text-xl text-text-primary mb-2">
              PROJECTED TOP 7 HANDEDNESS SKEW
            </h4>
            <p className="text-caption text-text-secondary mb-4 leading-relaxed">
              RR's projected top 7 batting order possesses <strong className="text-text-primary">71.4% Left-Hand Batters (5 LHB : 2 RHB)</strong>, causing high exposure to off-spin chokes.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-rr-pink font-bold">5 Left-Handers (71.4%)</span>
                  <span className="text-rr-blue font-bold">2 Right-Handers (28.6%)</span>
                </div>
                <div className="h-5 w-full bg-surface-elevated rounded-full overflow-hidden flex border border-border-subtle">
                  <div className="w-[71.4%] bg-rr-pink flex items-center justify-center text-[10px] font-bold text-white">
                    71.4% LHB
                  </div>
                  <div className="w-[28.6%] bg-rr-blue flex items-center justify-center text-[10px] font-bold text-white">
                    28.6% RHB
                  </div>
                </div>
              </div>

              <div className="p-3 bg-canvas/40 rounded border border-border-subtle text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Contracted Players:</span>
                  <span className="font-mono font-bold text-text-primary">{audit?.total_players || 27}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Overseas Ratio:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {audit?.overseas_players || 9} Overseas / {audit?.indian_players || 18} Indian
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Off-Spin Vulnerability Index:</span>
                  <span className="font-mono font-bold text-danger">
                    {audit?.batting_handedness?.offspin_vulnerability_index || '7.14'} (High)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle text-caption text-text-muted">
            Acquiring a right-handed domestic finisher (e.g., Ashutosh Sharma, PRI 72.5) directly repairs the primary structural bottleneck.
          </div>
        </div>
      </section>

      {/* SECTION 2: 5 AUCTION SCENARIOS */}
      <section className="bg-surface rounded-lg border border-border-subtle p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rr-gold">
              SCENARIO OPTIMIZATION LAB
            </span>
            <h3 className="font-display text-2xl text-text-primary mt-1">
              FIVE RECONSTITUTED AUCTION ROADMAPS
            </h3>
          </div>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap gap-2">
            {scenariosList.map((sc: any, idx: number) => {
              const scId = String(sc.scenario_id || idx + 1)
              const isSelected = scId === selectedScenarioKey
              return (
                <button
                  key={scId}
                  onClick={() => setSelectedScenarioKey(scId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    isSelected
                      ? 'bg-rr-pink text-white shadow-[0_0_12px_rgba(232,62,140,0.4)]'
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  Scenario {scId}
                </button>
              )
            })}
          </div>
        </div>

        {currentScenario && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-elevated/30 p-4 rounded-lg border border-border-subtle">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="pink">Scenario {currentScenario.scenario_id}</Badge>
                  <span className="text-caption text-text-muted">{currentScenario.feasibility_status}</span>
                </div>
                <h4 className="font-display text-2xl text-text-primary">
                  {currentScenario.title}
                </h4>
                <p className="text-body text-text-secondary mt-1 max-w-2xl">
                  {currentScenario.strategy_summary}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0 font-mono tabular">
                <div className="text-right">
                  <div className="text-caption text-text-muted">Estimated Spend</div>
                  <div className="text-xl font-bold text-text-primary">
                    {fmt.money(currentScenario.total_estimated_spend_cr)}
                  </div>
                </div>
                <div className="text-right border-l border-border-subtle pl-6">
                  <div className="text-caption text-text-muted">Net Matchday PVA</div>
                  <div className="text-xl font-bold text-success">
                    +{currentScenario.net_incremental_matchday_pva?.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* TARGET ACQUISITIONS TABLE */}
            <div>
              <h5 className="font-display text-lg text-text-primary mb-3">
                TARGETED PRESSURE ACQUISITIONS
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle text-[11px] text-text-muted uppercase font-semibold bg-canvas/30">
                      <th className="py-2.5 px-3">Player</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3 text-center">Category</th>
                      <th className="py-2.5 px-3 text-right">PRI Score</th>
                      <th className="py-2.5 px-3 text-right">Est. Price</th>
                      <th className="py-2.5 px-3 text-right">Squad Fit</th>
                      <th className="py-2.5 px-3">Target Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-mono tabular">
                    {currentScenario.target_acquisitions?.map((t: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-elevated/40">
                        <td className="py-2.5 px-3 font-sans font-semibold text-text-primary">
                          {t.name}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-text-secondary">{t.role}</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {t.is_overseas ? (
                            <Badge variant="blue">Overseas</Badge>
                          ) : (
                            <Badge variant="success">Indian</Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-rr-pink">
                          {fmt.pri(t.pri_score)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-text-primary">
                          {fmt.money(t.estimated_price_cr)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-rr-gold font-bold">
                          {t.squad_fit_score}/100
                        </td>
                        <td className="py-2.5 px-3 font-sans text-text-secondary">
                          {t.primary_gap?.replace('GAP_', '').replace(/_/g, ' ') || 'Depth'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DISPLACEMENT TABLE */}
            {currentScenario.displacement_table?.length > 0 && (
              <div>
                <h5 className="font-display text-lg text-text-primary mb-3">
                  INCUMBENT DISPLACEMENT & PVA GAIN
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border-subtle text-[11px] text-text-muted uppercase font-semibold bg-canvas/30">
                        <th className="py-2.5 px-3">Incoming Target</th>
                        <th className="py-2.5 px-3 text-right">Target PVA</th>
                        <th className="py-2.5 px-3">Displaced Incumbent</th>
                        <th className="py-2.5 px-3 text-right">Incumbent Baseline</th>
                        <th className="py-2.5 px-3 text-right">Net Value Gain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-mono tabular">
                      {currentScenario.displacement_table.map((d: any, idx: number) => (
                        <tr key={idx} className="hover:bg-surface-elevated/40">
                          <td className="py-2.5 px-3 font-sans font-semibold text-text-primary">
                            {d.incoming_player}
                          </td>
                          <td className="py-2.5 px-3 text-right text-text-primary">
                            +{d.incoming_pva?.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-text-secondary">
                            {d.incumbent_displaced}
                          </td>
                          <td className="py-2.5 px-3 text-right text-text-muted">
                            {d.incumbent_pva_baseline?.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-success">
                            +{d.net_difference?.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 3: RECONCILED RR ROSTER AUDIT */}
      <section className="bg-surface rounded-lg border border-border-subtle p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-xl text-text-primary">
              RR 2026 RECONCILED ROSTER LEDGER (27 PLAYERS)
            </h4>
            <p className="text-caption text-text-secondary">
              Canonical audit of all contracted and retained Rajasthan Royals players.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search by player, role, country..."
            value={searchRoster}
            onChange={(e) => setSearchRoster(e.target.value)}
            className="px-3 py-1.5 bg-canvas border border-border-subtle rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-rr-pink w-64"
          />
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-surface-elevated z-10">
              <tr className="border-b border-border-subtle text-[11px] text-text-muted uppercase font-semibold">
                <th className="py-2.5 px-3">Player Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Nationality</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Batting Style</th>
                <th className="py-2.5 px-3 text-right">Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredRoster.map((p) => (
                <tr key={p.player_id} className="hover:bg-surface-elevated/40">
                  <td className="py-2.5 px-3 font-semibold text-text-primary">{p.player_name}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{p.role}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{p.nationality}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant={p.is_overseas ? 'blue' : 'success'}>
                      {p.is_overseas ? 'Overseas' : 'Indian'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-text-muted font-mono">{p.batting_style || '—'}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-text-primary">
                    {fmt.money(p.contract_price_cr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageTransition>
  )
}
