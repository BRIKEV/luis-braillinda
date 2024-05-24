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
          className="border border-gray-300 rounded-md p-1 block w-full"
        />
      </div>
      <input type="hidden" name="page" value={pageNumber} />
      {fetcher.data?.success && (
        <div>
          <div className="text-green-500 mb-2">Correcto!</div>
          <Link className="main-button" to={`/?page=${pageNumber + 1}`}>Continuar</Link>
        </div>
      )}
      {fetcher.data?.success === false && (
        <div className="text-red-500 mb-2">Incorrecto! prueba otra vez</div>
      )}
      {!fetcher.data?.success && (
        <button
          className="main-button"
          type="submit"
          disabled={fetcher.state === "loading"}
          hidden={fetcher.data?.success}
        >
          Comprobar palabra
        </button>
      )}
    </fetcher.Form>
  );
}

export default ExerciseForm;