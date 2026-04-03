// Shared logic for CLI tools — re-exports from src/lib/luma-csv.ts + ported pure logic

export {
  type CSVRow,
  type RoleCategory,
  parseLumaCSV,
  categoriseRole,
  ROLE_COLUMNS,
  ROLE_CATEGORIES,
  ROLE_COLOURS,
  CHIP_STYLES,
} from "../../src/lib/luma-csv"

import {
  type CSVRow,
  type RoleCategory,
  parseLumaCSV,
  categoriseRole,
  ROLE_COLUMNS,
} from "../../src/lib/luma-csv"

// ─── Analytics Types & Logic (ported from AttendeeAnalytics.tsx) ─────────────

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

// ─── Planner Types & Logic (ported from AttendancePlanner.tsx) ───────────────

export type AudienceFilter =
  | "everyone"
  | "developers"
  | "founders"
  | "product-managers"
  | "marketers-gtm"
  | "operators"
  | "industry-specific"

export type ShortlistBucket = "new" | "not-recently-selected" | "previously-invited"

export interface EventAppearance {
  fileName: string
  status: string
  checkedIn: boolean
}

export interface Candidate {
  id: string
  name: string
  role: string
  roleCategory: RoleCategory
  company: string
  interests: string
  experienceLevel: string
  history: EventAppearance[]
}

export interface AIResult {
  candidateId: string
  fitScore: number
  recommended: boolean
  reasoning: string
}

export interface UploadedFile {
  name: string
  rows: CSVRow[]
}

export function matchesAudienceFilter(c: Candidate, filter: AudienceFilter): boolean {
  switch (filter) {
    case "everyone":
    case "industry-specific":
      return true
    case "developers":
      return (
        c.roleCategory === "Software Engineers / Devs" ||
        /engineer|developer|dev|sre|software/i.test(c.role)
      )
    case "founders":
      return c.roleCategory === "Founders / C-Suite / Directors"
    case "product-managers":
      return c.roleCategory === "Product / Design"
    case "marketers-gtm":
      return /market|growth|gtm|sales|business dev/i.test(c.role)
    case "operators":
      return c.roleCategory === "Management / Operations"
  }
}

export function buildCandidates(
  pastFiles: UploadedFile[],
  currentFile: UploadedFile
): { candidates: Candidate[]; buckets: Record<ShortlistBucket, Candidate[]> } {
  const historyMap = new Map<string, EventAppearance[]>()
  for (const file of pastFiles) {
    for (const row of file.rows) {
      const email = (row["email"] || "").toLowerCase().trim()
      if (!email) continue
      const appearances = historyMap.get(email) || []
      appearances.push({
        fileName: file.name,
        status: (row["approval_status"] || "").toLowerCase(),
        checkedIn: !!(row["checked_in_at"] || "").trim(),
      })
      historyMap.set(email, appearances)
    }
  }

  const waitlisted = currentFile.rows.filter((r) => {
    const status = (r["approval_status"] || "").toLowerCase()
    return (
      status === "waitlist" ||
      status === "declined" ||
      status === "pending_approval"
    )
  })

  const candidates: Candidate[] = []
  const buckets: Record<ShortlistBucket, Candidate[]> = {
    new: [],
    "not-recently-selected": [],
    "previously-invited": [],
  }

  let nextId = 0
  for (const row of waitlisted) {
    const email = (row["email"] || "").toLowerCase().trim()
    if (!email) continue
    const role = getRoleFromRow(row)
    const history = historyMap.get(email) || []
    const wasApproved = history.some(
      (h) =>
        h.status === "approved" || h.status === "attended" || h.checkedIn
    )

    let bucket: ShortlistBucket
    if (history.length === 0) bucket = "new"
    else if (!wasApproved) bucket = "not-recently-selected"
    else bucket = "previously-invited"

    const candidate: Candidate = {
      id: `candidate-${nextId++}`,
      name: (row["name"] || "").trim(),
      role,
      roleCategory: categoriseRole(role),
      company: (
        row["Where do you work or study? What is your title?"] || ""
      ).trim(),
      interests: (
        row[
          "What Claude Code features or capabilities are you most interested in discussing at this meetup?"
        ] || ""
      ).trim(),
      experienceLevel: (
        row["What is your experience level with Claude Code?"] || ""
      ).trim(),
      history,
    }

    candidates.push(candidate)
    buckets[bucket].push(candidate)
  }

  return { candidates, buckets }
}

