// Shared analytics logic — self-contained for the analytics skill

export {
  type CSVRow,
  type RoleCategory,
  parseLumaCSV,
  categoriseRole,
  ROLE_COLUMNS,
  ROLE_CATEGORIES,
  ROLE_COLOURS,
  CHIP_STYLES,
} from "./luma-csv"

import {
  type CSVRow,
  categoriseRole,
  ROLE_COLUMNS,
} from "./luma-csv"

// ─── Analytics Types & Logic ─────────────────────────────────────────────────

export interface TopicCount {
  label: string
  count: number
}

export interface RoleEntry {
  label: string
  count: number
  pct: number
}

export interface AnalysisData {
  total: number
  dailyUsers: number
  newUsers: number
  smbPct: number
  smb500: number
  topicCounts: TopicCount[]
  rolesSorted: RoleEntry[]
  totalRoles: number
  expCounts: Record<string, number>
}

function getRoleFromRow(row: CSVRow): string {
  for (const col of ROLE_COLUMNS) {
    const val = (row[col] || "").trim()
    if (val) return val
  }
  return ""
}

export function analyseRows(rows: CSVRow[]): AnalysisData {
  const active = rows.filter((r) =>
    ["approved", "waitlist", "attended"].includes(
      (r["approval_status"] || "").toLowerCase()
    )
  )

  const expCol = "What is your experience level with Claude Code?"
  const sizeCol = "Number of employees at your company?"
  const topicsCol =
    "What Claude Code features or capabilities are you most interested in discussing at this meetup?"

  const expCounts: Record<string, number> = {}
  for (const r of active) {
    const v = (r[expCol] || "").trim()
    if (v) expCounts[v] = (expCounts[v] || 0) + 1
  }

  const roleCounts: Record<string, number> = {}
  for (const r of active) {
    const cat = categoriseRole(getRoleFromRow(r))
    roleCounts[cat] = (roleCounts[cat] || 0) + 1
  }
  const totalRoles = Object.values(roleCounts).reduce((a, b) => a + b, 0)

  const sizeCounts: Record<string, number> = {}
  for (const r of active) {
    const v = (r[sizeCol] || "").trim()
    if (v) sizeCounts[v] = (sizeCounts[v] || 0) + 1
  }
  const totalWithSize = Object.values(sizeCounts).reduce((a, b) => a + b, 0)
  const smb500 = sizeCounts["1-500"] || 0
  const smbPct =
    totalWithSize > 0 ? Math.round((smb500 / totalWithSize) * 100) : 0

  const topicDefs = [
    { label: "Skills & Plugins", keywords: ["skill", "plugin"] },
    { label: "Agentic Workflows", keywords: ["agentic", "agent workflow", "agentic workflow"] },
    { label: "Multi-Agent Teams", keywords: ["multi-agent", "multi agent", "agent team"] },
    { label: "Automation", keywords: ["automat"] },
    { label: "Sub-Agents", keywords: ["subagent", "sub-agent", "sub agent"] },
    { label: "Cowork", keywords: ["cowork"] },
    { label: "MCP", keywords: ["mcp"] },
    { label: "Code Quality", keywords: ["code quality", "best practice"] },
    { label: "Vibe Coding", keywords: ["vibe cod"] },
    { label: "Context Management", keywords: ["context"] },
    { label: "Research & Writing", keywords: ["research", "writing"] },
    { label: "Non-SWE Usage", keywords: ["non-swe", "non swe", "non-technical", "non technical"] },
  ]

  const topicCounts = topicDefs
    .map(({ label, keywords }) => ({
      label,
      count: active.filter((r) => {
        const t = (r[topicsCol] || "").toLowerCase()
        return keywords.some((kw) => t.includes(kw))
      }).length,
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)

  const dailyUsers = active.filter((r) => /daily/i.test(r[expCol] || "")).length
  const newUsers = active.filter((r) => /new but/i.test(r[expCol] || "")).length

  const rolesSorted = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / totalRoles) * 100),
    }))

  return {
    total: active.length,
    dailyUsers,
    newUsers,
    smbPct,
    smb500,
    topicCounts,
    rolesSorted,
    totalRoles,
    expCounts,
  }
}
