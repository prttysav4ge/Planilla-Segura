"use client";
import { useEffect } from "react";
import {
  Solicitud, caja, campana, cuotaDe, empresa, getMype, getProducto, getTrabajador, mesN, soles,
} from "@/lib/datos";
import { btnGris, btnPrimario } from "./ui";

export default function Autorizacion({ s, onClose }: { s: Solicitud; onClose: () => void }) {
  const t = getTrabajador(s.trabajadorId);
  const m = getMype(s.mypeId);
  const p = getProducto(s.mypeId, s.productoId);
  const cuota = cuotaDe(s);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const fila = (k: string, v: React.ReactNode) => (
    <div className="grid grid-cols-[150px_1fr] gap-2 border-b border-slate-100 py-1.5 text-sm">
      <dt className="text-slate-500">{k}</dt><dd className="font-medium">{v}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4" onClick={onClose}>
      <div className="mx-auto max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="no-print mb-3 flex justify-end gap-2">
          <button onClick={onClose} className={btnGris}>Cerrar</button>
          <button onClick={() => window.print()} className={btnPrimario}>🖨 Imprimir</button>
        </div>
        <article className="print-area rounded-xl bg-white p-6 shadow-xl sm:p-10">
          <div className="flex items-start justify-between gap-4 border-b-2 border-slate-900 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Planilla Segura · {campana.nombre}</p>
              <h2 className="text-xl font-bold">Autorización de descuento por planilla</h2>
            </div>
            <div className="text-right text-sm">
              <p className="font-mono font-semibold">{s.autorizacionId}</p>
              <p className="text-slate-500">Entrega: {campana.fechaEntrega}</p>
            </div>
          </div>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Trabajador</h3>
          <dl className="mt-1">
            {fila("Nombre", t.nombre)}
            {fila("DNI", t.dni)}
            {fila("Empleador", `${empresa.nombre} (RUC ${empresa.ruc})`)}
            {fila("Área", t.area)}
          </dl>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Producto recibido</h3>
          <dl className="mt-1">
            {fila("Producto", `${p.nombre} · talla ${s.talla}`)}
            {fila("Proveedor (MYPE)", `${m.nombre} · RUC ${m.ruc}`)}
            {fila("Precio total", soles(p.precio))}
            {fila("Cuotas", `${s.cuotas} ${s.cuotas === 1 ? "cuota" : "cuotas"} de ${soles(cuota)}`)}
            {fila("Periodo de descuento", s.cuotas === 1 ? mesN(0) : `${mesN(0)} a ${mesN(s.cuotas - 1)}`)}
          </dl>

          <p className="mt-5 text-sm leading-relaxed">
            Yo, <b>{t.nombre}</b>, identificado(a) con DNI <b>{t.dni}</b>, declaro haber recibido conforme el producto
            descrito y autorizo a <b>{empresa.nombre}</b> a descontar de mi remuneración <b>{soles(cuota)}</b> mensuales
            durante <b>{s.cuotas}</b> {s.cuotas === 1 ? "mes" : "meses"}, para abonarlos a <b>{caja.nombre}</b>, que pagó el
            producto a la MYPE por mi cuenta.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 text-center text-sm">
            <div className="border-t border-slate-900 pt-1">Firma del trabajador<br /><span className="text-xs text-slate-500">{t.nombre} · DNI {t.dni}</span></div>
            <div className="border-t border-slate-900 pt-1">Entregado por<br /><span className="text-xs text-slate-500">{m.nombre}</span></div>
          </div>
          <p className="mt-8 text-center text-[11px] text-slate-400">Documento generado con datos simulados para demostración.</p>
        </article>
      </div>
    </div>
  );
}
