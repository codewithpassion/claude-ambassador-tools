// Terminal rendering helpers — self-contained for the invite-planner skill

import chalk from "chalk"
import Table from "cli-table3"
import type { Candidate } from "./shared"
import { ROLE_COLOURS, ROLE_CATEGORIES } from "./shared"

export function sectionHeader(title: string): string {
  const line = "─".repeat(Math.max(0, (process.stdout.columns || 80) - title.length - 4))
  return chalk.hex("#5A5855")(`── ${chalk.bold.hex("#9A9890")(title)} ${line}`)
}

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
