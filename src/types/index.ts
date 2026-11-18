// ─── TOP 10 BATTERS ───
export interface Batter {
  striker_id: number
  striker_name: string
  batting_type: string          // "LHB" | "RHB"
  base_balls: number
  base_runs: number
  base_dismissals: number
  base_strike_rate: number
  base_average: number
  base_boundary_pct: number
  base_dot_pct: number
  base_matches: number
  press_balls: number
  press_runs: number
  press_dismissals: number
  press_strike_rate: number
  press_average: number
  press_boundary_pct: number
  press_dot_pct: number
  press_matches: number
  raw_sr_lift: number
  raw_boundary_lift: number
  raw_dot_avoidance_lift: number
  sr_diff: number
  boundary_diff: number
  dot_diff: number
  shrunk_press_strike_rate: number
  sr_se: number
  sr_ci_lower: number
  sr_ci_upper: number
  shrunk_sr_lift: number
  stat_confidence: number
  pressure_matches: number
  successful_matches: number
  sr_std: number
  sr_iqr: number
  match_success_rate: number
  batting_consistency_score: number
  pri_score: number
  level_subscore: number
  lift_subscore: number
  consistency_subscore: number
  rank: number
}

// ─── TOP 10 BOWLERS ───
export interface Bowler {
  bowler_id: number
  bowler_name: string
  bowling_type: string          // e.g. "Right-arm Leg-Break"
  pace_or_spin: string          // "Pace" | "Spin"
  base_balls: number
  base_overs: number
  base_runs: number
  base_wickets: number
  base_economy: number
  base_dot_pct: number
  base_boundary_pct: number
  base_wicket_rate: number
  base_matches: number
  press_balls: number
  press_overs: number
  press_runs: number
  press_wickets: number
  press_economy: number
  press_dot_pct: number
  press_boundary_pct: number
  press_wicket_rate: number
  press_matches: number
  raw_econ_lift: number
  raw_wicket_lift: number
  raw_dot_lift: number
  econ_diff: number
  dot_diff: number
  wicket_rate_diff: number
  shrunk_press_economy: number
  econ_se: number
  econ_ci_lower: number
  econ_ci_upper: number
  shrunk_econ_lift: number
  stat_confidence: number
  pressure_matches: number
  successful_matches: number
  econ_std: number
  econ_iqr: number
  match_success_rate: number
  bowling_consistency_score: number
  pri_score: number
  level_subscore: number
  lift_subscore: number
  consistency_subscore: number
  rank: number
}

// ─── SQUAD DEFICIT ───
export interface GapBreakdown {
  title?: string
  weight: number
  deficit?: number
  gap_deficit_score?: number
  weighted_contribution: number
  tier?: string
  priority?: string
  description?: string
}

export interface SquadDeficit {
  total_sdi: number
  urgency: string
  gap_breakdown: Record<string, GapBreakdown>
  primary_bottlenecks?: string[]
}

// ─── AUCTION SCENARIO ───
export interface TargetAcquisition {
  name: string
  role: string
  category: string
  batting_type: string
  is_overseas: boolean
  pri_score: number
  estimated_price_cr: number
  squad_fit_score: number
  primary_gap: string
  availability_status: string
}

export interface DisplacementEntry {
  incoming_player: string
  incoming_pva: number
  incumbent_displaced: string
  incumbent_pva_baseline: number
  net_difference: number
  role: string
  is_overseas: boolean
}

export interface AuctionScenario {
  scenario_id: string | number
  title: string
  strategy_summary: string
  primary_focus?: string
  target_acquisitions: TargetAcquisition[]
  total_estimated_spend_cr: number
  net_incremental_matchday_pva: number
  displacement_table: DisplacementEntry[]
  final_squad_size: number
  final_overseas_count: number
  feasibility_status: string
}

// ─── MODEL METRICS ───
export interface CalibrationBin {
  bin_range: string
  n_deliveries: number
  mean_actual: number
  mean_predicted: number
  residual_bias: number
}

// ─── PLAYER DOSSIER ───
export interface PlayerDossier {
  player_id: number
  name: string
  category: string
  batting_type?: string
  bowling_type?: string
  is_overseas: boolean
  pri_score: number
  match_success_rate: number
  press_balls: number
  squad_fit: {
    status: string
    tag: string
    gap_addressed: string
    fit_score: number
    tactical_rationale: string
  }
}

// ─── ROSTER ───
export interface RosterPlayer {
  player_id: number
  player_name: string
  is_overseas: boolean
  nationality: string
  role: string
  batting_style: string | null
  bowling_style: string | null
  origin_type: string
  contract_price_cr: number
  status_2027_audit: string
}
