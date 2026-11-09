import { ReactNode } from "react";
import { CheckIcon } from "./Icons";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-pink-light px-3 py-1 text-[11px] font-medium text-pink-dark">
      <CheckIcon className="shrink-0" />
      {children}
    </span>
  );
}
