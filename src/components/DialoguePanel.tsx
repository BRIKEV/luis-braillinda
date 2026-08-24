import type { ReactNode } from "react";
import { parseMessage } from "./parseMessage";

/* Speaker colours come from each character's own artwork. Narration gets no
   chip at all: it is a different register, not a character with a name tag. */
const CHIPS: Record<string, string> = {
  luis: "bg-speaker-luis text-ink",
  braillinda: "bg-speaker-braillinda text-ink",
  abuela: "bg-speaker-abuela text-ink",
  "tu turno": "bg-speaker-turno text-parchment",
};

interface Props {
  author: string;
  message: string;
  /** 0–1. Drawn as a hairline across the top edge of the panel. */
  progress: number;
  children?: ReactNode;
}

export default function DialoguePanel({ author, message, progress, children }: Props) {
  const chip = CHIPS[author.toLowerCase()] ?? null;
  const isNarration = !chip;

  return (
    <div className="paper rounded-t-[1.75rem] shadow-lifted relative sm:rounded-card">
      {/* How far through the story you are. */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-t-[1.75rem] bg-ink/10 sm:rounded-t-card"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de la historia"
      >
        <div
          className="h-full bg-poppy transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(progress * 100, 1)}%` }}
        />
      </div>

      <div className="px-5 pt-6 pb-6 sm:px-8 sm:pt-7 sm:pb-7">
        {chip ? (
          <h2 className={`${chip} mb-3 inline-block rounded-full px-4 py-1 font-sans text-sm font-bold`}>
            {author}
          </h2>
        ) : (
          <h2 className="sr-only">{author}</h2>
        )}

        <div
          className={`text-pretty ${
            isNarration
              ? "font-display text-xl leading-relaxed text-ink/85 italic sm:text-2xl"
              : "text-lg leading-relaxed sm:text-xl"
          }`}
        >
          {parseMessage(message)}
        </div>

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
