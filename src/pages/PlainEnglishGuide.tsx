import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageTransition } from '@/components/layout/PageTransition'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'

interface TranslationItem {
  jargon: string
  plainEnglish: string
  dressingRoomMeaning: string
  cricketExample: string
  accent: 'pink' | 'blue' | 'gold' | 'success'
}

const TRANSLATIONS: TranslationItem[] = [
  {
    jargon: 'P_sit ≥ 0.60 (Situational Pressure)',
    plainEnglish: 'The "Crunch Time" Meter',
    dressingRoomMeaning:
      'Only counting deliveries where the game is genuinely on the line — not dead rubbers, not powerplay cruise control.',
    cricketExample:
      'Needing 42 off 18 balls, losing 3 wickets in the powerplay, or defending 12 in the 20th over.',
    accent: 'pink',
  },
  {
    jargon: 'PRI (Pressure Rating Index)',
    plainEnglish: 'The "Ice-in-the-Veins" Rating',
    dressingRoomMeaning:
      'A single composite score (0 to 100) combining raw talent, gear shift, and repeatability.',
    cricketExample:
      'A score of 75+ means a player consistently elevates their team across multiple seasons and high-stakes matches.',
    accent: 'gold',
  },
  {
    jargon: 'Level Subscore (40%)',
    plainEnglish: 'Class Against Tough Opposition',
    dressingRoomMeaning:
      'How hard you hit or how tight you bowl when facing world-class bowlers and batters in high leverage.',
    cricketExample:
      'Hitting Bumrah for boundaries in the death overs counts far more than scoring 20 runs against part-time spin.',
    accent: 'blue',
  },
  {
    jargon: 'Lift Subscore (35%)',
    plainEnglish: 'The "Gear Shift"',
    dressingRoomMeaning:
      'How much you elevate your performance compared to your own normal baseline when the pressure mounts.',
    cricketExample:
      'A batter striking at 135 normally who jumps to 150+ in pressure situations has elite positive lift.',
    accent: 'success',
  },
  {
    jargon: 'Consistency Subscore (25%)',
    plainEnglish: 'Matchday Dependability',
    dressingRoomMeaning:
      'Delivering in 7 or 8 out of 10 pressure games rather than having one heroic game followed by four failures.',
    cricketExample:
      'Tilak Varma and David Miller maintaining positive contributions across 20+ different tight match finishes.',
    accent: 'gold',
  },
  {
    jargon: 'Empirical Bayes Shrinkage (M=45)',
    plainEnglish: 'The "Fluke Filter"',
    dressingRoomMeaning:
      'Math that stops us from over-rating a player who got lucky in just one or two matches.',
    cricketExample:
      'If a batter faced only 15 pressure balls and hit two sixes, the filter pulls their rating down until they prove it over 100+ balls.',
    accent: 'pink',
  },
]

