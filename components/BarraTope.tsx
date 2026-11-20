import { soles } from "@/lib/datos";

export default function BarraTope({ previo, nuevo, tope }: { previo: number; nuevo: number; tope: number }) {
  const pPrevio = Math.min(100, (previo / tope) * 100);
  const pNuevo = Math.min(100 - pPrevio, (nuevo / tope) * 100);
  const total = ((previo + nuevo) / tope) * 100;
  const excede = total > 100;
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-200" role="meter" aria-valuenow={Math.round(total)} aria-valuemin={0} aria-valuemax={100} aria-label="Tope de descuento usado">
        <div className="bg-slate-400" style={{ width: `${pPrevio}%` }} />
        <div className={excede ? "bg-red-600" : "bg-blue-700"} style={{ width: `${pNuevo}%` }} />
      </div>
      <p className={`mt-1.5 text-xs ${excede ? "font-semibold text-red-700" : "text-slate-600"}`}>
        {excede
          ? `Superas tu tope en ${soles(Math.round((previo + nuevo - tope) * 100) / 100)}. RR. HH. no podrá aprobarla.`
          : `Usas el ${Math.round(total)} % de tu tope de descuento disponible (${soles(tope)} al mes).`}
      </p>
      {previo > 0 && (
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-400" /> Ya comprometido: {soles(previo)}
          <span className={`ml-2 inline-block h-2 w-2 rounded-full ${excede ? "bg-red-600" : "bg-blue-700"}`} /> Esta compra
        </p>
      )}
    </div>
  );
}
