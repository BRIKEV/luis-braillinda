import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Message from "~/components/Messages";
import { content } from "~/data/content";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const pageNumber = parseInt(page || "1");
  const fullContent = content.slice(0, pageNumber);
  if (page && pageNumber > 1) {
    return {
      page: pageNumber,
      content: content.slice(pageNumber - 1, pageNumber),
      fullContent
    };
  }
  return {
    page: 1,
    content: content.slice(0, 1),
    fullContent,
  };
};

export default function Index() {
  const { page, content, fullContent } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold underline">Luis y braillinda</h1>
      <Message message={content[0].message} author={content[0].author} />
      <Link to={`/?page=${page + 1}`}>Continuar</Link>
      <hr />
      <h2 className="text-2xl font-bold underline">Historia</h2>
      <div>
        {fullContent.map((line, index) => (
          <Message key={index} message={line.message} author={line.author} />
        ))}
      </div>
    </div>
  );
}
