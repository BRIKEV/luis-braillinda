import Messages from "./Messages";
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
    <Dialog isOpen={isOpen} onClose={onClose} title="Lo que va de historia">
      <div className="space-y-1">
        {content.map((line, index) => (
          <Messages key={index} author={line.author} message={line.message} />
        ))}
      </div>
    </Dialog>
  );
}
