#!/usr/bin/env bun
// QR Code Generator CLI — terminal-rendered QR codes with optional PNG export

import QRCode from "qrcode"
import chalk from "chalk"

function usage() {
  console.log(`
${chalk.bold.hex("#E8E6DF")("QR Code Generator")}
${chalk.hex("#6A6860")("Generate QR codes in the terminal or save as PNG.")}

${chalk.hex("#5A5855")("USAGE")}
  bun run cli/qr.ts <text|url> [options]

${chalk.hex("#5A5855")("OPTIONS")}
  --output, -o <file.png>   Save QR code as PNG file
  --small                   Use small (compact) rendering
  --help, -h                Show this help

${chalk.hex("#5A5855")("EXAMPLES")}
  bun run cli/qr.ts "https://claude.ai"
  bun run cli/qr.ts "https://lu.ma/my-event" --output event-qr.png
  bun run cli/qr.ts "Hello World" --small
`)
}

// Parse arguments
const args = process.argv.slice(2)
let text = ""
let outputPath = ""
let small = false

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--help" || arg === "-h") {
    usage()
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
  console.error(chalk.hex("#F87171")("Error: No text or URL provided.\n"))
  usage()
  process.exit(1)
}

// Generate and display QR code in terminal
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

  // Save as PNG if requested
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
