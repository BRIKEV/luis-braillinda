import Message from "~/components/Messages";
import { Dialog } from "./Dialog";

interface Props {
  content: {
    message: string;
    author: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Log({ content, isOpen, onClose }: Props) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Historia</h2>
      {content.map((line, index) => (
        <Message key={index} message={line.message} author={line.author} />
      ))}
    </Dialog>
  );
}
