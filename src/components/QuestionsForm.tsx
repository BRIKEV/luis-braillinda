import { useState } from "react";
import { Link, useFetcher } from "react-router";
import QuestionItem from "./QuestionItem";
import { buttonStyles } from "./styles";
import type { Question } from "../data/content";

/** The action answers with the indices still to fix, so a reader who missed
 *  one of four is told which one rather than just "no". */
interface Verdict {
  success: boolean;
  wrong?: number[];
}

interface Props {
  pageNumber: number;
  questions: Question[];
}

/**
 * The yes/no exercise: questions about a braille text the reader has just
 * decoded, sí or no each, and one button that grades the lot.
 *
 * Grading stays in `action.ts` with the other two exercises, so the answers
 * never reach the browser — which matters more here than anywhere else, since
 * a yes/no answer that shipped to the client would be one coin flip away from
 * being read off it. Picks are held in state only so the radios can show what
 * is chosen; it is still the form that gets submitted.
 */
export default function QuestionsForm({ pageNumber, questions }: Props) {
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
      {/* One column, not two: a question is a sentence, and two columns of
          sentences read as a wall rather than a list. */}
      <ol className="mb-6 grid gap-3">
        {questions.map((question, index) => (
          <QuestionItem
            key={question.ask}
            question={question}
            index={index}
            picked={picked[index]}
            /* A fresh pick clears nothing: the verdict stays on screen until
               the reader checks again, so they can see what they changed. */
            onPick={(reply) => setPicked((prev) => ({ ...prev, [index]: reply }))}
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
          Te {wrong.size === 1 ? "queda" : "quedan"} {wrong.size} de {questions.length}. Vuelve a
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
            Comprobar respuestas
          </button>
          {/* The frases this asks about are on the card before, so Volver is
              how the reader goes back and reads them again rather than a way
              out of the exercise. */}
          <Link
            className={buttonStyles("onPaper")}
            to={{ search: `?page=${pageNumber - 1}` }}
            preventScrollReset
          >
            Volver a las frases
          </Link>
        </div>
      )}
    </fetcher.Form>
  );
}
