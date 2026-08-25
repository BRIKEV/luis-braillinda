import { useState } from "react";
import { Link, useFetcher } from "react-router";
import BlankItem from "./BlankItem";
import { buttonStyles } from "./styles";
import type { Blank } from "../data/content";

/** The action answers with the indices still to fix, so a reader who missed
 *  one of eight is told which one rather than just "no". */
interface Verdict {
  success: boolean;
  wrong?: number[];
}

interface Props {
  pageNumber: number;
  blanks: Blank[];
}

/**
 * The fill-in-the-blank exercise: braille words with one cell missing, and the
 * five accented vowels to choose from.
 *
 * Grading stays in `action.ts` with the other exercise, so the answers never
 * reach the browser. Picks are held in state only so the chosen sign can
 * emboss into the gap as you go; the radios are ordinary form controls and it
 * is still the form that gets submitted.
 */
export default function BlanksForm({ pageNumber, blanks }: Props) {
  const fetcher = useFetcher<Verdict>();
  const [picked, setPicked] = useState<Record<number, string>>({});

  const solved = fetcher.data?.success === true;
  const wrong = new Set(fetcher.data?.success === false ? (fetcher.data.wrong ?? []) : []);

  return (
    <fetcher.Form
      method="post"
      onSubmit={(event) => {
        fetcher.submit(event.currentTarget);
      }}
    >
      <ol className="mb-6 grid gap-4 sm:grid-cols-2">
        {blanks.map((blank, index) => (
          <BlankItem
            key={blank.word}
            blank={blank}
            index={index}
            picked={picked[index]}
            /* A fresh pick clears nothing: the verdict stays on screen until
               the reader checks again, so they can see what they changed. */
            onPick={(vowel) => setPicked((prev) => ({ ...prev, [index]: vowel }))}
            wrong={wrong.has(index)}
          />
        ))}
      </ol>

      <input type="hidden" name="page" value={pageNumber} />

      {solved && (
        <div>
          <p className="text-correct mb-4 font-bold" role="status">
            ¡Correcto!
          </p>
          <Link
            className={buttonStyles("primary")}
            to={{ search: `?page=${pageNumber + 1}` }}
            preventScrollReset
          >
            Continuar
          </Link>
        </div>
      )}

      {wrong.size > 0 && (
        <p className="text-error mb-4 font-bold" role="status">
          Te {wrong.size === 1 ? "queda" : "quedan"} {wrong.size} de {blanks.length}. Vuelve a
          intentarlo.
        </p>
      )}

      {!solved && (
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={fetcher.state === "loading"}
            className={buttonStyles("primary")}
          >
            Comprobar palabras
          </button>
          <Link
            className={buttonStyles("onPaper")}
            to={{ search: `?page=${pageNumber - 1}` }}
            preventScrollReset
          >
            Volver
          </Link>
        </div>
      )}
    </fetcher.Form>
  );
}
