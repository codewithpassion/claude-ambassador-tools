// Shared planner logic — self-contained for the invite-planner skill

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
  type RoleCategory,
  categoriseRole,
  ROLE_COLUMNS,
} from "./luma-csv"

// ─── Planner Types & Logic ───────────────────────────────────────────────────

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

export interface UploadedFile {
  name: string
  rows: CSVRow[]
}

function getRoleFromRow(row: CSVRow): string {
  for (const col of ROLE_COLUMNS) {
    const val = (row[col] || "").trim()
    if (val) return val
  }
  return ""
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
