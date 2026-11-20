"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

const NOMBRES = { trabajador: "Trabajador", rrhh: "RR. HH.", mype: "MYPE", caja: "Caja" } as const;

export default function Aviso() {
  const { aviso, avisar, setRol } = useStore();
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => avisar(null), 9000);
    return () => clearTimeout(t);
  }, [aviso, avisar]);
  if (!aviso) return null;
  return (
    <div className="no-print fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div role="status" className="flex w-full max-w-lg items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
        <span className="flex-1">{aviso.texto}</span>
        {aviso.irA && (
          <button onClick={() => setRol(aviso.irA!)} className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">
            Ver como {NOMBRES[aviso.irA]} →
          </button>
        )}
        <button onClick={() => avisar(null)} aria-label="Cerrar" className="text-slate-400 hover:text-white">✕</button>
      </div>
    </div>
  );
}
