// Terminal rendering helpers for CLI tools

import chalk from "chalk"
import Table from "cli-table3"
import type {
  AnalysisData,
  Candidate,
  AIResult,
  ShortlistBucket,
} from "./shared"
import { ROLE_COLOURS, ROLE_CATEGORIES, CHIP_STYLES } from "./shared"

// ─── Section Headers ─────────────────────────────────────────────────────────

export function sectionHeader(title: string): string {
  const line = "─".repeat(Math.max(0, (process.stdout.columns || 80) - title.length - 4))
  return chalk.hex("#5A5855")(`── ${chalk.bold.hex("#9A9890")(title)} ${line}`)
}

// ─── Topic Chips ─────────────────────────────────────────────────────────────

export function renderTopicChips(topics: { label: string; count: number }[]): string {
  return topics
    .map((t, i) => {
      const style = CHIP_STYLES[i % CHIP_STYLES.length]
      return chalk.bgHex(style.bg).hex(style.color)(` ${t.label} (${t.count}) `)
    })
    .join("  ")
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

export function renderBarChart(
  items: { label: string; count: number; pct: number }[]
): string {
  const termWidth = process.stdout.columns || 80
  const labelWidth = Math.max(...items.map((i) => i.label.length))
  const countWidth = Math.max(...items.map((i) => String(i.count).length))
  const pctWidth = 4 // "XX%"
  // label + gap + bar + gap + pct + gap + count
  const barMaxWidth = Math.max(10, termWidth - labelWidth - countWidth - pctWidth - 8)
  const maxPct = items[0]?.pct || 1

  return items
    .map((item, i) => {
      const colour = ROLE_COLOURS[i % ROLE_COLOURS.length]
      const barLen = Math.max(1, Math.round((item.pct / maxPct) * barMaxWidth))
      const bar = "█".repeat(barLen)
      const label = item.label.padStart(labelWidth)
      const pct = `${item.pct}%`.padStart(pctWidth)
      const count = String(item.count).padStart(countWidth)
      return `${chalk.hex("#9A9890")(label)}  ${chalk.hex(colour)(bar)} ${chalk.hex("#6A6860")(pct)} ${chalk.hex("#5A5855")(count)}`
    })
    .join("\n")
}

// ─── Insight Cards ───────────────────────────────────────────────────────────

export function renderInsightCards(insights: { value: string | number; label: string }[]): string {
  const table = new Table({
    chars: {
      top: "─", "top-mid": "┬", "top-left": "┌", "top-right": "┐",
      bottom: "─", "bottom-mid": "┴", "bottom-left": "└", "bottom-right": "┘",
      left: "│", "left-mid": "├", mid: "─", "mid-mid": "┼",
      right: "│", "right-mid": "┤", middle: "│",
    },
    style: { "padding-left": 1, "padding-right": 1, border: ["gray"] },
    colWidths: [12, 55],
  })

  for (const insight of insights) {
    table.push([
      chalk.bold.hex("#E8E6DF")(String(insight.value).padStart(8)),
      chalk.hex("#6A6860")(insight.label),
    ])
  }

  return table.toString()
}

// ─── Analytics Dashboard ─────────────────────────────────────────────────────

export function renderAnalyticsDashboard(data: AnalysisData, filename: string): string {
  const lines: string[] = []

  lines.push("")
  lines.push(chalk.bold.hex("#E8E6DF")("  Attendee Analytics"))
  lines.push(chalk.hex("#5A5855")(`  ${filename} — ${data.total} registrants`))
  lines.push("")

  // Topics
  lines.push(sectionHeader("MOST REQUESTED TOPICS"))
  lines.push("")
  lines.push("  " + renderTopicChips(data.topicCounts))
  lines.push("")

  // Role distribution
  lines.push(sectionHeader("ROLE / JOB FUNCTION"))
  lines.push("")
  lines.push(renderBarChart(data.rolesSorted))
  lines.push("")

  // Key insights
  lines.push(sectionHeader("KEY INSIGHTS"))
  lines.push("")

  const topRole = data.rolesSorted[0]
  const founders = data.rolesSorted.find((r) => r.label.includes("Founder"))
  const students = data.rolesSorted.find((r) => r.label === "Students")

  lines.push(
    renderInsightCards([
      { value: data.dailyUsers, label: "Daily users who will want deep, advanced content" },
      { value: data.newUsers, label: "Brand new attendees who need live demos & basics" },
      { value: topRole?.count || 0, label: `${topRole?.label || "Engineers"} — largest single job function` },
      { value: founders?.count || 0, label: "Founders & C-suite looking at business impact" },
      { value: students?.count || 0, label: "Students eager to learn and upskill" },
      { value: `${data.smbPct}%`, label: "Work at SMBs / startups (1-500 employees)" },
    ])
  )

  lines.push("")
  return lines.join("\n")
}

// ─── Planner: Summary Stats ─────────────────────────────────────────────────

export function renderSummaryStats(stats: {
  total: number
  newCount: number
  neverSelected: number
  previouslyInvited: number
  topRole: string
}): string {
  const table = new Table({
    head: [
      chalk.hex("#5A5855")("Total"),
      chalk.hex("#5A5855")("New"),
      chalk.hex("#5A5855")("Never Selected"),
      chalk.hex("#5A5855")("Prev. Invited"),
      chalk.hex("#5A5855")("Top Role"),
    ],
    style: { head: [], border: ["gray"] },
  })

  table.push([
    chalk.bold.hex("#E8E6DF")(String(stats.total)),
    chalk.hex("#4ADE80")(String(stats.newCount)),
    chalk.hex("#FACC15")(String(stats.neverSelected)),
    chalk.hex("#7C6FCD")(String(stats.previouslyInvited)),
    chalk.hex("#9A9890")(stats.topRole),
  ])

  return table.toString()
}

// ─── Planner: Candidate Table ────────────────────────────────────────────────

function roleColour(candidate: Candidate): string {
  const idx = ROLE_CATEGORIES.indexOf(candidate.roleCategory)
  return ROLE_COLOURS[idx >= 0 ? idx : ROLE_COLOURS.length - 1]
}

function historyLabel(candidate: Candidate): string {
  if (!candidate.history.length) return chalk.hex("#4ADE80")("New")
  const wasInvited = candidate.history.some(
    (h) => h.status === "approved" || h.status === "attended" || h.checkedIn
  )
  if (wasInvited)
    return chalk.hex("#7C6FCD")(`Invited (${candidate.history.length})`)
  return chalk.hex("#FACC15")(
    `${candidate.history.length}x, never selected`
  )
}

export function renderCandidateTable(
  title: string,
  candidates: Candidate[]
): string {
  if (candidates.length === 0) {
    return `${sectionHeader(`${title} (0)`)}\n  ${chalk.hex("#6A6860")("No candidates in this category")}\n`
  }

  const lines: string[] = []
  lines.push(sectionHeader(`${title} (${candidates.length})`))

  const table = new Table({
    head: [
      chalk.hex("#5A5855")("Name"),
      chalk.hex("#5A5855")("Role"),
      chalk.hex("#5A5855")("Company"),
      chalk.hex("#5A5855")("Experience"),
      chalk.hex("#5A5855")("History"),
    ],
    style: { head: [], border: ["gray"] },
    colWidths: [22, 28, 20, 18, 20],
    wordWrap: true,
  })

  for (const c of candidates) {
    const colour = roleColour(c)
    table.push([
      chalk.hex("#E8E6DF")(c.name),
      chalk.hex(colour)("● ") + chalk.hex("#C8C6BE")(c.role.slice(0, 24)),
      chalk.hex("#9A9890")(c.company.slice(0, 18)),
      chalk.hex("#6A6860")(c.experienceLevel.slice(0, 16)),
      historyLabel(c),
    ])
  }

  lines.push(table.toString())
  return lines.join("\n")
}

// ─── Planner: AI Results Table ───────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 7) return "#4ADE80"
  if (score >= 4) return "#FACC15"
  return "#F87171"
}

