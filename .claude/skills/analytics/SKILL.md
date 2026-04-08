---
name: analytics
description: Parse a Luma CSV export and display attendee role breakdowns, topic interests, and key insights
disable-model-invocation: true
allowed-tools: Bash(bun *) Bash(cd *) Glob Read AskUserQuestion
argument-hint: <path-to-csv>
---

# Attendee Analytics

Analyse a Luma event CSV export and display a rich terminal dashboard with role breakdowns, topic interests, experience levels, and key insight metrics.

This skill is fully self-contained — all scripts are embedded in `${CLAUDE_SKILL_DIR}`.

## Workflow

1. **Get the CSV file path.** If `$ARGUMENTS` contains a file path, use it. Otherwise:
   - Use Glob to search for CSV files in the current directory and common locations: `**/*.csv`
   - If CSV files are found, use AskUserQuestion to let the user pick one (list the file names as options).
   - If no CSVs found, use AskUserQuestion to ask the user for the path:
     > Please provide the path to your Luma CSV export file.

2. **Verify the file exists.** Use Read to check the first few lines of the CSV file to confirm it looks like a Luma export (should have columns like `name`, `email`, `approval_status`). If it doesn't look right, warn the user.

3. **Ensure dependencies are installed** (this is a separate step — do NOT stay in this directory):
   ```bash
   cd ${CLAUDE_SKILL_DIR} && bun install --frozen-lockfile 2>/dev/null || bun install
   ```

4. **Run the analytics tool from the user's working directory** (NOT from the skill directory) so CSV paths resolve correctly:
   ```bash
   bun run ${CLAUDE_SKILL_DIR}/analytics.ts <path-to-csv>
   ```
   IMPORTANT: Do not `cd` into the skill directory before running this.

5. **Summarise the results.** After displaying the dashboard output, provide a brief natural-language summary highlighting:
   - The total number of registrants
   - The dominant role category and what that means for content planning
   - The top 2-3 requested topics
   - The split between experienced and new users
   - Any notable insight (e.g., high SMB percentage, many students, etc.)
   - Suggested talking points or session ideas based on the data

## Examples

- `/analytics ./exports/sf-meetup-guests.csv` — analyse a specific file
- `/analytics` — interactively find and select a CSV file

## Notes

- All CSV parsing happens locally — no data is sent to any server.
- The tool filters for active registrants (approved, waitlist, attended status).
- Role categorisation uses keyword matching to bucket attendees into 8 categories.
- Topic detection covers 12 categories: Skills & Plugins, Agentic Workflows, Multi-Agent Teams, Automation, Sub-Agents, Cowork, MCP, Code Quality, Vibe Coding, Context Management, Research & Writing, Non-SWE Usage.
