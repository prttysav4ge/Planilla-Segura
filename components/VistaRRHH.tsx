"use client";
import { useStore } from "@/lib/store";
import {
  campana, cuotaDe, empresa, getMype, getProducto, getTrabajador, mesDescuento, mypes, pctTope, soles, Solicitud,
} from "@/lib/datos";
import { descargarArchivoMensual, filasArchivoMensual } from "@/lib/csv";
import { Card, EstadoChip, Kicker, Stat, Vacio, btnGris, btnPrimario, btnSecundario } from "./ui";

const ORDEN = { pendiente: 0, aprobada: 1, entregada: 2, rechazada: 3 };

export default function VistaRRHH() {
  const { solicitudes, aprobar, rechazar, avisar } = useStore();
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const autorizadas = solicitudes.filter((s) => s.estado === "aprobada" || s.estado === "entregada");
  const firmadas = solicitudes.filter((s) => s.estado === "entregada");
  const totalMes = firmadas.reduce((a, s) => a + cuotaDe(s), 0);
  const filas = filasArchivoMensual(solicitudes);
  const lista = [...solicitudes].sort((a, b) => ORDEN[a.estado] - ORDEN[b.estado]);

  function onAprobar(s: Solicitud) {
    aprobar(s.id);
    avisar({ texto: `Aprobada la solicitud de ${getTrabajador(s.trabajadorId).nombre}. Ya aparece en el pedido de la MYPE.`, irA: "mype" });
  }

  function onDescargar() {
    const n = descargarArchivoMensual(solicitudes);
    avisar({ texto: `Archivo de ${mesDescuento} descargado: ${n} trabajadores con entregas firmadas.`, irA: "caja" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Kicker>{empresa.nombre} · Recursos Humanos</Kicker>
          <h1 className="mt-1 text-2xl font-bold">{campana.nombre}</h1>
          <p className="text-sm text-slate-600">Tope de descuento: {campana.topePorcentaje} % del sueldo mensual de cada trabajador.</p>
        </div>
        <button onClick={onDescargar} className={`${btnPrimario} w-full sm:w-auto`}>
          ⬇ Descargar archivo mensual ({mesDescuento.split(" ")[0]})
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="MYPES habilitadas" value={mypes.length} />
        <Stat label="Solicitudes por aprobar" value={pendientes.length} />
        <Stat label="Autorizaciones firmadas" value={`${firmadas.length} / ${autorizadas.length}`} />
        <Stat label={`A descontar en ${mesDescuento.split(" ")[0]}`} value={soles(Math.round(totalMes * 100) / 100)} hint={`${filas.length} trabajadores en el archivo`} destacado />
      </div>

      <Card>
        <h2 className="font-semibold">Solicitudes</h2>
        {lista.length === 0 ? <div className="mt-3"><Vacio>No hay solicitudes.</Vacio></div> : (
          <div className="-mx-4 mt-3 overflow-x-auto sm:-mx-5">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="px-4 py-2 font-medium sm:px-5">Trabajador</th>
                  <th className="px-2 py-2 font-medium">Producto · MYPE</th>
                  <th className="px-2 py-2 font-medium">Cuota</th>
                  <th className="px-2 py-2 font-medium">Tope usado</th>
                  <th className="px-2 py-2 font-medium">Estado</th>
                  <th className="px-4 py-2 text-right font-medium sm:px-5">Acción</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((s) => {
                  const t = getTrabajador(s.trabajadorId);
                  const p = getProducto(s.mypeId, s.productoId);
                  const pct = pctTope(s, solicitudes);
                  const excede = pct > 100;
                  return (
                    <tr key={s.id} className={`border-b border-slate-100 last:border-0 ${excede && s.estado === "pendiente" ? "bg-red-50/60" : ""}`}>
                      <td className="px-4 py-3 sm:px-5">
                        <p className="font-medium">{t.nombre}</p>
                        <p className="text-xs text-slate-500">Sueldo {soles(t.sueldo)}{t.otrosDescuentos > 0 && ` · otros dsctos. ${soles(t.otrosDescuentos)}`}</p>
                      </td>
                      <td className="px-2 py-3">
                        <p>{p.nombre} · talla {s.talla}</p>
                        <p className="text-xs text-slate-500">{getMype(s.mypeId).nombre}</p>
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 tabular-nums">{soles(cuotaDe(s))} × {s.cuotas}</td>
                      <td className="px-2 py-3">
                        {s.estado === "rechazada" ? <span className="text-slate-400">—</span> : excede ? (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                            ⚠ Supera el tope ({Math.round(pct)} %)
                          </span>
                        ) : <span className="tabular-nums">{Math.round(pct)} %</span>}
                      </td>
                      <td className="px-2 py-3">
                        <EstadoChip estado={s.estado} />
                        {s.autorizacionId && <p className="mt-0.5 text-[11px] text-slate-500">{s.autorizacionId}</p>}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        {s.estado === "pendiente" ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => rechazar(s.id)} className={btnGris}>Rechazar</button>
                            <button onClick={() => onAprobar(s)} disabled={excede} className={btnSecundario}
                              title={excede ? "Supera el tope del 30 % del sueldo" : undefined}>
                              Aprobar
                            </button>
                          </div>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
        <p className="font-semibold">Un solo archivo para la caja, no uno por MYPE</p>
        <p className="mt-1 text-sm text-slate-600">
          El archivo de {mesDescuento} incluye {firmadas.length} descuentos de {new Set(firmadas.map((s) => s.mypeId)).size} MYPES,
          cada uno con su autorización firmada al recibir el producto. Solo entran las entregas firmadas.
        </p>
      </div>
    </div>
  );
}