// ─── AI Evaluation (adapted from ai-evaluate.ts for claude CLI) ─────────────

const BATCH_SIZE = 20

const SYSTEM_PROMPT = `You are an event attendance evaluator for a tech community. Given a description of the desired audience or event topic, evaluate each candidate's fit based on their survey answers (interests, role, experience level, company).

For each candidate, provide:
- fitScore: 1-10 score of how well they match the desired audience/topic
- reasoning: 1-2 sentences explaining the score
- recommended: true if fitScore >= 7

Return evaluations in the same order as the candidates provided. Use the candidateId (shown in square brackets) to identify each candidate.

Respond with valid JSON only: {"evaluations": [{"candidateId": "...", "fitScore": N, "reasoning": "...", "recommended": bool}, ...]}`

function buildUserPrompt(prompt: string, candidates: Candidate[]): string {
  const candidateList = candidates
    .map(
      (c, i) =>
        `${i + 1}. [${c.id}] ${c.name} — Role: ${c.role}, Company: ${c.company}, Interests: ${c.interests}, Experience: ${c.experienceLevel}`
    )
    .join("\n")

  return `Event/audience description: ${prompt}\n\nCandidates:\n${candidateList}`
}

async function evaluateBatchViaClaude(
  prompt: string,
  candidates: Candidate[]
): Promise<AIResult[]> {
  const fullPrompt = `<instructions>\n${SYSTEM_PROMPT}\n</instructions>\n\n${buildUserPrompt(prompt, candidates)}`

  const proc = Bun.spawn(["claude", "-p", fullPrompt], {
    stdout: "pipe",
    stderr: "pipe",
  })

  const output = await new Response(proc.stdout).text()
  const exitCode = await proc.exited

  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text()
    throw new Error(`claude CLI exited with code ${exitCode}: ${stderr}`)
  }

  // Strip markdown code fences if present
  let text = output.trim()
  text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "")

  // Try to extract JSON from the response
  const jsonStart = text.indexOf("{")
  const jsonEnd = text.lastIndexOf("}")
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    text = text.slice(jsonStart, jsonEnd + 1)
  }

  const parsed = JSON.parse(text)
  return parsed.evaluations
}

export async function evaluateCandidatesViaClaude(
  prompt: string,
  candidates: Candidate[],
  onProgress?: (completed: number, total: number) => void
): Promise<AIResult[]> {
  if (candidates.length <= BATCH_SIZE) {
    const results = await evaluateBatchViaClaude(prompt, candidates)
    onProgress?.(candidates.length, candidates.length)
    return results
  }

  const batches: Candidate[][] = []
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    batches.push(candidates.slice(i, i + BATCH_SIZE))
  }

  const allResults: AIResult[] = []
  for (let i = 0; i < batches.length; i++) {
    const results = await evaluateBatchViaClaude(prompt, batches[i])
    allResults.push(...results)
    onProgress?.(Math.min((i + 1) * BATCH_SIZE, candidates.length), candidates.length)
  }

  return allResults
}

// ─── CSV Export (adapted from InviteListModal.tsx) ───────────────────────────

export function buildInviteCSV(
  results: AIResult[],
  candidateMap: Map<string, Candidate>
): string {
  const headers = [
    "Name",
    "Role",
    "Company",
    "Experience Level",
    "Interests",
    "History",
    "Fit Score",
    "Recommended",
    "Reasoning",
  ]

  const rows = results.map((r) => {
    const c = candidateMap.get(r.candidateId)
    const historyLabel = !c?.history.length
      ? "New"
      : c.history.some(
            (h) =>
              h.status === "approved" ||
              h.status === "attended" ||
              h.checkedIn
          )
        ? `Invited (${c.history.length} events)`
        : `Applied ${c.history.length}x, never selected`
    return [
      c?.name || "",
      c?.role || "",
      c?.company || "",
      c?.experienceLevel || "",
      c?.interests || "",
      historyLabel,
      String(r.fitScore),
      r.recommended ? "Yes" : "No",
      r.reasoning,
    ]
  })

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  return [
    headers.join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n")
}
