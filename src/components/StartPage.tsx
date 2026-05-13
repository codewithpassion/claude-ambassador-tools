import { BarChart3, Users, QrCode, MonitorPlay } from "lucide-react"

type Tool = "analytics" | "planner" | "qr"

interface StartPageProps {
  onSelect: (tool: Tool) => void
}

// ─── Mini preview mockups ─────────────────────────────────────────────────────

function AnalyticsPreview() {
  const bars = [
    { label: "Founders", pct: 33, color: "#7C6FCD" },
    { label: "Other", pct: 29, color: "#C0496D" },
    { label: "Engineers", pct: 19, color: "#888780" },
    { label: "Students", pct: 8, color: "#1B9870" },
  ]
  const chips = [
    { label: "Skills & Plugins", bg: "#2D2260", color: "#C8C0FF" },
    { label: "Agentic Workflows", bg: "#5C1A3A", color: "#F4A8CC" },
    { label: "Sub-Agents", bg: "#0A3D2E", color: "#7ADDC0" },
    { label: "MCP", bg: "#0C2E55", color: "#7EC0F5" },
    { label: "Cowork", bg: "#4A1E08", color: "#F5C07A" },
  ]
  return (
    <div className="px-3 pt-2 pb-3 space-y-2.5">
      {/* Topic chips */}
      <div>
        <div className="text-[7px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] mb-1.5">
          Most Requested Topics
        </div>
        <div className="flex flex-wrap gap-1">
          {chips.map((c) => (
            <span
              key={c.label}
              className="text-[7px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: c.bg, color: c.color }}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>
      {/* Role bars */}
      <div>
        <div className="text-[7px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] mb-1.5">
          Role / Job Function
        </div>
        <div className="space-y-1">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span className="text-[7px] text-[#9A9890] w-14 text-right shrink-0">
                {b.label}
              </span>
              <div className="flex-1 bg-white/[0.06] rounded h-3 overflow-hidden">
                <div
                  className="h-full rounded flex items-center pl-1"
                  style={{ width: `${b.pct}%`, minWidth: 20, background: b.color }}
                >
                  <span className="text-[6px] font-semibold text-white/90">
                    {b.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Insight cards */}
      <div className="grid grid-cols-3 gap-1">
        {[
          { v: "63", l: "Daily users" },
          { v: "35", l: "New attendees" },
          { v: "63%", l: "SMBs" },
        ].map((c) => (
          <div
            key={c.l}
            className="bg-white/[0.04] border border-white/[0.08] rounded-md p-1.5 text-center"
          >
            <div className="text-[12px] font-semibold text-[#E8E6DF] leading-none">
              {c.v}
            </div>
            <div className="text-[5px] text-[#6A6860] mt-0.5">{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlannerPreview() {
  const rows = [
    { score: 10, role: "Co-Founder", history: "new", color: "#4ADE80" },
    { score: 10, role: "Founder & CEO", history: "2x", color: "#FACC15" },
    { score: 9, role: "Founder", history: "new", color: "#4ADE80" },
    { score: 9, role: "Startup Founder", history: "1x", color: "#FACC15" },
    { score: 8, role: "CTO", history: "inv", color: "#7C6FCD" },
    { score: 8, role: "CEO/CTO", history: "inv", color: "#7C6FCD" },
    { score: 7, role: "Director", history: "new", color: "#4ADE80" },
  ]
  return (
    <div className="px-3 pt-2 pb-3">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <div className="text-[8px] font-semibold text-[#E8E6DF]">
            Invite List
          </div>
          <div className="text-[6px] text-[#6A6860]">
            22 recommended of 75 evaluated
          </div>
        </div>
        <div className="text-[6px] px-1.5 py-0.5 rounded bg-[#7C6FCD]/20 border border-[#7C6FCD]/40 text-[#C8C6BE]">
          Export CSV
        </div>
      </div>
      {/* Table header */}
      <div className="flex items-center gap-2 text-[5px] font-semibold tracking-[0.08em] uppercase text-[#5A5855] border-b border-white/[0.08] pb-1 mb-0.5">
        <span className="w-6">Score</span>
        <span className="w-10">Name</span>
        <span className="flex-1">Role</span>
        <span className="w-8">History</span>
      </div>
      {/* Table rows */}
      <div className="space-y-0">
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-[3px] border-b border-white/[0.03]"
            style={{
              background:
                r.score >= 7 ? "rgba(74,222,128,0.04)" : "transparent",
            }}
          >
            <span className="w-6 flex items-center gap-0.5">
              <span
                className="text-[9px] font-bold"
                style={{
                  color:
                    r.score >= 7
                      ? "#4ADE80"
                      : r.score >= 4
                        ? "#FACC15"
                        : "#F87171",
                }}
              >
                {r.score}
              </span>
              <span className="text-[4px] font-bold px-0.5 rounded bg-[#4ADE80]/15 text-[#4ADE80]">
                REC
              </span>
            </span>
            <span className="w-10 bg-white/[0.06] rounded h-2" />
            <span className="flex-1 flex items-center gap-1">
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: "#C0496D" }}
              />
              <span className="text-[7px] text-[#C8C6BE]">{r.role}</span>
            </span>
            <span className="w-8">
              <span
                className="text-[5px] px-1 py-[1px] rounded"
                style={{
                  background: `${r.color}15`,
                  border: `0.5px solid ${r.color}40`,
                  color: r.color,
                }}
              >
                {r.history === "new"
                  ? "New"
                  : r.history === "inv"
                    ? "Invited"
                    : `${r.history}, never sel.`}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QRPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-4">
      <div className="bg-white rounded-lg p-2 mb-2">
        {/* QR code pattern mockup using CSS grid */}
        <div className="w-[90px] h-[90px] relative">
          {/* Simplified QR pattern */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Corner squares */}
            <rect x="2" y="2" width="24" height="24" rx="2" fill="black" />
            <rect x="5" y="5" width="18" height="18" rx="1" fill="white" />
            <rect x="8" y="8" width="12" height="12" rx="1" fill="black" />

            <rect x="74" y="2" width="24" height="24" rx="2" fill="black" />
            <rect x="77" y="5" width="18" height="18" rx="1" fill="white" />
            <rect x="80" y="8" width="12" height="12" rx="1" fill="black" />

            <rect x="2" y="74" width="24" height="24" rx="2" fill="black" />
            <rect x="5" y="77" width="18" height="18" rx="1" fill="white" />
            <rect x="8" y="80" width="12" height="12" rx="1" fill="black" />

            {/* Data dots */}
            {[
              [30, 4],
              [34, 4],
              [42, 4],
              [50, 4],
              [54, 4],
              [62, 4],
              [66, 4],
              [30, 8],
              [38, 8],
              [46, 8],
              [58, 8],
              [66, 8],
              [30, 12],
              [42, 12],
              [50, 12],
              [58, 12],
              [62, 12],
              [30, 16],
              [34, 16],
              [46, 16],
              [54, 16],
              [66, 16],
              [30, 20],
              [38, 20],
              [42, 20],
              [50, 20],
              [62, 20],
              [4, 30],
              [12, 30],
              [20, 30],
              [30, 30],
              [42, 30],
              [54, 30],
              [66, 30],
              [78, 30],
              [90, 30],
              [8, 34],
              [16, 34],
              [34, 34],
              [46, 34],
              [58, 34],
              [70, 34],
              [82, 34],
              [4, 66],
              [12, 66],
              [24, 66],
              [34, 66],
              [46, 66],
              [58, 66],
              [70, 66],
              [82, 66],
              [94, 66],
              [8, 70],
              [20, 70],
              [30, 70],
              [42, 70],
              [54, 70],
              [66, 70],
              [78, 70],
              [90, 70],
              [30, 78],
              [38, 78],
              [50, 78],
              [62, 78],
              [74, 78],
              [86, 78],
              [30, 82],
              [42, 82],
              [54, 82],
              [66, 82],
              [78, 82],
              [90, 82],
              [30, 86],
              [34, 86],
              [46, 86],
              [58, 86],
              [70, 86],
              [82, 86],
              [94, 86],
              [30, 90],
              [38, 90],
              [50, 90],
              [62, 90],
              [74, 90],
              [86, 90],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="3" height="3" fill="black" />
            ))}

            {/* Center Clawd logo area */}
            <rect
              x="35"
              y="35"
              width="30"
              height="30"
              rx="2"
              fill="white"
            />
            <image
              href="/clawd.svg"
              x="37"
              y="37"
              width="26"
              height="26"
            />
          </svg>
        </div>
      </div>
      <div className="flex gap-1.5 mt-1">
        <div className="text-[7px] font-medium px-3 py-1 rounded bg-[#7C6FCD] text-white">
          Download
        </div>
        <div className="text-[7px] font-medium px-3 py-1 rounded bg-white/[0.06] border border-white/[0.1] text-[#C8C6BE]">
          Copy
        </div>
      </div>
    </div>
  )
}

function ScreensaverPreview() {
  return (
    <img
      src="/screen.png"
      alt="Event Screensaver preview"
      className="w-full h-full object-cover object-top"
    />
  )
}

// ─── Card component ───────────────────────────────────────────────────────────

function ToolCard({
  title,
  description,
  icon: Icon,
  preview,
  onClick,
  href,
}: {
  title: string
  description: string
  icon: typeof BarChart3
  preview: React.ReactNode
  onClick?: () => void
  href?: string
}) {
  const cls =
    "group text-left bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#7C6FCD]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer flex flex-col"
  const inner = (
    <>
      <div className="bg-[#111110] border-b border-white/[0.06] overflow-hidden h-[200px]">
        {preview}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="w-4 h-4 text-[#7C6FCD] group-hover:text-[#9B8FE6] transition-colors" />
          <h3 className="text-sm font-semibold text-[#E8E6DF] group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-xs text-[#6A6860] leading-relaxed">{description}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StartPage({ onSelect }: StartPageProps) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C6FCD] flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#E8E6DF]">
            Claude Community Ambassador Tools
          </h1>
        </div>
        <p className="text-sm text-[#6A6860]">
          Manage your Luma events, analyse attendees, and generate QR codes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl w-full">
        <ToolCard
          title="Attendee Analytics"
          description="Upload a Luma CSV to see role breakdowns, topic interest, and key insights. Copy the dashboard as an image."
          icon={BarChart3}
          preview={<AnalyticsPreview />}
          onClick={() => onSelect("analytics")}
        />
        <ToolCard
          title="Attendance Planner"
          description="Cross-reference past and current events. AI-rank candidates by fit and export invite lists."
          icon={Users}
          preview={<PlannerPreview />}
          onClick={() => onSelect("planner")}
        />
        <ToolCard
          title="QR Generator"
          description="Generate QR codes for event links with the Clawd logo. Download or copy to clipboard."
          icon={QrCode}
          preview={<QRPreview />}
          onClick={() => onSelect("qr")}
        />
        <ToolCard
          title="Event Screensaver"
          description="A fullscreen animated screensaver for Claude Community events. Runs in the browser, no install needed."
          icon={MonitorPlay}
          preview={<ScreensaverPreview />}
          href="https://screen.claudeambassadortools.com"
        />
      </div>
    </div>
  )
}
