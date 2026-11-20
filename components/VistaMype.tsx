"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Solicitud, campana, cuotaDe, empresa, getMype, getProducto, getTrabajador, mypes, precioDe, soles } from "@/lib/datos";
import { Card, EstadoChip, Kicker, Vacio, btnPrimario, btnSecundario } from "./ui";
import Autorizacion from "./Autorizacion";

export default function VistaMype() {
  const { solicitudes, entregar, avisar } = useStore();
  const [mypeId, setMypeId] = useState("calzados");
  const [doc, setDoc] = useState<Solicitud | null>(null);
  const m = getMype(mypeId);

  const deMype = solicitudes.filter((s) => s.mypeId === mypeId);
  const confirmadas = deMype.filter((s) => s.estado === "aprobada" || s.estado === "entregada");
  const porAprobar = deMype.filter((s) => s.estado === "pendiente").length;
  const venta = confirmadas.reduce((a, s) => a + precioDe(s), 0);
  const nEnt = confirmadas.filter((s) => s.estado === "entregada").length;
  const cobrado = confirmadas.filter((s) => s.estado === "entregada").reduce((a, s) => a + precioDe(s), 0);

  const consolidado = m.productos
    .map((p) => {
      const items = confirmadas.filter((s) => s.productoId === p.id);
      const tallas = p.tallas.map((t) => ({ talla: t, n: items.filter((s) => s.talla === t).length })).filter((x) => x.n > 0);
      return { p, total: items.length, tallas };
    })
    .filter((x) => x.total > 0);

  function onEntregar(s: Solicitud) {
    entregar(s.id);
    avisar({ texto: `Entrega firmada por ${getTrabajador(s.trabajadorId).nombre}. La caja abona ${soles(precioDe(s))} a ${m.nombre}.`, irA: "caja" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Kicker>{m.nombre} · {m.distrito}</Kicker>
          <h1 className="mt-1 text-2xl font-bold">Pedido consolidado</h1>
          <p className="text-sm text-slate-600">{campana.nombre} · {empresa.nombre} · solo produces lo ya aprobado por RR. HH.</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1 sm:w-auto">
          {mypes.map((x) => (
            <button key={x.id} onClick={() => setMypeId(x.id)} aria-pressed={x.id === mypeId}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${x.id === mypeId ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>
              {x.rubro}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">Qué fabricar</h2>
              <p className="text-sm text-slate-500">Venta asegurada: <b className="text-slate-900">{soles(venta)}</b></p>
            </div>
            <div className="mt-3 space-y-4">
              {consolidado.length === 0 && <Vacio>Aún no hay solicitudes aprobadas para {m.nombre}.</Vacio>}
              {consolidado.map(({ p, total, tallas }) => (
                <div key={p.id}>
                  <p className="font-medium">{p.emoji} Fabricar {total} {total === 1 ? p.unidadSingular : p.unidad} de {p.nombre.toLowerCase()}</p>
                  <p className="text-xs text-slate-500">
                    {tallas.map((x) => `${x.n} de talla ${x.talla}`).join(", ")}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {tallas.map((x) => (
                      <div key={x.talla} className="rounded-lg bg-slate-100 py-2 text-center">
                        <p className="text-xs text-slate-500">Talla {x.talla}</p>
                        <p className="text-lg font-bold tabular-nums">{x.n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-blue-700">
              Entrega: {campana.fechaEntrega} en {campana.lugarEntrega}
              {porAprobar > 0 && <span className="text-slate-500"> · {porAprobar} más esperando aprobación de RR. HH.</span>}
            </p>
          </Card>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Kicker>Caja municipal</Kicker>
            <p className="mt-1 font-semibold">{soles(cobrado)} abonados por {nEnt} {nEnt === 1 ? "entrega firmada" : "entregas firmadas"}</p>
            <p className="text-sm text-slate-600">Cobras apenas entregas. La caja cobra luego por planilla; tú no persigues a nadie.</p>
          </div>
        </div>

        <Card>
          <h2 className="font-semibold">Día de entrega</h2>
          <p className="text-xs text-slate-500">1) Genera la autorización prellenada, 2) entrega el producto y que el trabajador firme, 3) márcalo.</p>
          <div className="mt-3 divide-y divide-slate-100">
            {confirmadas.length === 0 && <Vacio>Sin entregas pendientes.</Vacio>}
            {confirmadas.map((s) => {
              const t = getTrabajador(s.trabajadorId);
              const p = getProducto(s.mypeId, s.productoId);
              return (
                <div key={s.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium">{t.nombre} · talla {s.talla}</p>
                      <p className="text-xs text-slate-500">{p.nombre} · {soles(cuotaDe(s))} × {s.cuotas} · {s.autorizacionId}</p>
                    </div>
                    <EstadoChip estado={s.estado} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => setDoc(s)} className={btnSecundario}>📄 Generar autorización</button>
                    {s.estado === "aprobada" && (
                      <button onClick={() => onEntregar(s)} className={`${btnPrimario} py-1.5`}>✓ Marcar entregado y firmado</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {doc && <Autorizacion s={doc} onClose={() => setDoc(null)} />}
    </div>
  );
}
