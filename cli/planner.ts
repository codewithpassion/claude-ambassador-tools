#!/usr/bin/env bun
// Attendance Planner CLI — cross-reference past events, AI-rank candidates via claude CLI

import chalk from "chalk"
import {
  parseLumaCSV,
  buildCandidates,
  matchesAudienceFilter,
  evaluateCandidatesViaClaude,
  buildInviteCSV,
  ROLE_CATEGORIES,
  type AudienceFilter,
  type Candidate,
  type UploadedFile,
  type ShortlistBucket,
} from "./lib/shared"
import {
  sectionHeader,
  renderSummaryStats,
  renderCandidateTable,
  renderAIResultsTable,
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

function usage() {
  console.log(`
${chalk.bold.hex("#E8E6DF")("Attendance Planner")}
${chalk.hex("#6A6860")("Cross-reference past Luma events and AI-rank candidates for invite lists.")}

${chalk.hex("#5A5855")("USAGE")}
  bun run cli/planner.ts --past <csv...> --current <csv> [options]

${chalk.hex("#5A5855")("OPTIONS")}
  --past <files...>         Past event CSV files (one or more)
  --current <file>          Current event CSV file
  --query <text>            AI evaluation prompt (uses claude CLI)
  --filter <audience>       Filter by audience: ${AUDIENCE_FILTERS.join(", ")}
  --export <file.csv>       Export AI results as CSV
  --help, -h                Show this help

${chalk.hex("#5A5855")("EXAMPLES")}
  bun run cli/planner.ts --past event1.csv event2.csv --current event3.csv
  bun run cli/planner.ts --past past.csv --current current.csv \\
    --query "Claude for Founders — targeting founders and early-stage companies"
  bun run cli/planner.ts --past p1.csv p2.csv --current c.csv \\
    --filter developers --query "Developer meetup" --export invites.csv
`)
}

// ─── Parse Arguments ─────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const pastPaths: string[] = []
let currentPath = ""
let query = ""
let audienceFilter: AudienceFilter = "everyone"
let exportPath = ""

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--help" || arg === "-h") {
    usage()
    process.exit(0)
  } else if (arg === "--past") {
    // Collect all following args until next flag
    while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      pastPaths.push(args[++i])
    }
  } else if (arg === "--current") {
    currentPath = args[++i] || ""
  } else if (arg === "--query") {
    query = args[++i] || ""
  } else if (arg === "--filter") {
    const val = args[++i] || ""
    if (!AUDIENCE_FILTERS.includes(val as AudienceFilter)) {
      console.error(chalk.hex("#F87171")(`Error: Invalid filter "${val}". Valid: ${AUDIENCE_FILTERS.join(", ")}`))
      process.exit(1)
    }
    audienceFilter = val as AudienceFilter
  } else if (arg === "--export") {
    exportPath = args[++i] || ""
  }
}

if (pastPaths.length === 0 || !currentPath) {
  console.error(chalk.hex("#F87171")("Error: Both --past and --current are required.\n"))
  usage()
  process.exit(1)
}

// ─── Load CSVs ───────────────────────────────────────────────────────────────

async function loadCSV(path: string): Promise<UploadedFile> {
  const file = Bun.file(path)
  const exists = await file.exists()
  if (!exists) {
    console.error(chalk.hex("#F87171")(`Error: File not found: ${path}`))
    process.exit(1)
  }
  const text = await file.text()
  const rows = parseLumaCSV(text)
  const name = path.split("/").pop() || path
  return { name, rows }
}

try {
  const pastFiles = await Promise.all(pastPaths.map(loadCSV))
  const currentFile = await loadCSV(currentPath)

  console.log("")
  console.log(chalk.bold.hex("#E8E6DF")("  Attendance Planner"))
  console.log(
    chalk.hex("#6A6860")(
      `  Past events: ${pastFiles.map((f) => f.name).join(", ")} | Current: ${currentFile.name}`
    )
  )
  console.log("")

  // ─── Cross-Reference ────────────────────────────────────────────────────────

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

  // ─── AI Evaluation ──────────────────────────────────────────────────────────

  if (query) {
    // Check claude CLI is available
    try {
      const check = Bun.spawn(["claude", "--version"], {
        stdout: "pipe",
        stderr: "pipe",
      })
      await check.exited
    } catch {
      console.error(
        chalk.hex("#F87171")(
          "Error: 'claude' CLI not found. Install it from https://docs.anthropic.com/en/docs/claude-code"
        )
      )
      process.exit(1)
    }

    console.log(sectionHeader("AI EVALUATION"))
    console.log("")
    console.log(chalk.hex("#9A9890")(`  Query: ${query}`))
    console.log(
      chalk.hex("#6A6860")(`  Evaluating ${allFiltered.length} candidates via claude CLI...`)
    )

    const results = await evaluateCandidatesViaClaude(
      query,
      allFiltered,
      (completed, total) => {
        process.stdout.write(
          `\r  ${chalk.hex("#7C6FCD")(`Progress: ${completed}/${total} candidates`)}`
        )
      }
    )
    console.log("") // newline after progress

    const sorted = results.sort((a, b) => b.fitScore - a.fitScore)
    const candidateMap = new Map(allFiltered.map((c) => [c.id, c]))

    console.log(renderAIResultsTable(sorted, candidateMap))
    console.log("")

    // Export CSV if requested
    if (exportPath) {
      if (!exportPath.endsWith(".csv")) {
        exportPath += ".csv"
      }
      const csv = buildInviteCSV(sorted, candidateMap)
      await Bun.write(exportPath, csv)
      console.log(chalk.hex("#4ADE80")(`  ✓ Exported to ${exportPath}`))
      console.log("")
    }
  }
} catch (err) {
  console.error(
    chalk.hex("#F87171")(
      `Error: ${err instanceof Error ? err.message : "Failed to process CSV files."}`
    )
  )
  process.exit(1)
}
