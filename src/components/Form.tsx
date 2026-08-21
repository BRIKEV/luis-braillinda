import { Link, useFetcher } from "react-router";
import { buttonStyles, inputStyles, labelStyles } from "./styles";

const ExerciseForm = ({ pageNumber }: { pageNumber: number }) => {
  const fetcher = useFetcher<{ success: boolean }>();

  return (
    <fetcher.Form
      method="post"
      onSubmit={(event) => {
        fetcher.submit(event.currentTarget);
      }}
    >
      <div className="mb-4">
        <label className={labelStyles} htmlFor="solution">
          ¿Qué pone aquí?
        </label>
        <input
          type="text"
          id="solution"
          name="solution"
          autoComplete="off"
          className={`${inputStyles} mt-2`}
        />
      </div>
      <input type="hidden" name="page" value={pageNumber} />

      {fetcher.data?.success && (
        <div>
          <p className="text-correct mb-4 font-bold">¡Correcto!</p>
          <Link
            className={buttonStyles("primary")}
            to={{ search: `?page=${pageNumber + 1}` }}
            preventScrollReset
          >
            Continuar
          </Link>
        </div>
      )}

      {fetcher.data?.success === false && (
        <p className="text-error mb-4 font-bold">No es esa. Vuelve a intentarlo.</p>
      )}

      {!fetcher.data?.success && (
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={fetcher.state === "loading"}
            className={buttonStyles("primary")}
          >
            Comprobar palabra
          </button>
          <Link
            className={buttonStyles("onPaper")}
            to={{ search: `?page=${pageNumber - 1}` }}
            preventScrollReset
          >
            Volver
          </Link>
        </div>
      )}
    </fetcher.Form>
  );
};

export default ExerciseForm;
