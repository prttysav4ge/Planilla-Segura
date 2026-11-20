"use client";
import { useStore } from "@/lib/store";
import { Rol } from "@/lib/datos";

const ROLES: { id: Rol; label: string; corto: string }[] = [
  { id: "trabajador", label: "Trabajador", corto: "Trabajador" },
  { id: "rrhh", label: "RR. HH.", corto: "RR. HH." },
  { id: "mype", label: "MYPE", corto: "MYPE" },
  { id: "caja", label: "Caja municipal", corto: "Caja" },
];

export default function Encabezado() {
  const { rol, setRol, reiniciar } = useStore();
  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-sm font-bold text-white">PS</span>
          <span className="text-lg font-bold tracking-tight">Planilla Segura</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Datos simulados</span>
        </div>
        <button onClick={() => { if (confirm("¿Reiniciar la demo con los datos iniciales?")) reiniciar(); }}
          className="ml-auto text-xs text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
          Reiniciar demo
        </button>
        <nav className="order-last w-full sm:order-none sm:w-auto" aria-label="Ver como">
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRol(r.id)}
                className={`rounded-lg px-2 py-1.5 text-sm font-medium sm:px-3 ${
                  rol === r.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={rol === r.id}>
                <span className="sm:hidden">{r.corto}</span>
                <span className="hidden sm:inline">{r.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
