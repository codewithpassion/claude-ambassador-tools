#!/usr/bin/env node
// Attendance Planner — self-contained script for the /invite-planner skill
// Handles cross-referencing and display only. AI evaluation is done natively by Claude in the skill.

import { readFileSync, existsSync } from "node:fs"
import chalk from "chalk"
import {
  parseLumaCSV,
  buildCandidates,
  matchesAudienceFilter,
  type AudienceFilter,
  type Candidate,
  type UploadedFile,
} from "./lib/shared"
import {
  sectionHeader,
  renderSummaryStats,
  renderCandidateTable,
} from "./lib/display"

const AUDIENCE_FILTERS: AudienceFilter[] = [
  "everyone",
  "developers",
  "founders",
  "product-managers",
  "marketers-gtm",
  "operators",
  "industry-specific",
]

// ─── Parse Arguments ─────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const pastPaths: string[] = []
let currentPath = ""
let audienceFilter: AudienceFilter = "everyone"

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--help" || arg === "-h") {
    console.log(`Usage: bun run planner.ts --past <csv...> --current <csv> [--filter <audience>]`)
    console.log(`Filters: ${AUDIENCE_FILTERS.join(", ")}`)
    process.exit(0)
  } else if (arg === "--past") {
    while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      pastPaths.push(args[++i])
    }
  } else if (arg === "--current") {
    currentPath = args[++i] || ""
  } else if (arg === "--filter") {
    const val = args[++i] || ""
    if (!AUDIENCE_FILTERS.includes(val as AudienceFilter)) {
      console.error(chalk.hex("#F87171")(`Error: Invalid filter "${val}". Valid: ${AUDIENCE_FILTERS.join(", ")}`))
      process.exit(1)
    }
    audienceFilter = val as AudienceFilter
  }
}

if (pastPaths.length === 0 || !currentPath) {
  console.error(chalk.hex("#F87171")("Error: Both --past and --current are required."))
  process.exit(1)
}

// ─── Load CSVs ───────────────────────────────────────────────────────────────

function loadCSV(path: string): UploadedFile {
  if (!existsSync(path)) {
    console.error(chalk.hex("#F87171")(`Error: File not found: ${path}`))
    process.exit(1)
  }
  const text = readFileSync(path, "utf-8")
  const rows = parseLumaCSV(text)
  const name = path.split("/").pop() || path
  return { name, rows }
}

try {
  const pastFiles = pastPaths.map(loadCSV)
  const currentFile = loadCSV(currentPath)

  console.log("")
  console.log(chalk.bold.hex("#E8E6DF")("  Attendance Planner"))
  console.log(
    chalk.hex("#6A6860")(
      `  Past events: ${pastFiles.map((f) => f.name).join(", ")} | Current: ${currentFile.name}`
    )
  )
  console.log("")

  const { candidates, buckets } = buildCandidates(pastFiles, currentFile)

  if (candidates.length === 0) {
    console.log(chalk.hex("#FACC15")("  No waitlisted/declined/pending candidates found in current event."))
    console.log(chalk.hex("#6A6860")("  Only candidates with status: waitlist, declined, or pending_approval are analyzed."))
    process.exit(0)
  }

  // Apply audience filter
  const filter = (list: Candidate[]) =>
    list.filter((c) => matchesAudienceFilter(c, audienceFilter))
  const filteredNew = filter(buckets["new"])
  const filteredNotSelected = filter(buckets["not-recently-selected"])
  const filteredPrevInvited = filter(buckets["previously-invited"])
  const allFiltered = [...filteredNew, ...filteredNotSelected, ...filteredPrevInvited]

  // Top role
  const roleCounts = new Map<string, number>()
  for (const c of candidates) {
    roleCounts.set(c.roleCategory, (roleCounts.get(c.roleCategory) || 0) + 1)
  }
  let topRole = ""
  let maxRoleCount = 0
  for (const [role, count] of roleCounts) {
    if (count > maxRoleCount) {
      topRole = role
      maxRoleCount = count
    }
  }

  // Summary
  console.log(sectionHeader("SUMMARY"))
  console.log("")
  console.log(
    renderSummaryStats({
      total: candidates.length,
      newCount: buckets["new"].length,
      neverSelected: buckets["not-recently-selected"].length,
      previouslyInvited: buckets["previously-invited"].length,
      topRole,
    })
  )
  console.log("")

  if (audienceFilter !== "everyone") {
    console.log(
      chalk.hex("#7C6FCD")(
        `  Filter: ${audienceFilter} — showing ${allFiltered.length} of ${candidates.length}`
      )
    )
    console.log("")
  }

  // Bucket tables
  console.log(renderCandidateTable("New — Never Invited", filteredNew))
  console.log("")
  console.log(renderCandidateTable("Applied — Never Selected", filteredNotSelected))
  console.log("")
  console.log(renderCandidateTable("Previously Invited", filteredPrevInvited))
  console.log("")
} catch (err) {
  console.error(
    chalk.hex("#F87171")(
      `Error: ${err instanceof Error ? err.message : "Failed to process CSV files."}`
    )
  )
  process.exit(1)
}
