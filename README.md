# RR Pressure Intelligence — Decision Evidence Room

> Official Round 1 Submission & Strategy Intelligence Suite for Rajasthan Royals (SupeRR Selector Season 2).

An editorial sports-intelligence web application presenting the **Top 10 Batters** and **Top 10 Bowlers** who statistically elevate under high situational pressure ($P_{sit} \ge 0.60$), evaluated across 200,961 deliveries, 867 matches, and 134 competitions (2022–2026).

---

## 🚀 Key Modules

1. **Executive Decision Brief (`/`)**:
   - Independent Top 10 Batters and Top 10 Bowlers rankings with PRI score gauges.
   - Non-overlapping discipline metrics: Strike Rate Lift vs Economy Lift.
   - Triangulated PRI Radar breakdown (Level 40%, Lift 35%, Consistency 25%).
2. **Pressure Intelligence Engine (`/pressure`)**:
   - Continuous Situational Pressure ($P_{sit}$) formulation.
   - Dynamic chase equation and first-innings leverage models.
   - Threshold sensitivity proofs ($P_{sit} \in [0.50, 0.70]$) confirming rank stability ($\rho > 0.82$).
3. **Model Trust & Reproducibility (`/methodology`)**:
   - 200,961 delivery ledger provenance across 134 competitions.
   - Chronological holdout validation (2022–2025 train / 2026 test) with Expected Runs RMSE gains.
   - 5-quintile calibration tables and feature importance metrics.
4. **Player Investigation Dossiers (`/player/:id`)**:
   - Comprehensive player dossiers for all 20 ranked players.
   - Shrinkage-adjusted base vs pressure comparison tables.
   - 95% Empirical Bayes credible intervals and Wilson 95% lower confidence bounds.
   - Rajasthan Royals tactical squad fit analysis.
5. **Squad Impact Lab (`/squad`)**:
   - Squad Deficit Index ($SDI = 75.5$ Extreme Vulnerability) waterfall breakdown.
   - Projected Top 7 Handedness skew analysis (71.4% LHB vulnerability).
   - 5 Reconstituted auction scenarios with displacement PVA bridges.
   - Full 27-player canonical RR 2026 roster ledger.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (Rajasthan Royals Brand Identity)
- **Charts**: Plotly.js (`plotly.js-dist-min` + `react-plotly.js`)
- **Animation**: Framer Motion
- **Routing**: React Router v6

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔒 Data Provenance & Methodology Summary

- **Situational Pressure**: $P_{sit} \ge 0.60$ capturing the top ~40% highest leverage moments.
- **Shrinkage Regularization**: Empirical Bayes with prior sample $M = 45$ balls.
- **Reliability Metric**: Wilson 95% Lower Confidence Bound.
- **Rank Concordance**: Batting Spearman $\rho = 0.824$ ($p < 0.001$), Bowling $\rho = 0.732$ ($p < 0.001$).
