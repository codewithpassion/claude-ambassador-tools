import { useCallback } from "react"
import type { Candidate, AIResult } from "@/components/AttendancePlanner"
import { ROLE_CATEGORIES, ROLE_COLOURS } from "@/lib/luma-csv"

function scoreColor(score: number): string {
  if (score >= 7) return "#4ADE80"
  if (score >= 4) return "#FACC15"
  return "#F87171"
}

export default function InviteListModal({
  results,
  candidateMap,
  onClose,
}: {
  results: AIResult[]
  candidateMap: Map<string, Candidate>
  onClose: () => void
}) {
  const handleExportCSV = useCallback(() => {
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
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map(escape).join(",")),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invite-list-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [results, candidateMap])

  const recommended = results.filter((r) => r.recommended)

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#1C1917] border border-white/[0.1] rounded-2xl w-[95vw] max-w-[1280px] max-h-[85vh] flex flex-col text-[#E8E6DF]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] shrink-0">
          <div>
            <div className="text-lg font-semibold">Invite List</div>
            <div className="text-xs text-[#6A6860] mt-0.5">
              {recommended.length} recommended of {results.length} evaluated
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="text-xs font-medium text-[#C8C6BE] rounded-lg px-4 py-1.5 cursor-pointer transition-colors"
              style={{
                background: "rgba(124,111,205,0.2)",
                border: "0.5px solid rgba(124,111,205,0.4)",
              }}
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="text-lg text-[#6A6860] bg-transparent border-none cursor-pointer px-2 py-1 leading-none hover:text-[#9A9890]"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="sticky top-0 bg-[#1C1917] z-[1]">
                {["Score", "Name", "Role", "History", "Reasoning"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-2 py-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#5A5855] border-b border-white/[0.08] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const c = candidateMap.get(r.candidateId)
                const catIndex = c
                  ? ROLE_CATEGORIES.indexOf(c.roleCategory)
                  : -1
                const colour =
                  ROLE_COLOURS[
                    catIndex >= 0 ? catIndex : ROLE_COLOURS.length - 1
                  ]
                return (
                  <tr
                    key={r.candidateId}
                    className="border-b border-white/[0.04]"
                    style={{
                      background: r.recommended
                        ? "rgba(74,222,128,0.04)"
                        : "transparent",
                    }}
                  >
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      <span
                        className="text-sm font-bold"
                        style={{ color: scoreColor(r.fitScore) }}
                      >
                        {r.fitScore}
                      </span>
                      {r.recommended && (
                        <span className="ml-1 text-[9px] font-bold px-1 py-0.5 rounded bg-[#4ADE80]/15 text-[#4ADE80] align-middle">
                          REC
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 font-medium text-xs whitespace-nowrap">
                      {c?.name || r.candidateId}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="w-[7px] h-[7px] rounded-full inline-block shrink-0"
                          style={{ background: colour }}
                        />
                        <span className="text-[#C8C6BE]">
                          {c?.role || "\u2014"}
                        </span>
                      </span>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {(() => {
                        if (!c?.history.length)
                          return (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/25 text-[#4ADE80]">
                              New
                            </span>
                          )
                        const wasInvited = c.history.some(
                          (h) =>
                            h.status === "approved" ||
                            h.status === "attended" ||
                            h.checkedIn
                        )
                        if (wasInvited)
                          return (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#7C6FCD]/10 border border-[#7C6FCD]/25 text-[#9A9890]">
                              Invited ({c.history.length})
                            </span>
                          )
                        return (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FACC15]/10 border border-[#FACC15]/25 text-[#FACC15]">
                            {c.history.length}x, never selected
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-2 py-1.5 text-[#6A6860] text-[11px]">
                      {r.reasoning}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
