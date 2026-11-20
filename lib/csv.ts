import { Solicitud, cuotaDe, getMype, getTrabajador, mesDescuento } from "./datos";

/** Una fila por trabajador, solo con entregas firmadas. */
export function filasArchivoMensual(sols: Solicitud[]) {
  const firmadas = sols.filter((s) => s.estado === "entregada");
  const porTrab = new Map<string, Solicitud[]>();
  firmadas.forEach((s) => porTrab.set(s.trabajadorId, [...(porTrab.get(s.trabajadorId) ?? []), s]));
  return [...porTrab.entries()].map(([tid, ss]) => {
    const t = getTrabajador(tid);
    return {
      dni: t.dni,
      nombre: t.nombre,
      monto: Math.round(ss.reduce((a, s) => a + cuotaDe(s), 0) * 100) / 100,
      mype: [...new Set(ss.map((s) => getMype(s.mypeId).nombre))].join(" | "),
      autorizacion: ss.map((s) => s.autorizacionId).join(" | "),
    };
  });
}

export function descargarArchivoMensual(sols: Solicitud[]) {
  const filas = filasArchivoMensual(sols);
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lineas = [
    ["DNI", "Nombre", `Monto del mes (S/) - ${mesDescuento}`, "MYPE", "ID de autorizacion"].map(q).join(","),
    ...filas.map((f) => [f.dni, f.nombre, f.monto.toFixed(2), f.mype, f.autorizacion].map(q).join(",")),
  ];
  const blob = new Blob(["﻿" + lineas.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `descuentos-planilla-${mesDescuento.replace(" ", "-")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filas.length;
}
