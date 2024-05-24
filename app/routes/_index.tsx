import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import ExerciseForm from "~/components/Form";
import Message from "~/components/Messages";
import { bookContent } from "~/data/content";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const userSolution = body.get("solution") as string;
  const page = body.get("page") as string;
  const pageNumber = parseInt(page || "1");
  const findContent = bookContent[pageNumber - 1];
  if (findContent.solution === userSolution) {
    return json({ success: true });
  }
  return json({ success: false }, { status: 400 });
};


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const pageNumber = parseInt(page || "1");
  const fullContent = bookContent.slice(0, pageNumber);
  if (page && pageNumber > 1) {
    const content = bookContent.slice(pageNumber - 1, pageNumber)[0];
    return {
      page: pageNumber,
      content,
      fullContent
    };
  }
  const content = bookContent.slice(0, 1)[0];
  return {
    page: 1,
    content,
    fullContent,
  };
};

export default function Index() {
  const { page, content, fullContent } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-full m-auto p-4 md:max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4">Luis y braillinda</h1>
      <Message message={content.message} author={content.author}>
        {content.exercise ? (
          <ExerciseForm />
        ): <Link className="main-button" to={`/?page=${page + 1}`}>Continuar</Link>}
      </Message>
      <h2 className="text-2xl font-bold mb-4">Historia</h2>
      <div>
        {fullContent.map((line, index) => (
          <Message key={index} message={line.message} author={line.author} />
        ))}
      </div>
    </div>
  );
}
