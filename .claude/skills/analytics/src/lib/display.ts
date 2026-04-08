// Terminal rendering helpers — self-contained for the analytics skill

import chalk from "chalk"
import Table from "cli-table3"
import type { AnalysisData } from "./shared"
import { ROLE_COLOURS, CHIP_STYLES } from "./shared"

export function sectionHeader(title: string): string {
  const line = "─".repeat(Math.max(0, (process.stdout.columns || 80) - title.length - 4))
  return chalk.hex("#5A5855")(`── ${chalk.bold.hex("#9A9890")(title)} ${line}`)
}

export function renderTopicChips(topics: { label: string; count: number }[]): string {
  return topics
    .map((t, i) => {
      const style = CHIP_STYLES[i % CHIP_STYLES.length]
      return chalk.bgHex(style.bg).hex(style.color)(` ${t.label} (${t.count}) `)
    })
    .join("  ")
}

export function renderBarChart(
  items: { label: string; count: number; pct: number }[]
): string {
  const termWidth = process.stdout.columns || 80
  const labelWidth = Math.max(...items.map((i) => i.label.length))
  const countWidth = Math.max(...items.map((i) => String(i.count).length))
  const pctWidth = 4
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

export function renderAnalyticsDashboard(data: AnalysisData, filename: string): string {
  const lines: string[] = []

  lines.push("")
  lines.push(chalk.bold.hex("#E8E6DF")("  Attendee Analytics"))
  lines.push(chalk.hex("#5A5855")(`  ${filename} — ${data.total} registrants`))
  lines.push("")

  lines.push(sectionHeader("MOST REQUESTED TOPICS"))
  lines.push("")
  lines.push("  " + renderTopicChips(data.topicCounts))
  lines.push("")

  lines.push(sectionHeader("ROLE / JOB FUNCTION"))
  lines.push("")
  lines.push(renderBarChart(data.rolesSorted))
  lines.push("")

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
