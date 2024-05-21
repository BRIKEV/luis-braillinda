import { Link, useFetcher, useSearchParams } from "@remix-run/react";

const ExerciseForm = () => {
  const fetcher = useFetcher<{ success: boolean }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const pageNumber = parseInt(page || "1");
  return (
    <fetcher.Form
      method="post"
      onSubmit={(event) => {
        fetcher.submit(event.currentTarget);
      }}
    >
      <div className="mb-2">
        <label
          htmlFor="solution"
          className="block text-sm font-medium text-gray-700"
        >
          Solución:
        </label>
        <input
          type="text"
          id="solution"
          name="solution"
          className="border border-gray-300 rounded-md p-1"
        />
      </div>
      <input type="hidden" name="page" value={pageNumber} />
      {fetcher.data?.success && (
        <div>
          <div className="text-green-500">Correcto!</div>
          <Link to={`/?page=${pageNumber + 1}`}>Continuar</Link>
        </div>
      )}
      {fetcher.data?.success === false && (
        <div className="text-red-500">Incorrecto!</div>
      )}
      <button
        className="bg-blue-500 text-white rounded-md p-1 mb-2"
        type="submit"
        disabled={fetcher.state === "loading"}
        hidden={fetcher.data?.success}
      >
        Enviar
      </button>
    </fetcher.Form>
  );
}

export default ExerciseForm;