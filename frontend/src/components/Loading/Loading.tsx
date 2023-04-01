import { Spinner } from "@phosphor-icons/react";

interface LoadingProps {
  text?: string;
}

export function Loading({ text }: LoadingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Spinner size={24} weight="bold" className="animate-spin" />
      {text && <span>{text}</span>}
    </div>
  );
}
