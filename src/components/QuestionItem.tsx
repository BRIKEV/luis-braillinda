import { REPLIES, type Question } from "../data/content";

/** Sí first, then no, the order the book prints them beside each question. */
const REPLY_ORDER = [REPLIES.yes, REPLIES.no] as const;

interface Props {
  question: Question;
  /** Position in the exercise. Names the radio group and numbers the legend. */
  index: number;
  picked?: string;
  onPick: (reply: string) => void;
  /** Set once the reader has checked and this one did not pass. */
  wrong: boolean;
}

/**
 * One question of the yes/no exercise: what it asks, and sí or no to answer.
 *
 * Unlike the fill-in blanks, nothing here is drawn — the question is words, so
 * the legend is the visible label rather than an sr-only translation of some
 * dots, and there is no `aria-hidden` half to keep in step with it. A reader
 * using a screen reader gets the same exercise, not a described one.
 */
export default function QuestionItem({ question, index, picked, onPick, wrong }: Props) {
  return (
    <li className="rounded-card bg-ink/[0.035] p-3">
      <fieldset className="flex flex-wrap items-center justify-between gap-3">
        <legend className="mb-2 font-sans text-base font-bold text-ink">
          {index + 1}. {question.ask}
        </legend>

        <div className="flex gap-2">
          {REPLY_ORDER.map((reply) => (
            <label key={reply} className="cursor-pointer">
              <input
                type="radio"
                name={`question-${index}`}
                value={reply}
                checked={picked === reply}
                onChange={() => onPick(reply)}
                className="peer sr-only"
              />
              {/* Checked shows as a ring and a darker border rather than a
                  colour swap, so the state never rests on colour alone. Flat,
                  not embossed: relief belongs to braille, and there is no
                  braille in this exercise at all. */}
              <span
                className="flex min-h-11 min-w-16 items-center justify-center rounded-full
                  border-2 border-ink/20 px-4 font-sans text-base font-bold text-ink/75
                  ring-ink peer-checked:border-ink peer-checked:text-ink peer-checked:ring-2
                  peer-focus-visible:ring-3 peer-focus-visible:ring-honey"
              >
                {reply}
              </span>
            </label>
          ))}
        </div>

        {wrong && (
          <p className="text-error w-full font-sans text-sm font-bold">
            {picked ? "Esta no es." : "Te falta esta."}
          </p>
        )}
      </fieldset>
    </li>
  );
}
