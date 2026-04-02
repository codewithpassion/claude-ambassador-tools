import { useState, useCallback, useRef, useEffect } from "react"
import {
  type CSVRow,
  type RoleCategory,
  parseLumaCSV,
  categoriseRole,
  ROLE_COLUMNS,
  ROLE_CATEGORIES,
  ROLE_COLOURS,
} from "@/lib/luma-csv"
import {
  evaluateCandidates,
  type EvalCandidate,
} from "@/lib/ai-evaluate"
import AISettingsPanel from "@/components/AISettingsPanel"
import InviteListModal from "@/components/InviteListModal"

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "upload" | "results"
type AudienceFilter =
  | "everyone"
  | "developers"
  | "founders"
  | "product-managers"
  | "marketers-gtm"
  | "operators"
  | "industry-specific"
type ShortlistBucket = "new" | "not-recently-selected" | "previously-invited"

interface UploadedFile {
  name: string
  rows: CSVRow[]
}

interface EventAppearance {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleFromRow(row: CSVRow): string {
  for (const col of ROLE_COLUMNS) {
    const val = (row[col] || "").trim()
    if (val) return val
  }
  return ""
}

function matchesAudienceFilter(c: Candidate, filter: AudienceFilter): boolean {
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

function buildCandidates(
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl px-6 py-5 mb-4">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#5A5855]">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-[11px] font-semibold text-[#7C6FCD] bg-[#7C6FCD]/15 rounded-[10px] px-2 py-0.5">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function PersonCard({ candidate }: { candidate: Candidate }) {
  const catIndex = ROLE_CATEGORIES.indexOf(candidate.roleCategory)
  const colour = ROLE_COLOURS[catIndex >= 0 ? catIndex : ROLE_COLOURS.length - 1]
  const truncatedInterests =
    candidate.interests.length > 100
      ? candidate.interests.slice(0, 100) + "..."
      : candidate.interests

  return (
    <div
      className="py-3 px-4 bg-white/[0.02] rounded-r-lg mb-2"
      style={{ borderLeft: `3px solid ${colour}` }}
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-semibold text-sm text-[#E8E6DF]">
          {candidate.name}
        </span>
      </div>
      <div className="text-xs text-[#9A9890] mb-1">
        {candidate.role}
        {candidate.company && candidate.company !== candidate.role && (
          <> &mdash; {candidate.company}</>
        )}
      </div>
      {truncatedInterests && (
        <div className="text-xs text-[#6A6860] mb-1">{truncatedInterests}</div>
      )}
      <div className="flex gap-2 flex-wrap">
        {candidate.experienceLevel && (
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.12] text-[#9A9890]">
            {candidate.experienceLevel}
          </span>
        )}
        {candidate.history.length > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#7C6FCD]/10 border border-[#7C6FCD]/25 text-[#9A9890]">
            {candidate.history.length} past event
            {candidate.history.length !== 1 ? "s" : ""} &mdash;{" "}
            {candidate.history
              .map((h) => h.fileName.replace(/\.csv$/, ""))
              .join(", ")}
          </span>
        )}
      </div>
    </div>
  )
}

function RoleGroup({
  category,
  candidates,
}: {
  category: RoleCategory
  candidates: Candidate[]
}) {
  const catIndex = ROLE_CATEGORIES.indexOf(category)
  const colour = ROLE_COLOURS[catIndex >= 0 ? catIndex : ROLE_COLOURS.length - 1]

  return (
    <div className="mb-4">
      <div
        className="text-xs font-semibold mb-2 flex items-center gap-1.5"
        style={{ color: colour }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: colour }}
        />
        {category} ({candidates.length})
      </div>
      {candidates.map((c) => (
        <PersonCard key={c.id} candidate={c} />
      ))}
    </div>
  )
}

function BucketSection({
  title,
  candidates,
}: {
  title: string
  candidates: Candidate[]
}) {
  const grouped = new Map<RoleCategory, Candidate[]>()
  for (const c of candidates) {
    const list = grouped.get(c.roleCategory) || []
    list.push(c)
    grouped.set(c.roleCategory, list)
  }

  const sortedGroups = [...grouped.entries()].sort(
    (a, b) =>
      ROLE_CATEGORIES.indexOf(a[0]) - ROLE_CATEGORIES.indexOf(b[0])
  )

  return (
    <SectionCard title={title} count={candidates.length}>
      {candidates.length === 0 ? (
        <div className="text-[13px] text-[#6A6860]">
          No candidates in this category
        </div>
      ) : (
        sortedGroups.map(([category, list]) => (
          <RoleGroup key={category} category={category} candidates={list} />
        ))
      )}
    </SectionCard>
  )
}

function StatCard({
  value,
  label,
  small,
}: {
  value: string | number
  label: string
  small?: boolean
}) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.1] rounded-[10px] p-4 text-center">
      <div
        className={`font-semibold text-[#E8E6DF] leading-none mb-1.5 ${small ? "text-sm text-[#7C6FCD] leading-snug" : "text-[32px]"}`}
      >
        {value}
      </div>
      <div className="text-xs text-[#6A6860]">{label}</div>
    </div>
  )
}

