import { useState, useEffect } from "react"

const STORAGE_KEY = "anthropic_api_key"

export default function AISettingsPanel({
  onClose,
}: {
  onClose: () => void
}) {
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [hasStored, setHasStored] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setApiKey(stored)
      setHasStored(true)
    }
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim())
      setHasStored(true)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      setHasStored(false)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey("")
    setHasStored(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
      <div className="bg-[#1C1917] border border-white/[0.1] rounded-2xl w-[95vw] max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#E8E6DF]">
            AI Settings
          </h2>
          <button
            onClick={onClose}
            className="text-lg text-[#6A6860] bg-transparent border-none cursor-pointer leading-none hover:text-[#9A9890]"
          >
            &times;
          </button>
        </div>

        <div className="text-xs text-[#9A9890] mb-3">
          Your API key is stored in your browser&apos;s localStorage only. It
          is never sent to any server other than the Anthropic API directly.
        </div>

        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#5A5855] uppercase tracking-[0.05em]">
            Anthropic API Key
          </label>
          {hasStored ? (
            <span className="flex items-center gap-1.5 text-[11px] text-[#4ADE80]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              Key stored
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-[#6A6860]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6A6860]" />
              No key
            </span>
          )}
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.12] rounded-lg text-sm text-[#E8E6DF] placeholder-[#5A5855] focus:outline-none focus:ring-1 focus:ring-[#7C6FCD]/40 focus:border-[#7C6FCD]/40 transition-all mb-4"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="text-[13px] font-medium text-[#C8C6BE] rounded-lg px-5 py-2 cursor-pointer transition-colors"
            style={{
              background: "rgba(124,111,205,0.2)",
              border: "0.5px solid rgba(124,111,205,0.4)",
            }}
          >
            {saved ? "Saved!" : "Save"}
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="text-xs text-[#E07070] bg-transparent border-none cursor-pointer hover:underline"
            >
              Clear key
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