export function PlainEnglishGuide() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Why not just pick whoever has the highest overall Strike Rate or Economy?',
      a: 'Overall strike rates lie because they include low-stress situations — like batting on flat pitches in games that are already won or lost. A batter can pad their strike rate to 160 against relaxed fielders, yet choke when needing 14 an over against quality death bowling. Our engine isolates ONLY deliveries where the match was actually on the line.',
    },
    {
      q: 'Why is Tilak Varma ranked #1 above bigger global superstars?',
      a: 'Tilak Varma faced 352 high-pressure balls in our dataset and elevated his strike rate from 136.6 to 148.2 (a +8.5% lift), with a 71.4% match-success rate. Unlike players whose strike rate plummets under pressure, Tilak actively scores faster when wickets fall or required run rates spike, proving to be the most reliable high-leverage anchor in modern T20.',
    },
    {
      q: 'Why are Batters and Bowlers ranked on completely separate Top 10 lists?',
      a: 'Batting pressure (hitting boundaries, avoiding dot balls) and bowling pressure (saving runs, taking wickets) operate on completely different statistical scales. Combining them into one list requires subjective guesses about whether a 145 SR is "better" than a 7.5 economy. Separate lists give coaches pure, objective ranking within each discipline.',
    },
    {
      q: 'How did we make sure young domestic players like Ashutosh Sharma or Sakib Hussain aren’t one-hit wonders?',
      a: 'We implemented Empirical Bayes Shrinkage with a prior sample of 45 balls and Wilson 95% confidence intervals. If a player has a small sample size, the formula automatically pulls their score down toward the average. A player only reaches the Top 10 if their performance is so extreme and consistent that it statistically overpowers the sample penalty.',
    },
    {
      q: 'How should Rajasthan Royals leadership use these findings in the auction room?',
      a: 'RR currently has a severe structural weakness: an SDI score of 75.5, with 71.4% left-handers in the top 7 and an acute need for a right-handed Indian finisher. Targets like Ashutosh Sharma (Rank #4, PRI 72.5) or Sakib Hussain (Rank #4 Bowler, PRI 63.0) directly fix RR’s biggest tactical vulnerabilities without breaking the auction purse.',
    },
  ]

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Leadership & Coaching Primer"
        title="THE CRICKET TRANSLATION ROOM"
        subtitle="No equations. No machine learning jargon. Just clean cricket intuition on what we built, why it matters, and how we selected the Top 10 pressure performers."
      />

      {/* 30-SECOND ELEVATOR PITCH */}
      <section className="bg-gradient-to-br from-surface via-surface to-rr-pink/10 p-6 sm:p-8 rounded-lg border border-rr-pink/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rr-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl">
          <Badge variant="pink" className="mb-3">THE 30-SECOND SUMMARY</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-text-primary tracking-wide leading-tight">
            "A six in the 19th over chasing 12 an over is worth ten times a boundary in a match that is already won."
          </h2>
          <p className="text-body-lg text-text-secondary mt-4 leading-relaxed">
            Standard cricket statistics treat every ball the same. But in the IPL, matches are won or lost in
            <strong className="text-text-primary"> 15 to 20 critical balls</strong> where nerves take over. We analyzed
            <strong className="text-text-primary"> 200,961 balls across 134 competitions</strong> to filter out the noise and answer one simple question:
            <span className="text-rr-pink font-semibold"> Who steps up when the heat is turned all the way up?</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-border-subtle text-caption">
            <div>
              <span className="text-text-muted">Total Balls Screened:</span>{' '}
              <strong className="font-mono text-text-primary">200,961</strong>
            </div>
            <div>
              <span className="text-text-muted">Crunch Deliveries:</span>{' '}
              <strong className="font-mono text-rr-pink">Top 40% (P_sit ≥ 0.60)</strong>
            </div>
            <div>
              <span className="text-text-muted">Final Lists:</span>{' '}
              <strong className="font-mono text-rr-gold">Top 10 Batters & Top 10 Bowlers</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP INTUITIVE PROCESS */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rr-gold">
            METHODOLOGY IN FOUR SIMPLE STEPS
          </span>
          <h3 className="font-display text-2xl text-text-primary mt-1">
            HOW WE SELECTED THE TOP 10 PLAYERS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface p-5 rounded-lg border border-border-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-rr-pink/20 text-rr-pink font-display text-xl flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-display text-lg text-text-primary mb-1">
                Filter for Crunch Time
              </h4>
              <p className="text-caption text-text-secondary leading-relaxed">
                We ignore balls bowled in easy, low-stress moments. A delivery only qualifies if the match situation is in the top 40% of historical tension (P_sit ≥ 0.60).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-rr-pink font-mono">
              Filters out stat-padding
            </div>
          </div>

          <div className="bg-surface p-5 rounded-lg border border-border-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-rr-blue/20 text-rr-blue font-display text-xl flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-display text-lg text-text-primary mb-1">
                Compare Against Baseline
              </h4>
              <p className="text-caption text-text-secondary leading-relaxed">
                We compare what each player does in crunch moments against their own normal baseline. Do they raise their game (positive lift) or shrink under pressure?
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-rr-blue font-mono">
              Measures genuine gear shift
            </div>
          </div>

          <div className="bg-surface p-5 rounded-lg border border-border-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-rr-gold/20 text-rr-gold font-display text-xl flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-display text-lg text-text-primary mb-1">
                Score on 3 Dimensions
              </h4>
              <p className="text-caption text-text-secondary leading-relaxed">
                We grade on three things: Class against elite bowling/batting (40%), relative lift (35%), and matchday repeatability (25%).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-rr-gold font-mono">
              Balanced PRI calculation
            </div>
          </div>

          <div className="bg-surface p-5 rounded-lg border border-border-subtle relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-success/20 text-success font-display text-xl flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="font-display text-lg text-text-primary mb-1">
                Run the Fluke Filter
              </h4>
              <p className="text-caption text-text-secondary leading-relaxed">
                Small-sample luck is punished mathematically. Players with fewer pressure balls have their numbers pulled toward average until they prove sustained consistency.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-success font-mono">
              Eliminates one-hit wonders
            </div>
          </div>
        </div>
      </section>

      {/* THE DRESSING ROOM TRANSLATION MATRIX */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rr-pink">
            DRESSING ROOM DECODER
          </span>
          <h3 className="font-display text-2xl text-text-primary mt-1">
            CRICKET JARGON VS WHAT IT ACTUALLY MEANS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRANSLATIONS.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between hover:border-border-strong transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={t.accent}>{t.plainEnglish}</Badge>
                </div>
                <div className="font-mono text-xs text-text-muted mb-2 font-semibold">
                  Technical term: {t.jargon}
                </div>
                <p className="text-xs text-text-primary font-medium leading-relaxed mb-3">
                  {t.dressingRoomMeaning}
                </p>
              </div>

              <div className="p-3 bg-canvas/60 rounded border border-border-subtle text-[11px] text-text-secondary mt-2">
                <span className="text-text-muted block font-semibold mb-0.5">Match Example:</span>
                {t.cricketExample}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY THESE PLAYERS SPOTLIGHT */}
      <section className="bg-surface p-6 rounded-lg border border-border-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rr-gold">
              COACH'S CASE STUDIES
            </span>
            <h3 className="font-display text-xl text-text-primary mt-0.5">
              WHY DID THESE SPECIFIC PLAYERS WIN?
            </h3>
          </div>
          <Link to="/" className="text-xs text-rr-pink hover:underline font-semibold">
            View Complete Top 10 Lists →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-surface-elevated/40 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-text-primary">#1 BATTER: Tilak Varma (PRI 79.3)</span>
              <Badge variant="pink">LHB · Middle Order</Badge>
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>The Finding:</strong> Tilak doesn't just hold an end up — his strike rate actually increases from 136.65 in normal overs to <strong>148.21</strong> under high pressure, across 352 deliveries. In 71.4% of tight finishes, his team successfully closed out the match.
            </p>
            <div className="text-[11px] text-rr-pink font-semibold">
              Coach Takeaway: The ideal pressure anchor who accelerates rather than absorbs dot balls.
            </div>
          </div>

          <div className="p-4 bg-surface-elevated/40 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-text-primary">#4 BATTER: Ashutosh Sharma (PRI 72.5)</span>
              <Badge variant="gold">RHB · Indian Finisher</Badge>
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>The Finding:</strong> Ashutosh represents the ultimate domestic clutch batter. Striking at 155+ in crunch overs with an uncanny ability to clear boundaries from ball one, while directly addressing Rajasthan Royals' biggest squad gap (Indian Lower-Order Finisher).
            </p>
            <div className="text-[11px] text-rr-gold font-semibold">
              Coach Takeaway: High-impact Indian right-hander available at realistic auction budgets.
            </div>
          </div>

          <div className="p-4 bg-surface-elevated/40 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-text-primary">#1 BOWLER: Abrar Ahmed (PRI 72.2)</span>
              <Badge variant="blue">Right-arm Leg-Break</Badge>
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>The Finding:</strong> While death pacers often leak runs, Abrar suffocates batters in high-pressure middle-to-death overs, holding a shrunk economy of <strong>7.42</strong> and an economy lift of +8.9% below match expectation.
            </p>
            <div className="text-[11px] text-rr-blue font-semibold">
              Coach Takeaway: Attacking spin that denies boundary access in crunch overs.
            </div>
          </div>

          <div className="p-4 bg-surface-elevated/40 rounded-lg border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-text-primary">#5 BOWLER: Jasprit Bumrah (PRI 62.2)</span>
              <Badge variant="success">Right-arm Fast</Badge>
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>The Finding:</strong> Bumrah has the highest cumulative runs saved (63.6 RSBE) across our entire 200,000-ball database. He is the gold standard benchmark: every pressure ball he bowls saves approximately 0.5 runs below the tournament average.
            </p>
            <div className="text-[11px] text-success font-semibold">
              Coach Takeaway: The historical benchmark against which all death pacers are calibrated.
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP FAQ ACCORDION */}
      <section className="bg-surface p-6 rounded-lg border border-border-subtle space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rr-gold">
            EXECUTIVE QUESTIONS & ANSWERS
          </span>
          <h3 className="font-display text-xl text-text-primary mt-0.5">
            QUESTIONS COACHES & FRANCHISE LEADERS ASK
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="rounded border border-border-subtle overflow-hidden bg-surface-elevated/30"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-3.5 px-4 text-left font-semibold text-xs text-text-primary flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-rr-pink text-sm font-mono shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-text-secondary leading-relaxed border-t border-border-subtle/50 bg-canvas/30">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </PageTransition>
  )
}