function FileChip({
  name,
  onRemove,
}: {
  name: string
  onRemove: () => void
}) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] rounded-lg px-3 py-1.5 text-[13px] text-[#C8C6BE]">
      <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {name}
      </span>
      <button
        onClick={onRemove}
        className="bg-transparent border-none text-[#6A6860] cursor-pointer text-base leading-none p-0 hover:text-[#9A9890]"
      >
        &times;
      </button>
    </div>
  )
}

function DropZone({
  label,
  multiple,
  files,
  onFiles,
  onRemove,
}: {
  label: string
  multiple: boolean
  files: UploadedFile[]
  onFiles: (newFiles: UploadedFile[]) => void
  onRemove: (index: number) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const toProcess = Array.from(fileList)
      const results: UploadedFile[] = []
      let pending = toProcess.length

      for (const file of toProcess) {
        if (!file.name.endsWith(".csv")) {
          setError("Please upload .csv files only.")
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const rows = parseLumaCSV(e.target?.result as string)
            results.push({ name: file.name, rows })
          } catch {
            setError(
              `Couldn't parse ${file.name}. Make sure it's a Luma guest export.`
            )
          }
          pending--
          if (pending === 0 && results.length > 0) {
            setError(null)
            onFiles(results)
          }
        }
        reader.readAsText(file)
      }
    },
    [onFiles]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles]
  )

  return (
    <div className="flex-1">
      <div className="text-xs font-semibold text-[#9A9890] mb-2 uppercase tracking-[0.05em]">
        {label}
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl text-center cursor-pointer min-h-[120px] flex flex-col items-center justify-center transition-all duration-200"
        style={{
          border: `1.5px dashed ${dragging ? "#7C6FCD" : "rgba(255,255,255,0.18)"}`,
          padding: "32px 24px",
          background: dragging
            ? "rgba(124,111,205,0.07)"
            : "rgba(255,255,255,0.02)",
        }}
      >
        <div className="text-[28px] mb-2 opacity-50">&#8593;</div>
        <div className="text-[13px] text-[#C8C6BE] mb-1">
          Drop {multiple ? "CSV files" : "a CSV file"} here
        </div>
        <div className="text-xs text-[#6A6860]">or click to browse</div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>
      {error && (
        <div className="mt-2 text-xs text-[#E07070]">{error}</div>
      )}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {files.map((f, i) => (
            <FileChip
              key={`${f.name}-${i}`}
              name={f.name}
              onRemove={() => onRemove(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── AI Evaluation ────────────────────────────────────────────────────────────

function AIEvaluation({
  candidates,
  textareaRef,
  onOpenSettings,
}: {
  candidates: Candidate[]
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onOpenSettings: () => void
}) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AIResult[]>([])
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasApiKey, setHasApiKey] = useState(
    () => !!localStorage.getItem("anthropic_api_key")
  )

  useEffect(() => {
    const check = () => setHasApiKey(!!localStorage.getItem("anthropic_api_key"))
    window.addEventListener("storage", check)
    window.addEventListener("focus", check)
    // Re-check periodically in case key is set from the same-page settings modal
    const interval = setInterval(check, 1000)
    return () => {
      window.removeEventListener("storage", check)
      window.removeEventListener("focus", check)
      clearInterval(interval)
    }
  }, [])

  const candidateMap = new Map(candidates.map((c) => [c.id, c]))

  const handleEvaluate = useCallback(async () => {
    if (!prompt.trim()) return
    const apiKey = localStorage.getItem("anthropic_api_key")
    if (!apiKey) {
      setHasApiKey(false)
      return
    }
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const evalCandidates: EvalCandidate[] = candidates.map((c) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        company: c.company,
        interests: c.interests,
        experienceLevel: c.experienceLevel,
      }))
      const evaluations = await evaluateCandidates(
        apiKey,
        prompt.trim(),
        evalCandidates
      )
      const sorted = evaluations.sort((a, b) => b.fitScore - a.fitScore)
      setResults(sorted)
      setShowModal(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Evaluation failed"
      )
    } finally {
      setLoading(false)
    }
  }, [prompt, candidates])

  return (
    <>
      <SectionCard title="AI Invite List">
        <div className="text-xs text-[#9A9890] mb-3">
          Describe your event or desired audience and the AI will rank all
          candidates by fit. Set your Anthropic API key in the top-right
          settings.
        </div>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Claude for Founders at Antler — targeting founders and early-stage companies"'
          className="w-full min-h-[80px] bg-white/[0.04] border border-white/[0.12] rounded-lg p-3 text-[13px] text-[#E8E6DF] resize-y mb-3 placeholder-[#5A5855] focus:outline-none focus:ring-1 focus:ring-[#7C6FCD]/40 focus:border-[#7C6FCD]/40 transition-all"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleEvaluate}
            disabled={loading || !prompt.trim() || !hasApiKey}
            className="text-[13px] font-medium rounded-lg px-5 py-2 transition-colors disabled:text-[#5A5855] disabled:bg-white/[0.03] disabled:cursor-default"
            style={{
              color: loading || !prompt.trim() || !hasApiKey ? undefined : "#C8C6BE",
              background:
                loading || !prompt.trim() || !hasApiKey ? undefined : "rgba(124,111,205,0.2)",
              border: "0.5px solid rgba(124,111,205,0.4)",
              cursor: loading || !prompt.trim() || !hasApiKey ? "default" : "pointer",
            }}
          >
            {loading ? "Evaluating..." : "Generate Invite List"}
          </button>
          {results.length > 0 && !loading && (
            <button
              onClick={() => setShowModal(true)}
              className="text-xs text-[#7C6FCD] bg-transparent border-none cursor-pointer underline"
            >
              View last results ({results.length})
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[13px]">
          {hasApiKey ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shrink-0" />
              <span className="text-[#9A9890]">API key stored</span>
              <span className="text-[#5A5855]">&middot;</span>
              <button
                onClick={() => {
                  localStorage.removeItem("anthropic_api_key")
                  setHasApiKey(false)
                }}
                className="text-[#E07070] bg-transparent border-none cursor-pointer text-[13px] p-0 hover:underline"
              >
                Delete key
              </button>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] shrink-0" />
              <span className="text-[#FACC15]/80">API key required</span>
              <span className="text-[#5A5855]">&middot;</span>
              <button
                onClick={onOpenSettings}
                className="text-[#7C6FCD] bg-transparent border-none cursor-pointer text-[13px] p-0 hover:underline"
              >
                Add in Settings
              </button>
            </>
          )}
        </div>
        {error && (
          <div className="text-[13px] text-[#E07070] mt-3">{error}</div>
        )}
      </SectionCard>
      {showModal && results.length > 0 && (
        <InviteListModal
          results={results}
          candidateMap={candidateMap}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

const FILTER_OPTIONS: { value: AudienceFilter; label: string }[] = [
  { value: "everyone", label: "Everyone" },
  { value: "developers", label: "Developers" },
  { value: "founders", label: "Founders" },
  { value: "product-managers", label: "Product Managers" },
  { value: "marketers-gtm", label: "Marketers / GTM" },
  { value: "operators", label: "Operators" },
  { value: "industry-specific", label: "Industry Specific" },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AttendancePlanner() {
  const [phase, setPhase] = useState<Phase>("upload")
  const [pastFiles, setPastFiles] = useState<UploadedFile[]>([])
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [buckets, setBuckets] = useState<
    Record<ShortlistBucket, Candidate[]>
  >({
    new: [],
    "not-recently-selected": [],
    "previously-invited": [],
  })
  const [audienceFilter, setAudienceFilter] =
    useState<AudienceFilter>("everyone")
  const [activeTab, setActiveTab] =
    useState<ShortlistBucket | "all">("all")
  const aiTextareaRef = useRef<HTMLTextAreaElement>(null!)
  const [showSettings, setShowSettings] = useState(false)

  const handleAnalyse = useCallback(() => {
    if (!currentFile || pastFiles.length === 0) return
    const result = buildCandidates(pastFiles, currentFile)
    setCandidates(result.candidates)
    setBuckets(result.buckets)
    setAudienceFilter("everyone")
    setActiveTab("all")
    setPhase("results")
  }, [pastFiles, currentFile])

  const handleReset = useCallback(() => {
    setPhase("upload")
    setPastFiles([])
    setCurrentFile(null)
    setCandidates([])
    setBuckets({
      new: [],
      "not-recently-selected": [],
      "previously-invited": [],
    })
    setAudienceFilter("everyone")
    setActiveTab("all")
  }, [])

  const canAnalyse = pastFiles.length > 0 && currentFile !== null

  const filterBucket = (list: Candidate[]) =>
    list.filter((c) => matchesAudienceFilter(c, audienceFilter))
  const filteredNew = filterBucket(buckets["new"])
  const filteredNotSelected = filterBucket(buckets["not-recently-selected"])
  const filteredPrevInvited = filterBucket(buckets["previously-invited"])
  const allFiltered = [
    ...filteredNew,
    ...filteredNotSelected,
    ...filteredPrevInvited,
  ]

  const roleCounts = new Map<RoleCategory, number>()
  for (const c of candidates) {
    roleCounts.set(c.roleCategory, (roleCounts.get(c.roleCategory) || 0) + 1)
  }
  let mostCommonRole: RoleCategory = "Other / Non-Tech"
  let maxRoleCount = 0
  for (const [role, count] of roleCounts) {
    if (count > maxRoleCount) {
      maxRoleCount = count
      mostCommonRole = role
    }
  }

  return (
    <div>
      {phase === "upload" && (
        <div>
          <div className="flex gap-6 mb-6 flex-wrap">
            <DropZone
              label="Past Events"
              multiple
              files={pastFiles}
              onFiles={(newFiles) =>
                setPastFiles((prev) => [...prev, ...newFiles])
              }
              onRemove={(i) =>
                setPastFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
            <DropZone
              label="Current Event"
              multiple={false}
              files={currentFile ? [currentFile] : []}
              onFiles={(newFiles) => {
                if (newFiles.length > 0) setCurrentFile(newFiles[0])
              }}
              onRemove={() => setCurrentFile(null)}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleAnalyse}
              disabled={!canAnalyse}
              className="text-sm font-medium rounded-lg px-8 py-2.5 transition-colors"
              style={{
                color: canAnalyse ? "#E8E6DF" : "#5A5855",
                background: canAnalyse
                  ? "rgba(124,111,205,0.25)"
                  : "rgba(255,255,255,0.03)",
                border: `0.5px solid ${canAnalyse ? "rgba(124,111,205,0.5)" : "rgba(255,255,255,0.08)"}`,
                cursor: canAnalyse ? "pointer" : "default",
              }}
            >
              Analyse
            </button>
          </div>

          {/* How it works */}
          <div className="max-w-3xl mx-auto mt-12">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] mb-5 text-center">
              How it works
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  num: "1",
                  title: "Upload past events",
                  desc: "Export guest CSVs from your previous Luma events. These build the attendance history.",
                },
                {
                  num: "2",
                  title: "Upload current event",
                  desc: "Export the guest list for the event you're curating. Waitlisted and pending candidates will be analysed.",
                },
                {
                  num: "3",
                  title: "Cross-reference",
                  desc: "Candidates are bucketed into New, Never Selected, and Previously Invited based on past history.",
                },
                {
                  num: "4",
                  title: "AI invite list",
                  desc: "Describe your target audience and Claude ranks every candidate by fit. Export the result as CSV.",
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
                >
                  <div className="w-6 h-6 rounded-full bg-[#7C6FCD]/15 border border-[#7C6FCD]/25 flex items-center justify-center text-xs font-semibold text-[#C8C0FF] mb-3">
                    {s.num}
                  </div>
                  <div className="text-sm font-medium text-[#E8E6DF] mb-1">
                    {s.title}
                  </div>
                  <div className="text-xs text-[#6A6860] leading-relaxed">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-[11px] text-[#5A5855] leading-relaxed max-w-xl mx-auto space-y-2">
              <p>
                CSV parsing, cross-referencing, and candidate bucketing all happen entirely in your browser. Your data is never uploaded to any server.
              </p>
              <p>
                <span className="text-[#9A9890]">AI Invite List privacy note:</span> When you use the AI-powered invite list generator, candidate names, roles, companies, interests, and experience levels are sent to the Anthropic API for evaluation. No email addresses or other contact details are included. Your Anthropic API key is stored locally in your browser and sent directly to Anthropic — it never passes through any other server. Review Anthropic's <a href="https://www.anthropic.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-[#7C6FCD] hover:underline">privacy policy</a> for how API data is handled.
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="text-lg font-semibold text-[#E8E6DF]">
              Cross-Reference Results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="text-xs text-[#6A6860] bg-transparent border border-white/[0.12] rounded-lg px-3.5 py-1.5 cursor-pointer hover:text-[#9A9890] hover:border-white/[0.2] transition-colors"
              >
                AI Settings
              </button>
              <button
                onClick={handleReset}
                className="text-xs text-[#6A6860] bg-transparent border border-white/[0.12] rounded-lg px-3.5 py-1.5 cursor-pointer hover:text-[#9A9890] hover:border-white/[0.2] transition-colors"
              >
                Upload new files
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <SectionCard title="Summary">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard value={candidates.length} label="Total candidates" />
              <StatCard
                value={buckets["new"].length}
                label="New applicants"
              />
              <StatCard
                value={buckets["not-recently-selected"].length}
                label="Never selected"
              />
              <StatCard
                value={buckets["previously-invited"].length}
                label="Previously invited"
              />
              <StatCard
                value={mostCommonRole}
                label="Most common role"
                small
              />
            </div>
          </SectionCard>

          {/* Audience filter + Create Invite List */}
          <div className="mb-4 flex items-center gap-2.5 flex-wrap">
            <select
              value={audienceFilter}
              onChange={(e) =>
                setAudienceFilter(e.target.value as AudienceFilter)
              }
              className="bg-white/[0.06] border border-white/[0.12] rounded-lg px-3 py-2 text-[13px] text-[#C8C6BE] cursor-pointer"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {audienceFilter !== "everyone" && (
              <span className="text-xs text-[#6A6860]">
                Showing {allFiltered.length} of {candidates.length}
              </span>
            )}
            <button
              onClick={() => {
                aiTextareaRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
                setTimeout(() => aiTextareaRef.current?.focus(), 400)
              }}
              className="ml-auto text-[13px] font-medium text-[#C8C6BE] rounded-lg px-4 py-2 cursor-pointer transition-colors"
              style={{
                background: "rgba(124,111,205,0.2)",
                border: "0.5px solid rgba(124,111,205,0.4)",
              }}
            >
              Create Invite List
            </button>
          </div>

          {/* Bucket tabs */}
          {(() => {
            const tabs: {
              key: ShortlistBucket | "all"
              label: string
              candidates: Candidate[]
            }[] = [
              { key: "all", label: "All", candidates: allFiltered },
              {
                key: "new",
                label: "New \u2014 Never Invited",
                candidates: filteredNew,
              },
              {
                key: "not-recently-selected",
                label: "Applied \u2014 Never Selected",
                candidates: filteredNotSelected,
              },
              {
                key: "previously-invited",
                label: "Previously Invited",
                candidates: filteredPrevInvited,
              },
            ]
            const active =
              tabs.find((t) => t.key === activeTab) || tabs[0]
            return (
              <>
                <div className="flex gap-0 mb-4 border-b border-white/[0.08] overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="px-4 py-2.5 text-[13px] bg-transparent border-none cursor-pointer transition-all whitespace-nowrap"
                      style={{
                        fontWeight: activeTab === tab.key ? 600 : 400,
                        color:
                          activeTab === tab.key ? "#E8E6DF" : "#6A6860",
                        borderBottom:
                          activeTab === tab.key
                            ? "2px solid #7C6FCD"
                            : "2px solid transparent",
                      }}
                    >
                      {tab.label}
                      <span
                        className="ml-1.5 text-[11px] font-semibold"
                        style={{
                          color:
                            activeTab === tab.key ? "#7C6FCD" : "#5A5855",
                        }}
                      >
                        {tab.candidates.length}
                      </span>
                    </button>
                  ))}
                </div>
                <BucketSection
                  title={active.label}
                  candidates={active.candidates}
                />
              </>
            )
          })()}

          {/* AI Evaluation */}
          <AIEvaluation
            candidates={allFiltered}
            textareaRef={aiTextareaRef}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
      )}

      {showSettings && (
        <AISettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
