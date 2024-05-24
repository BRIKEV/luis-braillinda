interface Props {
  icon: string;
}

export const Icon = ({ icon }: Props) => (
  <span className="material-symbols-outlined align-middle ml-2" translate="no">{icon}</span>
);
