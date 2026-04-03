---
name: qr
description: Generate QR codes for URLs or text, displayed in terminal or saved as PNG
disable-model-invocation: true
allowed-tools: Bash(bun run *) AskUserQuestion
argument-hint: <url-or-text> [--output file.png] [--small]
---

# QR Code Generator

Generate a QR code from a URL or text string. The QR code is rendered directly in the terminal using Unicode block characters. Optionally save it as a PNG file.

## Workflow

1. **Get the input text.** If `$ARGUMENTS` is provided, use it directly. If `$ARGUMENTS` is empty or missing, use AskUserQuestion to ask:
   > What URL or text would you like to encode as a QR code?

2. **Ensure dependencies are installed.** Run the install command first (it's fast if already installed):
   ```bash
   cd cli && bun install --frozen-lockfile 2>/dev/null || bun install
   ```

3. **Generate the QR code.** Run the CLI tool from the project root:
   ```bash
   bun run cli/qr.ts <text-or-url> [flags]
   ```
   Pass through any flags the user included (e.g. `--output event-qr.png`, `--small`).

4. **Report the result:**
   - If only terminal output was generated, let the user know they can also save as PNG with `--output <filename.png>`.
   - If `--output` was used, confirm the file was saved and mention the path.

## Examples

- `/qr https://lu.ma/my-event` — display QR in terminal
- `/qr https://claude.ai --output claude-qr.png` — display + save PNG
- `/qr "Hello World" --small` — compact terminal rendering

## Notes

- Error correction level is set to High (H), so the QR code remains scannable even if partially obscured.
- The terminal rendering uses ANSI colors with half-block Unicode characters — works in all modern terminals.
- PNG output is 200×200px with a 2px margin.
