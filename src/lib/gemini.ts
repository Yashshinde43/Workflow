/**
 * Google Gemini API utility.
 * Uses REST API with gemini-1.5-flash. Do not hardcode API keys.
 */

// Free tier: use gemini-2.5-flash-lite or gemini-2.5-flash (v1beta). Override with GEMINI_MODEL.
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const GEMINI_API_VERSION = "v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const DEFAULT_TIMEOUT_MS = 30_000;

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

/**
 * Call Gemini API with a text prompt. Returns the generated text.
 * Throws GeminiError on API errors, empty responses, or timeout.
 */
export async function generateWithGemini(
  prompt: string,
  options?: { timeoutMs?: number }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new GeminiError("GEMINI_API_KEY is not set", undefined, "MISSING_API_KEY");
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${GEMINI_API_BASE}/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let detail = res.statusText;
      let retrySeconds: number | undefined;
      try {
        const body = await res.json();
        const msg = body?.error?.message ?? "";
        detail = msg || JSON.stringify(body) || detail;
        // Parse "Please retry in X.XXs" for user-friendly message
        const retryMatch = msg.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
        if (retryMatch) retrySeconds = Math.ceil(Number(retryMatch[1]));
      } catch {
        // ignore
      }
      const isQuota = res.status === 429 || /quota|rate limit|limit: 0/i.test(detail);
      const friendly = isQuota
        ? `Gemini quota or rate limit reached. ${retrySeconds ? `Try again in ${retrySeconds} seconds.` : "Please try again in a minute."} See https://ai.google.dev/gemini-api/docs/rate-limits`
        : `Gemini API error: ${detail}`;
      throw new GeminiError(friendly, res.status, String(res.status));
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    if (!text) {
      throw new GeminiError("Gemini returned empty response", 200, "EMPTY_RESPONSE");
    }
    return text;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof GeminiError) throw err;
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new GeminiError("Gemini request timed out", undefined, "TIMEOUT");
      }
      throw new GeminiError(err.message, undefined, "UNKNOWN");
    }
    throw new GeminiError("Unknown error calling Gemini", undefined, "UNKNOWN");
  }
}
