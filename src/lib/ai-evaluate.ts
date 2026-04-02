// Browser-side AI evaluation using Anthropic API directly

export interface EvalCandidate {
  id: string
  name: string
  role: string
  company: string
  interests: string
  experienceLevel: string
}

export interface EvalResult {
  candidateId: string
  fitScore: number
  reasoning: string
  recommended: boolean
}

const BATCH_SIZE = 20

const SYSTEM_PROMPT = `You are an event attendance evaluator for a tech community. Given a description of the desired audience or event topic, evaluate each candidate's fit based on their survey answers (interests, role, experience level, company).

For each candidate, provide:
- fitScore: 1-10 score of how well they match the desired audience/topic
- reasoning: 1-2 sentences explaining the score
- recommended: true if fitScore >= 7

Return evaluations in the same order as the candidates provided. Use the candidateId (shown in square brackets) to identify each candidate.

Respond with valid JSON only: {"evaluations": [{"candidateId": "...", "fitScore": N, "reasoning": "...", "recommended": bool}, ...]}`

function buildUserPrompt(prompt: string, candidates: EvalCandidate[]): string {
  const candidateList = candidates
    .map(
      (c, i) =>
        `${i + 1}. [${c.id}] ${c.name} — Role: ${c.role}, Company: ${c.company}, Interests: ${c.interests}, Experience: ${c.experienceLevel}`
    )
    .join("\n")

  return `Event/audience description: ${prompt}\n\nCandidates:\n${candidateList}`
}

async function evaluateBatch(
  apiKey: string,
  prompt: string,
  candidates: EvalCandidate[]
): Promise<EvalResult[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: buildUserPrompt(prompt, candidates) },
      ],
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  let text = data.content?.[0]?.text || ""
  // Strip markdown code fences if the model wraps the JSON
  text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "")
  const parsed = JSON.parse(text)
  return parsed.evaluations
}

export async function evaluateCandidates(
  apiKey: string,
  prompt: string,
  candidates: EvalCandidate[]
): Promise<EvalResult[]> {
  if (candidates.length <= BATCH_SIZE) {
    return evaluateBatch(apiKey, prompt, candidates)
  }

  const batches: EvalCandidate[][] = []
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    batches.push(candidates.slice(i, i + BATCH_SIZE))
  }

  const results = await Promise.all(
    batches.map((batch) => evaluateBatch(apiKey, prompt, batch))
  )

  return results.flat()
}
