import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ink shadow-soft">
      {children}
    </span>
  );
}
