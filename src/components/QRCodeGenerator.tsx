import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import QRCode from "qrcode"

export default function QRCodeGenerator() {
  const [searchParams] = useSearchParams()
  const [inputText, setInputText] = useState(searchParams.get("url") ?? "https://claude.ai")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasQR, setHasQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [logoEnabled, setLogoEnabled] = useState(true)
  const [logoSrc, setLogoSrc] = useState<string | null>("/clawd.svg")
  const logoInputRef = useRef<HTMLInputElement>(null)

  const drawLogo = useCallback(
    (canvas: HTMLCanvasElement, src: string) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const logoSize = canvas.width * 0.22
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2
        const pad = 4
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2)
        ctx.drawImage(img, x, y, logoSize, logoSize)
      }
      img.src = src
    },
    []
  )

  const updateQRCode = useCallback(async () => {
    if (!canvasRef.current || !inputText) {
      setHasQR(false)
      return
    }
    try {
      await QRCode.toCanvas(canvasRef.current, inputText, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      })
      if (logoEnabled && logoSrc) {
        drawLogo(canvasRef.current, logoSrc)
      }
      setHasQR(true)
    } catch {
      setHasQR(false)
    }
  }, [inputText, logoEnabled, logoSrc, drawLogo])

  useEffect(() => {
    const id = setTimeout(updateQRCode, 300)
    return () => clearTimeout(id)
  }, [updateQRCode])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png")
    link.download = "qrcode.png"
    link.click()
  }

  const handleCopy = async () => {
    if (!canvasRef.current) return
    try {
      // Try native clipboard image write first
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvasRef.current!.toBlob(resolve, "image/png")
        )
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          return
        }
      }
      // Fallback: copy the data URL as text
      const dataUrl = canvasRef.current.toDataURL("image/png")
      await navigator.clipboard.writeText(dataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Last resort: create a temporary link to download instead
      const link = document.createElement("a")
      link.href = canvasRef.current.toDataURL("image/png")
      link.download = "qrcode.png"
      link.click()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoSrc(ev.target?.result as string)
      setLogoEnabled(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="qr-input"
            className="block text-xs font-semibold tracking-[0.05em] uppercase text-[#5A5855] mb-2"
          >
            URL or Text
          </label>
          <div className="relative">
            <input
              id="qr-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter URL or text to generate QR code"
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[#E8E6DF] text-sm placeholder-[#5A5855] focus:outline-none focus:ring-2 focus:ring-[#7C6FCD]/40 focus:border-[#7C6FCD]/50 transition-all"
            />
            {inputText && (
              <button
                onClick={() => setInputText("")}
                className="absolute right-2 top-2 text-[#5A5855] hover:text-[#9A9890] text-lg leading-none transition-colors"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Logo option */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={logoEnabled}
              onChange={(e) => setLogoEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.2] bg-[#1C1917] text-[#7C6FCD] focus:ring-[#7C6FCD] focus:ring-offset-0"
            />
            <span className="text-sm text-[#9A9890]">Center logo</span>
          </label>
          {logoEnabled && (
            <div className="flex items-center gap-2">
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt="Logo preview"
                  className="w-6 h-6 rounded object-contain bg-white"
                />
              )}
              <button
                onClick={() => logoInputRef.current?.click()}
                className="text-xs text-[#7C6FCD] hover:text-[#9B8FE6] transition-colors"
              >
                {logoSrc ? "Change" : "Upload image"}
              </button>
              {logoSrc && logoSrc !== "/clawd.svg" && (
                <button
                  onClick={() => {
                    setLogoSrc("/clawd.svg")
                  }}
                  className="text-xs text-[#5A5855] hover:text-[#9A9890] transition-colors"
                >
                  Reset
                </button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-xl min-h-[220px] min-w-[220px] flex items-center justify-center">
            {inputText ? (
              <canvas ref={canvasRef} />
            ) : (
              <p className="text-[#A8A29E] text-sm">
                Enter text to generate QR code
              </p>
            )}
          </div>

          {hasQR && (
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-[#7C6FCD] hover:bg-[#6B5FBC] text-white rounded-lg transition-colors font-medium text-sm"
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-[#C8C6BE] border border-white/[0.1] rounded-lg transition-colors font-medium text-sm"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-[#5A5855] text-center">
          Supports URLs, email addresses, phone numbers, and plain text.
          Generated client-side.
        </p>
      </div>
    </div>
  )
}
