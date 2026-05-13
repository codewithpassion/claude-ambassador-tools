import { useState, useEffect } from "react"
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom"
import { BarChart3, Users, QrCode, Settings, Home } from "lucide-react"
import AttendeeAnalytics from "@/components/AttendeeAnalytics"
import AttendancePlanner from "@/components/AttendancePlanner"
import QRCodeGenerator from "@/components/QRCodeGenerator"
import AISettingsPanel from "@/components/AISettingsPanel"
import StartPage from "@/components/StartPage"

type Tool = "home" | "analytics" | "planner" | "qr"

const NAV_ITEMS: { key: Tool; label: string; icon: typeof BarChart3; path: string }[] = [
  { key: "home", label: "Home", icon: Home, path: "/" },
  { key: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { key: "planner", label: "Attendance Planner", icon: Users, path: "/planner" },
  { key: "qr", label: "QR Generator", icon: QrCode, path: "/qr" },
]

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeTool = NAV_ITEMS.find(item => item.path === pathname)?.key ?? "home"

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
            onClick={() => navigate("/")}
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
              {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
                <button
                  key={key}
                  onClick={() => navigate(path)}
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
            <a
              href="https://github.com/codewithpassion/claude-ambassador-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1.5 rounded-lg text-[#6A6860] hover:text-[#9A9890] hover:bg-white/[0.03] transition-all"
              aria-label="GitHub repository"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
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
        <Routes>
          <Route path="/" element={<StartPage onSelect={(tool) => navigate(NAV_ITEMS.find(i => i.key === tool)!.path)} />} />
          <Route path="/analytics" element={<AttendeeAnalytics />} />
          <Route path="/planner" element={<AttendancePlanner />} />
          <Route path="/qr" element={<QRCodeGenerator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global AI Settings Modal */}
      {showSettings && (
        <AISettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
