import { useState, useEffect } from "react"
import { BarChart3, Users, QrCode, Settings, Home } from "lucide-react"
import AttendeeAnalytics from "@/components/AttendeeAnalytics"
import AttendancePlanner from "@/components/AttendancePlanner"
import QRCodeGenerator from "@/components/QRCodeGenerator"
import AISettingsPanel from "@/components/AISettingsPanel"
import StartPage from "@/components/StartPage"

type Tool = "home" | "analytics" | "planner" | "qr"

const NAV_ITEMS: { key: Tool; label: string; icon: typeof BarChart3 }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "planner", label: "Attendance Planner", icon: Users },
  { key: "qr", label: "QR Generator", icon: QrCode },
]

function App() {
  const [activeTool, setActiveTool] = useState<Tool>("home")
  const [showSettings, setShowSettings] = useState(false)

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#E8E6DF]">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0C0C0B]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setActiveTool("home")}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none"
          >
            <div className="w-6 h-6 rounded-md bg-[#7C6FCD] flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">C</span>
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:inline text-[#E8E6DF]">
              Claude Community Tools
            </span>
          </button>
          <div className="flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTool(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTool === key
                      ? "bg-[#7C6FCD]/15 text-[#C8C0FF] border border-[#7C6FCD]/25"
                      : "text-[#6A6860] hover:text-[#9A9890] hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>
            <div className="w-px h-5 bg-white/[0.08] mx-2" />
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-[#6A6860] hover:text-[#9A9890] hover:bg-white/[0.03] transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={activeTool === "home" ? "" : "max-w-7xl mx-auto px-4 sm:px-6 py-8"}>
        {activeTool === "home" && <StartPage onSelect={setActiveTool} />}
        {activeTool === "analytics" && <AttendeeAnalytics />}
        {activeTool === "planner" && <AttendancePlanner />}
        {activeTool === "qr" && <QRCodeGenerator />}
      </main>

      {/* Global AI Settings Modal */}
      {showSettings && (
        <AISettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
