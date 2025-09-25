// lib/highlight.ts (server-only)
import { createHighlighter } from "shiki";
import type { Root } from "hast";

const highlighterPromise = createHighlighter({
  themes: ["catppuccin-macchiato"],
  langs: ["tsx", "typescript", "javascript", "json", "css", "html"],
});

export async function highlightToHast(
  code: string,
  lang: "tsx" | "ts" | "js" | "json" | "css" | "html" = "tsx"
): Promise<Root> {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHast(code, { theme: "catppuccin-macchiato", lang });
}
