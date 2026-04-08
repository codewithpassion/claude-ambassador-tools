#!/usr/bin/env bun
// QR Code Generator — self-contained script for the /qr skill

import QRCode from "qrcode"
import chalk from "chalk"

// Parse arguments
const args = process.argv.slice(2)
let text = ""
let outputPath = ""
let small = false

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--help" || arg === "-h") {
    console.log(`Usage: bun run qr.ts <text|url> [--output file.png] [--small]`)
    process.exit(0)
  } else if (arg === "--output" || arg === "-o") {
    outputPath = args[++i] || ""
  } else if (arg === "--small") {
    small = true
  } else if (!arg.startsWith("-")) {
    text = arg
  }
}

if (!text) {
  console.error(chalk.hex("#F87171")("Error: No text or URL provided."))
  process.exit(1)
}

try {
  const terminalQR = await QRCode.toString(text, {
    type: small ? "utf8" : "terminal",
    errorCorrectionLevel: "H",
    margin: 2,
  })

  console.log("")
  console.log(chalk.bold.hex("#E8E6DF")("  QR Code Generator"))
  console.log(chalk.hex("#6A6860")(`  Content: ${text}`))
  console.log("")
  console.log(terminalQR)

  if (outputPath) {
    if (!outputPath.endsWith(".png")) {
      outputPath += ".png"
    }
    await QRCode.toFile(outputPath, text, {
      width: 200,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "H",
    })
    console.log(chalk.hex("#4ADE80")(`  ✓ Saved to ${outputPath}`))
    console.log("")
  }
} catch (err) {
  console.error(
    chalk.hex("#F87171")(`Error generating QR code: ${err instanceof Error ? err.message : err}`)
  )
  process.exit(1)
}
