import type { ReactNode } from "react";
import { BrailleMessage } from "./Braille/BrailleMessage";

const braillePattern = /<BRAILLE>([A-Za-z ]+)<\/BRAILLE>/g;
const lineBreakPattern = /<br>/g;

/**
 * Turns a `Content.message` into renderable parts, expanding the two inline
 * markup forms the story uses: `<BRAILLE>…</BRAILLE>` becomes embossed cells,
 * `<br>` becomes a line break.
 *
 * Extracted so the dialogue panel and the history dialog render identical
 * output — the history used to print the raw tags.
 */
export function parseMessage(message: string, size: "sm" | "md" | "lg" = "md") {
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;

  for (const [index, match] of [...message.matchAll(braillePattern)].entries()) {
    const [fullMatch, characters] = match;
    const matchIndex = match.index ?? 0;

    if (lastIndex < matchIndex) parts.push(message.substring(lastIndex, matchIndex));
    parts.push(
      <BrailleMessage key={`braille-${index}`} message={characters.toLowerCase()} size={size} />,
    );
    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < message.length) parts.push(message.substring(lastIndex));

  return parts.flatMap((part, index) => {
    if (typeof part !== "string") return part;
    return part.split(lineBreakPattern).flatMap((chunk, chunkIndex, all) => {
      const out: (string | ReactNode)[] = [];
      if (chunk) out.push(chunk);
      if (chunkIndex < all.length - 1) out.push(<br key={`br-${index}-${chunkIndex}`} />);
      return out;
    });
  });
}
