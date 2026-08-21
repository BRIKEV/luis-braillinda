import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode[] | ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-label={title}
      className="paper rounded-card shadow-lifted m-auto w-[min(38rem,calc(100vw-2rem))]
                 max-h-[85dvh] overflow-y-auto p-0 backdrop:bg-dusk-deep/70
                 backdrop:backdrop-blur-sm"
    >
      <div className="paper sticky top-0 flex items-center justify-between gap-4 border-b border-ink/12 px-5 py-4">
        <h2 className="text-2xl">{title}</h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="grid size-11 shrink-0 place-items-center rounded-full text-ink/70
                     hover:bg-ink/8 hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="px-5 pt-4 pb-6">{children}</div>
    </dialog>
  );
};
