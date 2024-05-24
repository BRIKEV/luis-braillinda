import { useEffect, useRef } from "react";
import Message from "~/components/Messages";
import { Content } from "~/data/content";

interface Props {
  content: Content[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Log({ content, isOpen, onClose }: Props) {
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
      className="border border-gray-300 p-4 rounded-lg shadow-lg w-96 max-w-full"
      onClose={handleClose}
    >
      <h2 className="text-2xl font-bold mb-4">Historia</h2>
      {content.map((line, index) => (
        <Message key={index} message={line.message} author={line.author} />
      ))}
    </dialog>
  );
}
