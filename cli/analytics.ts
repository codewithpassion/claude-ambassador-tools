#!/usr/bin/env bun
// Attendee Analytics CLI — parse Luma CSV exports and display insights

import chalk from "chalk"
import { parseLumaCSV, analyseRows } from "./lib/shared"
import { renderAnalyticsDashboard } from "./lib/display"

function usage() {
  console.log(`
${chalk.bold.hex("#E8E6DF")("Attendee Analytics")}
${chalk.hex("#6A6860")("Parse a Luma CSV export and display role breakdowns, topic interests, and key insights.")}

${chalk.hex("#5A5855")("USAGE")}
  bun run cli/analytics.ts <path-to-csv>

${chalk.hex("#5A5855")("EXAMPLES")}
  bun run cli/analytics.ts ./exports/event-guests.csv
  bun run cli/analytics.ts ~/Downloads/luma-export.csv
`)
}

// Parse arguments
const args = process.argv.slice(2)
let csvPath = ""

for (const arg of args) {
  if (arg === "--help" || arg === "-h") {
    usage()
    process.exit(0)
  } else if (!arg.startsWith("-")) {
    csvPath = arg
  }
}

if (!csvPath) {
  console.error(chalk.hex("#F87171")("Error: No CSV file path provided.\n"))
  usage()
  process.exit(1)
}

// Read and parse CSV
try {
  const file = Bun.file(csvPath)
  const exists = await file.exists()
  if (!exists) {
    console.error(chalk.hex("#F87171")(`Error: File not found: ${csvPath}`))
    process.exit(1)
  }

  const text = await file.text()
  const rows = parseLumaCSV(text)

  if (rows.length === 0) {
    console.error(chalk.hex("#F87171")("Error: CSV file is empty or could not be parsed."))
    process.exit(1)
  }

  const data = analyseRows(rows)
  const filename = csvPath.split("/").pop() || csvPath

  console.log(renderAnalyticsDashboard(data, filename))

  // Experience level breakdown
  if (Object.keys(data.expCounts).length > 0) {
    console.log(chalk.hex("#5A5855")("── " + chalk.bold.hex("#9A9890")("EXPERIENCE LEVELS") + " " + "─".repeat(40)))
    console.log("")
    for (const [level, count] of Object.entries(data.expCounts).sort(
      (a, b) => b[1] - a[1]
    )) {
      const pct = Math.round((count / data.total) * 100)
      console.log(
        `  ${chalk.hex("#9A9890")(level.padEnd(35))} ${chalk.hex("#E8E6DF")(String(count).padStart(4))} ${chalk.hex("#6A6860")(`(${pct}%)`)}`
      )
    }
    console.log("")
  }
} catch (err) {
  console.error(
    chalk.hex("#F87171")(
      `Error: ${err instanceof Error ? err.message : "Could not parse CSV. Make sure it's a Luma guest export."}`
    )
  )
  process.exit(1)
}
