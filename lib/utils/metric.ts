export function normalizeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned || null;
}

export function classifyMetricTone(value: string | null | undefined): "positive" | "negative" | "neutral" {
  const text = normalizeText(value);
  if (!text || text === "—" || text.toLowerCase() === "n/a") return "neutral";
  if (/^-/.test(text)) return "negative";
  if (/^\+/.test(text)) return "positive";
  const numeric = Number.parseFloat(text.replace(/[^\d.-]/g, ""));
  if (!Number.isNaN(numeric)) {
    if (numeric > 0) return "positive";
    if (numeric < 0) return "negative";
  }
  return "neutral";
}

export function formatMetricDisplay(value: string | null | undefined): string {
  const text = normalizeText(value);
  if (!text || text === "—") return "N/A";
  return text;
}
