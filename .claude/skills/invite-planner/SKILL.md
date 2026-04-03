---
name: invite-planner
description: Cross-reference past Luma event CSVs with a current event to bucket and AI-rank candidates for invite lists
disable-model-invocation: true
allowed-tools: Bash(bun run *) Glob Read Write AskUserQuestion
argument-hint: --past <csv...> --current <csv>
---

# Invite Planner

Cross-reference past Luma event CSVs with a current event's guest list to identify new vs. returning candidates, then AI-rank them by fit for your target audience.

## Workflow

Follow these steps in order. Complete each step before moving to the next.

### Step 1: Gather CSV file paths

Parse `$ARGUMENTS` for `--past` and `--current` flags.

- `--past` should be followed by one or more CSV file paths (past event exports)
- `--current` should be followed by a single CSV file path (the event you're curating)

If arguments are missing or incomplete:
1. Use Glob to find CSV files: `**/*.csv`
2. Use AskUserQuestion to ask which files are the past events and which is the current event. Present the found CSV files as context. Example question:
   > I found these CSV files. Which ones are past events and which is the current event you're curating?
   > - file1.csv
   > - file2.csv
   > - file3.csv

### Step 2: Run the cross-reference script

Ensure dependencies are installed, then run the planner CLI to bucket candidates:

```bash
cd cli && bun install --frozen-lockfile 2>/dev/null || bun install
```

```bash
bun run cli/planner.ts --past <past-files...> --current <current-file>
```

**Do NOT pass `--query` flag.** We will handle AI evaluation natively in the next steps.

Present the cross-reference output to the user — it shows the summary stats and candidate buckets (New, Never Selected, Previously Invited).

### Step 3: Ask about target audience

Use AskUserQuestion to ask the user to describe their event and target audience:

> Now I'll evaluate each candidate's fit for your event. Please describe the target audience or event theme.
>
> For example: "Claude for Founders at Antler — targeting founders and early-stage companies building with AI"

### Step 4: Read candidate data from the CSV

Read the current event CSV file to extract candidate data. Parse the CSV and identify all waitlisted/declined/pending_approval candidates. For each candidate, extract:
- Name
- Role (from columns: "What is your role? (If Student, write Student)" or "Where do you work or study? What is your title?")
- Company (from: "Where do you work or study? What is your title?")
- Interests (from: "What Claude Code features or capabilities are you most interested in discussing at this meetup?")
- Experience level (from: "What is your experience level with Claude Code?")

### Step 5: Evaluate candidates

You are now acting as the event attendance evaluator. For each candidate from Step 4, evaluate their fit against the user's target audience description from Step 3.

**Evaluation criteria:**
- **fitScore** (1-10): How well the candidate matches the desired audience/event topic, based on their role, company, interests, and experience level.
- **reasoning**: 1-2 sentences explaining the score.
- **recommended**: `true` if fitScore >= 7.

**Scoring guidelines:**
- 9-10: Perfect match — role, interests, and experience directly align with the event theme
- 7-8: Strong match — most attributes align well, minor gaps
- 5-6: Moderate match — some relevant attributes but not a strong fit
- 3-4: Weak match — limited alignment with the target audience
- 1-2: Poor match — almost no alignment

### Step 6: Present results

Display the evaluation results as a **markdown table** sorted by fitScore descending:

| Score | Rec | Name | Role | Company | Reasoning |
|-------|-----|------|------|---------|-----------|
| 9 | ✓ | Alice Chen | Software Engineer | Acme Corp | Strong technical background with daily Claude usage... |
| 7 | ✓ | Bob Smith | Founder / CEO | StartupX | Founder actively exploring AI for business... |
| 4 |   | Carol Davis | Product Manager | BigCo | Some interest but role doesn't align closely... |

Include a summary line: **"X recommended of Y evaluated"**

### Step 7: Offer CSV export

Use AskUserQuestion to ask:

> Would you like me to export these results as a CSV file? If so, what filename? (e.g., invite-list-2024-03-15.csv)

If the user wants an export, use Write to create a CSV file with these columns:
`Name, Role, Company, Experience Level, Interests, History, Fit Score, Recommended, Reasoning`

Use proper CSV escaping (double-quote fields containing commas or quotes).

## Notes

- The cross-reference step (Step 2) uses the CLI tool for reliable bucketing logic.
- The AI evaluation (Step 5) is done natively by Claude — no subprocess or API key needed.
- Candidate emails are never included in output or exports (privacy).
- Only candidates with status `waitlist`, `declined`, or `pending_approval` are evaluated.
