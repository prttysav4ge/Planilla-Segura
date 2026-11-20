import { ReactNode } from "react";
import { Estado } from "@/lib/datos";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${className}`}>{children}</section>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{children}</p>;
}

export function Stat({ label, value, hint, destacado }: { label: string; value: ReactNode; hint?: string; destacado?: boolean }) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${destacado ? "border-blue-700 ring-1 ring-blue-700" : "border-slate-200"}`}>
      <p className={`text-xs ${destacado ? "font-semibold text-blue-700" : "text-slate-500"}`}>{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const estilos: Record<Estado, [string, string]> = {
  pendiente: ["Por aprobar", "bg-amber-50 text-amber-800 ring-amber-200"],
  aprobada: ["Por entregar", "bg-blue-50 text-blue-800 ring-blue-200"],
  entregada: ["Firmado", "bg-emerald-50 text-emerald-800 ring-emerald-200"],
  rechazada: ["Rechazada", "bg-slate-100 text-slate-600 ring-slate-200"],
};

export function EstadoChip({ estado }: { estado: Estado }) {
  const [txt, cls] = estilos[estado];
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>{txt}</span>;
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">{children}</p>;
}

export const btnPrimario =
  "inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500";
export const btnSecundario =
  "inline-flex items-center justify-center rounded-lg border border-blue-700 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white";
export const btnGris =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50";
