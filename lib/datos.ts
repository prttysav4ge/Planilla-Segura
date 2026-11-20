import raw from "@/data/datos.json";

export type Estado = "pendiente" | "aprobada" | "rechazada" | "entregada";
export type Rol = "trabajador" | "rrhh" | "mype" | "caja";

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  emoji: string;
  unidad: string;
  unidadSingular: string;
  descripcion: string;
  tallas: string[];
};
export type Mype = {
  id: string;
  nombre: string;
  rubro: string;
  ruc: string;
  distrito: string;
  productos: Producto[];
};
export type Trabajador = {
  id: string;
  nombre: string;
  dni: string;
  area: string;
  sueldo: number;
  otrosDescuentos: number;
};
export type Solicitud = {
  id: string;
  trabajadorId: string;
  mypeId: string;
  productoId: string;
  talla: string;
  cuotas: number;
  estado: Estado;
  autorizacionId?: string;
};

export const empresa = raw.empresa;
export const caja = raw.caja;
export const campana = raw.campana;
export const mypes = raw.mypes as Mype[];
export const trabajadores = raw.trabajadores as Trabajador[];
export const solicitudesIniciales = raw.solicitudes as Solicitud[];

export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
export const mesDescuento = `${MESES[campana.mesPrimerDescuento]} ${campana.anioPrimerDescuento}`;

export function mesN(offset: number) {
  const idx = campana.mesPrimerDescuento + offset;
  return `${MESES[idx % 12]} ${campana.anioPrimerDescuento + Math.floor(idx / 12)}`;
}

export const getTrabajador = (id: string) => trabajadores.find((t) => t.id === id)!;
export const getMype = (id: string) => mypes.find((m) => m.id === id)!;
export const getProducto = (mypeId: string, productoId: string) =>
  getMype(mypeId).productos.find((p) => p.id === productoId)!;

export const tope = (t: Trabajador) => (t.sueldo * campana.topePorcentaje) / 100;
export const cuotaMensual = (precio: number, cuotas: number) =>
  Math.round((precio / cuotas) * 100) / 100;
export const cuotaDe = (s: Solicitud) => cuotaMensual(getProducto(s.mypeId, s.productoId).precio, s.cuotas);
export const precioDe = (s: Solicitud) => getProducto(s.mypeId, s.productoId).precio;

/** Descuentos mensuales ya comprometidos (otros descuentos + compras aprobadas/entregadas). */
export function comprometido(trabajadorId: string, sols: Solicitud[], opts: { excluir?: string; incluirPendientes?: boolean } = {}) {
  const t = getTrabajador(trabajadorId);
  const compras = sols
    .filter((s) => s.trabajadorId === trabajadorId && s.id !== opts.excluir)
    .filter((s) => s.estado === "aprobada" || s.estado === "entregada" || (opts.incluirPendientes && s.estado === "pendiente"))
    .reduce((acc, s) => acc + cuotaDe(s), 0);
  return t.otrosDescuentos + compras;
}

/** % del tope que usaría la solicitud si se aprueba. */
export function pctTope(s: Solicitud, sols: Solicitud[]) {
  const t = getTrabajador(s.trabajadorId);
  return ((comprometido(s.trabajadorId, sols, { excluir: s.id }) + cuotaDe(s)) / tope(t)) * 100;
}

export function soles(n: number) {
  return "S/ " + n.toLocaleString("es-PE", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
}
