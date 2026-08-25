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
  if (findContent.solution?.toLowerCase() === userSolution.toLowerCase()) {
    return { success: true };
  }
  return rejected({});
}
