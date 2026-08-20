import type { ActionFunctionArgs } from "react-router";
import { bookContent } from "../../data/content";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const userSolution = body.get("solution") as string;
  const page = body.get("page") as string;
  const pageNumber = parseInt(page || "1");
  const findContent = bookContent[pageNumber - 1];
  if (findContent.solution?.toLowerCase() === userSolution.toLowerCase()) {
    return { success: true };
  }
  return new Response(JSON.stringify({ success: false }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
