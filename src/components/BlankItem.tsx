import { BrailleCharacter } from "./Braille/BrailleCharacter";
import { accentAt, type Blank } from "../data/content";

/** The five signs this exercise drills, in the order a reader looks them up
 *  rather than the order the story invents them. */
const VOWELS = ["á", "é", "í", "ó", "ú"] as const;

/** Same footprint as a `md` cell, so a word does not jolt when the gap fills. */
const CELL = "w-7 gap-y-1 p-1 sm:w-8 sm:p-1.5";

interface Props {
  blank: Blank;
  /** Position in the exercise. Names the radio group and the legend. */
  index: number;
  picked?: string;
  onPick: (vowel: string) => void;
  /** Set once the reader has checked and this one did not pass. */
  wrong: boolean;
}

/**
 * One word of the fill-in exercise: its braille with a gap where the accented
 * vowel goes, and five signs to choose from.
 *
 * The braille itself is hidden from assistive tech — it is drawn dots, so
 * there is nothing there to feel — and the legend carries the word in words
 * instead: "Palabra 2: d, hueco, m, e, l, o". That is honest about what the
 * exercise can and cannot offer a reader who is not looking at the screen.
 */
export default function BlankItem({ blank, index, picked, onPick, wrong }: Props) {
  const gap = accentAt(blank.word);
  const spelled = [...blank.word]
    .map((char, position) => (position === gap ? "hueco" : char))
    .join(", ");

  return (
    <li className="rounded-card bg-ink/[0.035] p-3">
      <fieldset>
        <legend className="sr-only">
          Palabra {index + 1}: {spelled}
        </legend>

        {/* The word and the five signs are both rows of braille cells, so
            without a number, a tint and a rule between them the whole item
            reads as one long run of cells and you cannot tell the puzzle from
            the answers. Hidden from assistive tech: the legend already says
            which word this is, in a form that can actually be heard. */}
        <p
          aria-hidden="true"
          className="mb-2 font-sans text-xs font-bold tracking-wide text-ink/55 uppercase"
        >
          Palabra {index + 1}
        </p>

        <span
          aria-hidden="true"
          className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-2"
        >
          {[...blank.word].map((char, position) => {
            if (position !== gap) {
              return <BrailleCharacter key={position} character={char} order={position} />;
            }
            /* Keyed on the pick so changing your mind re-runs the embossing —
               the dots are drawn into the gap, which is the whole exercise. */
            if (picked) {
              /* Still outlined once filled. Eight words in, a reader checking
                 their work has to be able to see which cell was theirs — a
                 completed word gives that away nowhere else. */
              return (
                <span
                  key={`gap-${picked}`}
                  className="rounded-cell inline-flex outline-1 outline-dashed outline-offset-1 outline-[#94815f]"
                >
                  <BrailleCharacter character={picked} order={position} />
                </span>
              );
            }
            return (
              <span
                key="gap"
                className={`braille-blank rounded-cell grid shrink-0 grid-cols-2 justify-items-center ${CELL}`}
              >
                {Array.from({ length: 6 }, (_, dot) => (
                  <span key={dot} className="size-1.5 sm:size-2" />
                ))}
              </span>
            );
          })}
        </span>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-ink/15 pt-3">
          {VOWELS.map((vowel) => (
            <label key={vowel} className="cursor-pointer">
              <input
                type="radio"
                name={`blank-${index}`}
                value={vowel}
                checked={picked === vowel}
                onChange={() => onPick(vowel)}
                className="peer sr-only"
              />
              {/* Checked shows as a ring rather than a colour swap, so the
                  state does not rest on colour alone. Poppy is action-only and
                  stays on the button that checks the page. */}
              <span
                className="flex flex-col items-center gap-0.5 rounded-cell p-1
                  ring-ink peer-checked:ring-2 peer-focus-visible:ring-3
                  peer-focus-visible:ring-honey"
              >
                <BrailleCharacter character={vowel} size="sm" />
                <span className="font-sans text-sm font-bold text-ink/75">{vowel}</span>
              </span>
            </label>
          ))}
        </div>

        {wrong && (
          <p className="text-error mt-1 font-sans text-sm font-bold">
            {picked ? "Esta no es." : "Te falta esta."}
          </p>
        )}
      </fieldset>
    </li>
  );
}
