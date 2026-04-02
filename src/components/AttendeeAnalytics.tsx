import { useState, useCallback, useRef } from "react"
import { toBlob } from "html-to-image"
import {
  type CSVRow,
  parseLumaCSV,
  categoriseRole,
  ROLE_COLUMNS,
  ROLE_COLOURS,
  CHIP_STYLES,
} from "@/lib/luma-csv"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopicCount {
  label: string
  count: number
}

interface RoleEntry {
  label: string
  count: number
  pct: number
}

interface AnalysisData {
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

// ─── Analysis ─────────────────────────────────────────────────────────────────

function getRoleFromRow(row: CSVRow): string {
  for (const col of ROLE_COLUMNS) {
    const val = (row[col] || "").trim()
    if (val) return val
  }
  return ""
}

function analyseRows(rows: CSVRow[]): AnalysisData {
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
    {
      label: "Agentic Workflows",
      keywords: ["agentic", "agent workflow", "agentic workflow"],
    },
    {
      label: "Multi-Agent Teams",
      keywords: ["multi-agent", "multi agent", "agent team"],
    },
    { label: "Automation", keywords: ["automat"] },
    {
      label: "Sub-Agents",
      keywords: ["subagent", "sub-agent", "sub agent"],
    },
    { label: "Cowork", keywords: ["cowork"] },
    { label: "MCP", keywords: ["mcp"] },
    { label: "Code Quality", keywords: ["code quality", "best practice"] },
    { label: "Vibe Coding", keywords: ["vibe cod"] },
    { label: "Context Management", keywords: ["context"] },
    { label: "Research & Writing", keywords: ["research", "writing"] },
    {
      label: "Non-SWE Usage",
      keywords: ["non-swe", "non swe", "non-technical", "non technical"],
    },
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

  const dailyUsers = active.filter((r) =>
    /daily/i.test(r[expCol] || "")
  ).length
  const newUsers = active.filter((r) =>
    /new but/i.test(r[expCol] || "")
  ).length

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopicChip({ label, index }: { label: string; index: number }) {
  const style = CHIP_STYLES[index % CHIP_STYLES.length]
  return (
    <span
      className="inline-flex items-center whitespace-nowrap"
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500,
        lineHeight: "1",
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.color}22`,
      }}
    >
      {label}
    </span>
  )
}

function BarRow({
  label,
  count,
  pct,
  colour,
  maxPct,
}: {
  label: string
  count: number
  pct: number
  colour: string
  maxPct: number
}) {
  const barWidth = maxPct > 0 ? (pct / maxPct) * 100 : pct
  return (
    <div className="flex items-center mb-2.5 gap-2.5">
      <div className="w-[210px] text-right text-[13px] text-[#9A9890] shrink-0 leading-tight">
        {label}
      </div>
      <div className="flex-1 bg-white/[0.06] rounded h-7 overflow-hidden relative">
        <div
          className="h-7 rounded flex items-center pl-2.5 transition-all duration-500"
          style={{
            width: `${Math.max(barWidth, 4)}%`,
            minWidth: 52,
            background: colour,
          }}
        >
          <span className="text-xs font-semibold text-white/90">{pct}%</span>
        </div>
      </div>
      <div className="w-7 text-right text-[13px] text-[#6A6860] shrink-0">
        {count}
      </div>
    </div>
  )
}

function InsightCard({
  value,
  label,
}: {
  value: string | number
  label: string
}) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.1] rounded-[10px] p-4 text-center">
      <div className="text-[32px] font-semibold text-[#E8E6DF] leading-none mb-1.5">
        {value}
      </div>
      <div className="text-xs text-[#6A6860] leading-snug">{label}</div>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl px-6 py-5 mb-4">
      <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] mb-4">
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Upload Screen ─────────────────────────────────────────────────────────────

function UploadScreen({
  onData,
}: {
  onData: (data: AnalysisData, name: string) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.name.endsWith(".csv")) {
        setError("Please upload a .csv file.")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const rows = parseLumaCSV(e.target?.result as string)
          const data = analyseRows(rows)
          onData(data, file.name)
        } catch {
          setError(
            "Couldn't parse this CSV. Make sure it's a Luma guest export."
          )
        }
      }
      reader.readAsText(file)
    },
    [onData]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  const steps = [
    {
      num: "1",
      title: "Export from Luma",
      desc: "Go to your Luma event, click Manage, then export the guest list as CSV.",
    },
    {
      num: "2",
      title: "Upload here",
      desc: "Drop the CSV file below. We parse it entirely in your browser — nothing is sent to a server.",
    },
    {
      num: "3",
      title: "Get insights",
      desc: "See role breakdowns, topic interest, experience levels, and key stats. Copy the dashboard as an image to share.",
    },
  ]

  return (
    <div className="flex flex-col items-center py-10">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer max-w-[420px] w-full text-center rounded-2xl transition-all duration-200"
        style={{
          border: `1.5px dashed ${dragging ? "#7C6FCD" : "rgba(255,255,255,0.18)"}`,
          padding: "48px 56px",
          background: dragging
            ? "rgba(124,111,205,0.07)"
            : "rgba(255,255,255,0.02)",
        }}
      >
        <div className="text-4xl mb-3 opacity-50">&#8593;</div>
        <div className="text-[15px] font-medium text-[#C8C6BE] mb-2">
          Drop your Luma CSV here
        </div>
        <div className="text-[13px] text-[#6A6860]">or click to browse</div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <div className="mt-4 text-[13px] text-[#E07070]">{error}</div>
      )}

      {/* How it works */}
      <div className="max-w-2xl w-full mt-12">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] mb-5 text-center">
          How it works
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s) => (
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
        <div className="mt-6 text-center text-[11px] text-[#5A5855] leading-relaxed max-w-md mx-auto">
          All processing happens entirely in your browser. Your CSV data is never uploaded to any server.
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({
  data,
  filename,
  onReset,
}: {
  data: AnalysisData
  filename: string
  onReset: () => void
}) {
  const { total, dailyUsers, newUsers, smbPct, topicCounts, rolesSorted } = data
  const topRole = rolesSorted[0]
  const maxPct = rolesSorted[0]?.pct || 1
  const captureRef = useRef<HTMLDivElement>(null)
  const [copying, setCopying] = useState(false)

  const handleCopyImage = useCallback(async () => {
    if (!captureRef.current) return
    setCopying(true)
    try {
      const blob = await toBlob(captureRef.current, {
        backgroundColor: "#111110",
        pixelRatio: 2,
      })
      if (!blob) return
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
    } catch {
      // Clipboard API not supported
    } finally {
      setCopying(false)
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <div className="text-lg font-semibold text-[#E8E6DF]">
            Attendee Analytics
          </div>
          <div className="text-xs text-[#5A5855] mt-0.5">
            {filename} &mdash; {total} registrants
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#6A6860] bg-transparent border border-white/[0.12] rounded-lg px-3.5 py-1.5 cursor-pointer hover:text-[#9A9890] hover:border-white/[0.2] transition-colors"
        >
          Upload new file
        </button>
      </div>

      <div ref={captureRef} className="p-4" style={{ background: "#111110" }}>
        <SectionCard title="Most requested topics">
          <div className="flex flex-wrap gap-2">
            {topicCounts.map((t, i) => (
              <TopicChip key={t.label} label={t.label} index={i} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Role / Job Function">
          {rolesSorted.map((r, i) => (
            <BarRow
              key={r.label}
              label={r.label}
              count={r.count}
              pct={r.pct}
              colour={ROLE_COLOURS[i % ROLE_COLOURS.length]}
              maxPct={maxPct}
            />
          ))}
        </SectionCard>

        <SectionCard title="Key insights for tonight">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InsightCard
              value={dailyUsers}
              label="Daily users who will want deep, advanced content"
            />
            <InsightCard
              value={newUsers}
              label="Brand new attendees who need live demos & basics"
            />
            <InsightCard
              value={topRole?.count || 0}
              label={`${topRole?.label || "Engineers"} — largest single job function`}
            />
            <InsightCard
              value={
                rolesSorted.find((r) => r.label.includes("Founder"))?.count || 0
              }
              label="Founders & C-suite looking at business impact"
            />
            <InsightCard
              value={
                rolesSorted.find((r) => r.label === "Students")?.count || 0
              }
              label="Students eager to learn and upskill"
            />
            <InsightCard
              value={`${smbPct}%`}
              label="Work at SMBs / startups (1-500 employees)"
            />
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleCopyImage}
          disabled={copying}
          className="text-[13px] font-medium text-[#C8C6BE] bg-white/[0.06] border border-white/[0.12] rounded-lg px-5 py-2 cursor-pointer hover:bg-white/[0.1] transition-colors disabled:text-[#5A5855] disabled:cursor-default"
        >
          {copying ? "Copying..." : "Copy to Clipboard"}
        </button>
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function AttendeeAnalytics() {
  const [data, setData] = useState<AnalysisData | null>(null)
  const [filename, setFilename] = useState("")

  const handleData = useCallback((analysed: AnalysisData, name: string) => {
    setData(analysed)
    setFilename(name)
  }, [])

  const handleReset = useCallback(() => {
    setData(null)
    setFilename("")
  }, [])

  return data ? (
    <Dashboard data={data} filename={filename} onReset={handleReset} />
  ) : (
    <UploadScreen onData={handleData} />
  )
}