export function renderAIResultsTable(
  results: AIResult[],
  candidateMap: Map<string, Candidate>
): string {
  const lines: string[] = []
  const recommended = results.filter((r) => r.recommended).length

  lines.push("")
  lines.push(
    sectionHeader(
      `AI INVITE LIST — ${recommended} recommended of ${results.length} evaluated`
    )
  )

  const table = new Table({
    head: [
      chalk.hex("#5A5855")("Score"),
      chalk.hex("#5A5855")("Name"),
      chalk.hex("#5A5855")("Role"),
      chalk.hex("#5A5855")("History"),
      chalk.hex("#5A5855")("Reasoning"),
    ],
    style: { head: [], border: ["gray"] },
    colWidths: [8, 20, 24, 18, undefined],
    wordWrap: true,
  })

  for (const r of results) {
    const c = candidateMap.get(r.candidateId)
    const colour = c ? roleColour(c) : "#6A6860"
    const scoreStr = r.recommended
      ? chalk.bold.hex(scoreColor(r.fitScore))(`${r.fitScore} ✓`)
      : chalk.hex(scoreColor(r.fitScore))(String(r.fitScore))

    table.push([
      scoreStr,
      chalk.hex("#E8E6DF")(c?.name || r.candidateId),
      chalk.hex(colour)("● ") + chalk.hex("#C8C6BE")((c?.role || "—").slice(0, 20)),
      c ? historyLabel(c) : "—",
      chalk.hex("#6A6860")(r.reasoning),
    ])
  }

  lines.push(table.toString())
  return lines.join("\n")
}
