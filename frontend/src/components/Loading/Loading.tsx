import { Spinner } from "phosphor-react";

export function Loading() {
  return (
    <div className="flex items-center gap-1.5">
      <Spinner size={24} weight="bold" className="animate-spin" />
      Carregando
    </div>
  );
}
