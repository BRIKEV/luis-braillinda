import { Link, useFetcher } from "react-router";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const ExerciseForm = ({ pageNumber }: { pageNumber: number }) => {
  const fetcher = useFetcher<{ success: boolean }>();
  return (
    <fetcher.Form
      method="post"
      onSubmit={(event) => {
        fetcher.submit(event.currentTarget);
      }}
    >
      <div className="mb-2">
        <Label
          className="mb-2"
          htmlFor="solution"
        >
          Solución:
        </Label>
        <Input
          type="text"
          id="solution"
          name="solution"
        />
      </div>
      <input type="hidden" name="page" value={pageNumber} />
      {fetcher.data?.success && (
        <div>
          <div className="text-green-700 mb-2">Correcto!</div>
          <Button variant="outline" render={(
            <Link to={{
              search: `?page=${pageNumber + 1}`,
            }} preventScrollReset>Continuar</Link>
          )} />
        </div>
      )}
      {fetcher.data?.success === false && (
        <div className="text-red-500 mb-2">Incorrecto! prueba otra vez</div>
      )}
      {!fetcher.data?.success && (
        <div className="flex gap-2">
          <Button variant="ghost" render={(
            <Link to={{
              search: `?page=${pageNumber - 1}`,
            }} preventScrollReset>Volver</Link>
          )} />
          <Button
            type="submit"
            disabled={fetcher.state === "loading"}
            hidden={fetcher.data?.success}
            variant="outline"
          >
            Comprobar palabra
          </Button>
        </div>
      )}
    </fetcher.Form>
  );
}

export default ExerciseForm;