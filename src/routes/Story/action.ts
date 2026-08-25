import type { ActionFunctionArgs } from "react-router";
import { accentAt, bookContent } from "../../data/content";

/** A wrong answer is a deliberate 400: the fetcher surfaces the body as data,
 *  so the page can say what is wrong without a success flag meaning failure. */
const rejected = (body: object) =>
  new Response(JSON.stringify({ success: false, ...body }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });

/* Stray spaces never cost the reader anything — fourteen names in one box is
   a lot of typing — but capitals are graded on the one page whose answer
   carries them.

   Capitals are ignored, as they always have been — except on a page whose
   answer bothers to carry one. Only the page that invents the capital sign has
   any reason to care, and it says so by capitalising its own solution, so there
   is nothing extra to declare on the entry. */
const tidy = (text: string) => text.trim().replace(/\s+/g, " ");

const matches = (solution: string, answer: string) =>
  /[A-ZÁÉÍÓÚÜÑ]/.test(solution)
    ? tidy(solution) === tidy(answer)
    : tidy(solution).toLowerCase() === tidy(answer).toLowerCase();

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const page = body.get("page") as string;
  const pageNumber = parseInt(page || "1");
  const findContent = bookContent[pageNumber - 1];

  if (findContent.blanks) {
    /* One radio group per word, so an unanswered blank and a wrong one arrive
       the same way — as an index the reader still has to fix. The accepted
       signs are read off the words themselves: every one of them differs only
       at the gap, so its accented vowel is the answer it stands for. */
    const wrong = findContent.blanks.flatMap((blank, index) => {
      const answer = body.get(`blank-${index}`);
      const accepted = [blank.word, ...(blank.also ?? [])].map((word) => word[accentAt(word)]);
      return accepted.includes(answer as string) ? [] : [index];
    });

    return wrong.length ? rejected({ wrong }) : { success: true };
  }

  const userSolution = body.get("solution") as string;
  return matches(findContent.solution ?? "", userSolution) ? { success: true } : rejected({});
}
