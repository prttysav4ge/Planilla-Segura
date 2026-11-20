"use client";
import { useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import {
  campana, comprometido, cuotaDe, cuotaMensual, empresa, getMype, getProducto, mypes, soles, tope, trabajadores, mesDescuento,
} from "@/lib/datos";
import { Card, EstadoChip, Kicker, Vacio, btnPrimario } from "./ui";
import BarraTope from "./BarraTope";

const CUOTAS = [1, 3, 6];

export default function VistaTrabajador() {
  const { solicitudes, reservar, avisar } = useStore();
  const [trabajadorId, setTrabajadorId] = useState("t1");
  const [sel, setSel] = useState<{ mypeId: string; productoId: string } | null>(null);
  const [talla, setTalla] = useState("");
  const [cuotas, setCuotas] = useState(3);
  const detalleRef = useRef<HTMLDivElement>(null);

  const t = trabajadores.find((x) => x.id === trabajadorId)!;
  const mias = solicitudes.filter((s) => s.trabajadorId === trabajadorId);
  const previo = useMemo(() => comprometido(trabajadorId, solicitudes, { incluirPendientes: true }), [trabajadorId, solicitudes]);
  const producto = sel ? getProducto(sel.mypeId, sel.productoId) : null;
  const mype = sel ? getMype(sel.mypeId) : null;
  const cuota = producto ? cuotaMensual(producto.precio, cuotas) : 0;

  function elegir(mypeId: string, productoId: string) {
    const p = getProducto(mypeId, productoId);
    setSel({ mypeId, productoId });
    setTalla(p.tallas.length === 1 ? p.tallas[0] : "");
    setCuotas(3);
    setTimeout(() => detalleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function onReservar() {
    if (!sel || !talla || !producto) return;
    reservar({ trabajadorId, mypeId: sel.mypeId, productoId: sel.productoId, talla, cuotas });
    avisar({ texto: `Reserva enviada: ${producto.nombre} talla ${talla}. Queda pendiente de aprobación de RR. HH.`, irA: "rrhh" });
    setSel(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Kicker>{empresa.nombre} · {campana.nombre}</Kicker>
          <h1 className="mt-1 text-2xl font-bold">Hola, {t.nombre.split(" ")[0]}</h1>
          <p className="text-sm text-slate-600">
            Pedidos hasta el {campana.fechaCorte} · entrega el {campana.fechaEntrega} en {campana.lugarEntrega}
          </p>
        </div>
        <label className="text-xs text-slate-500">
          Ingresar como (simulado)
          <select value={trabajadorId} onChange={(e) => { setTrabajadorId(e.target.value); setSel(null); }}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
            {trabajadores.map((x) => <option key={x.id} value={x.id}>{x.nombre} · {x.area}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          {mypes.map((m) => (
            <div key={m.id}>
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
                <h2 className="font-semibold">{m.nombre}</h2>
                <span className="text-xs text-slate-500">{m.distrito} · <span className="text-emerald-700">✓ Proveedor verificado</span></span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {m.productos.map((p) => {
                  const activo = sel?.mypeId === m.id && sel.productoId === p.id;
                  return (
                    <button key={p.id} onClick={() => elegir(m.id, p.id)}
                      className={`flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition hover:border-blue-400 ${activo ? "border-blue-700 ring-1 ring-blue-700" : "border-slate-200"}`}>
                      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-slate-100 text-3xl" aria-hidden>{p.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{p.nombre}</span>
                        <span className="block truncate text-xs text-slate-500">{p.descripcion}</span>
                        <span className="mt-1 block text-sm"><b>{soles(p.precio)}</b> <span className="text-slate-500">· desde {soles(cuotaMensual(p.precio, 6))}/mes</span></span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div ref={detalleRef} className="min-w-0 scroll-mt-28 space-y-4 lg:sticky lg:top-24 lg:self-start">
          {producto && mype ? (
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-blue-700">{mype.nombre} · {mype.distrito.split(",")[0]} · Proveedor verificado</p>
                  <h3 className="text-lg font-semibold">{producto.emoji} {producto.nombre}</h3>
                </div>
                <p className="whitespace-nowrap text-lg font-bold">{soles(producto.precio)}</p>
              </div>

              <label className="mt-4 block text-sm font-medium">
                Talla
                <select value={talla} onChange={(e) => setTalla(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                  {producto.tallas.length > 1 && <option value="">Elige una talla</option>}
                  {producto.tallas.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </label>

              <p className="mt-4 text-sm font-medium">Cuotas</p>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {CUOTAS.map((c) => (
                  <button key={c} onClick={() => setCuotas(c)} aria-pressed={cuotas === c}
                    className={`rounded-lg border py-2 text-sm font-medium ${cuotas === c ? "border-blue-700 bg-blue-50 text-blue-800 ring-1 ring-blue-700" : "border-slate-300 bg-white"}`}>
                    {c} {c === 1 ? "cuota" : "cuotas"}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm">Se te descontará al mes</p>
                  <p className="text-lg font-bold tabular-nums">{soles(cuota)}{cuotas > 1 && <span className="text-sm font-medium text-slate-500"> × {cuotas}</span>}</p>
                </div>
                <p className="mb-2 text-xs text-slate-500">Desde {mesDescuento}</p>
                <BarraTope previo={previo} nuevo={cuota} tope={tope(t)} />
              </div>

              <button onClick={onReservar} disabled={!talla} className={`${btnPrimario} mt-4 w-full py-3 text-base`}>
                {talla ? "Reservar" : "Elige una talla para reservar"}
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                No se te descuenta nada hasta que recibas el producto y firmes tu autorización.
              </p>
            </Card>
          ) : (
            <Card className="text-center">
              <p className="text-3xl">🛍️</p>
              <p className="mt-2 font-medium">Elige un producto del catálogo</p>
              <p className="text-sm text-slate-500">Verás cuánto se te descontará al mes antes de reservar.</p>
            </Card>
          )}

          <Card>
            <h3 className="font-semibold">Mis solicitudes</h3>
            <div className="mt-3 space-y-2">
              {mias.length === 0 && <Vacio>Aún no tienes reservas en esta campaña.</Vacio>}
              {mias.map((s) => {
                const p = getProducto(s.mypeId, s.productoId);
                return (
                  <div key={s.id} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.emoji} {p.nombre} · talla {s.talla}</p>
                      <p className="text-xs text-slate-500">{soles(cuotaDe(s))} × {s.cuotas} · {getMype(s.mypeId).nombre}</p>
                    </div>
                    <EstadoChip estado={s.estado} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
