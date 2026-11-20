"use client";
import { useStore } from "@/lib/store";
import { caja, cuotaDe, empresa, getMype, getProducto, getTrabajador, mesDescuento, mypes, precioDe, soles } from "@/lib/datos";
import { Card, Kicker, Stat, Vacio } from "./ui";

const r2 = (n: number) => Math.round(n * 100) / 100;

export default function VistaCaja() {
  const { solicitudes } = useStore();
  const firmadas = solicitudes.filter((s) => s.estado === "entregada");
  const porEntregar = solicitudes.filter((s) => s.estado === "aprobada");
  const abonado = firmadas.reduce((a, s) => a + precioDe(s), 0);
  const cobrarMes = r2(firmadas.reduce((a, s) => a + cuotaDe(s), 0));
  const porMype = mypes.map((m) => {
    const ss = firmadas.filter((s) => s.mypeId === m.id);
    return { m, n: ss.length, monto: ss.reduce((a, s) => a + precioDe(s), 0) };
  });

  return (
    <div className="space-y-6">
      <div>
        <Kicker>{caja.nombre} · Convenio con {empresa.nombre}</Kicker>
        <h1 className="mt-1 text-2xl font-bold">Pagos a MYPES y cobro por planilla</h1>
        <p className="text-sm text-slate-600">La caja paga a la MYPE contra autorización firmada y recupera vía descuento en planilla.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Entregas firmadas" value={firmadas.length} />
        <Stat label="Abonado a MYPES" value={soles(abonado)} />
        <Stat label="Aprobadas por entregar" value={porEntregar.length} hint="Aún sin pago" />
        <Stat label={`A cobrar por planilla en ${mesDescuento.split(" ")[0]}`} value={soles(cobrarMes)} destacado />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Card>
          <h2 className="font-semibold">Abonos por MYPE</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {porMype.map(({ m, n, monto }) => (
              <div key={m.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium">{m.nombre}</p>
                  <p className="text-xs text-slate-500">RUC {m.ruc} · {n} {n === 1 ? "entrega" : "entregas"}</p>
                </div>
                <p className="font-semibold tabular-nums">{soles(monto)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 font-bold">
              <p>Total abonado</p><p className="tabular-nums">{soles(abonado)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Entregas firmadas</h2>
          {firmadas.length === 0 ? <div className="mt-3"><Vacio>Aún no hay entregas firmadas.</Vacio></div> : (
            <div className="-mx-4 mt-3 overflow-x-auto sm:-mx-5">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <th className="px-4 py-2 font-medium sm:px-5">Autorización</th>
                    <th className="px-2 py-2 font-medium">Trabajador</th>
                    <th className="px-2 py-2 font-medium">MYPE · producto</th>
                    <th className="px-2 py-2 text-right font-medium">Abonado a MYPE</th>
                    <th className="px-4 py-2 text-right font-medium sm:px-5">Cobro mensual</th>
                  </tr>
                </thead>
                <tbody>
                  {firmadas.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs sm:px-5">{s.autorizacionId}</td>
                      <td className="px-2 py-2.5">{getTrabajador(s.trabajadorId).nombre}</td>
                      <td className="px-2 py-2.5">
                        <p>{getMype(s.mypeId).nombre}</p>
                        <p className="text-xs text-slate-500">{getProducto(s.mypeId, s.productoId).nombre} · talla {s.talla}</p>
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{soles(precioDe(s))}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums sm:px-5">{soles(cuotaDe(s))} <span className="text-xs text-slate-500">× {s.cuotas}</span></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 font-bold">
                    <td className="px-4 py-2.5 sm:px-5" colSpan={3}>Total</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{soles(abonado)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums sm:px-5">{soles(cobrarMes)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
