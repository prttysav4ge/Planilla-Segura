# Planilla Segura

Prototipo para hackathon: preventa por campañas donde los trabajadores de una empresa compran productos de MYPES locales con descuento por planilla. Una caja municipal paga a la MYPE al entregar y cobra por planilla.

**Todo usa datos simulados** (`data/datos.json`). No hay backend ni login: el estado vive en memoria y se reinicia al recargar la página o con «Reiniciar demo».

## Cómo correrlo

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:3000.

## Guion de demo (2 minutos)

1. **Trabajador**: entra como Ana Torres, elige *Zapatillas escolares*, talla 34 y 6 cuotas. Muestra «se te descontará S/ 20 al mes» y la barra del tope. Pulsa **Reservar**, luego **Ver como RR. HH. →** en el aviso.
2. **RR. HH.**: la fila de Carlos Vega está marcada como «Supera el tope» y su botón Aprobar está bloqueado. Aprueba la de Ana y pulsa **Ver como MYPE →**.
3. **MYPE** (Calzado): el pedido consolidado ya suma el par de Ana. En «Día de entrega», pulsa **Generar autorización** (documento imprimible prellenado) y luego **Marcar entregado y firmado**. Pulsa **Ver como Caja →**.
4. **Caja**: aparece la entrega con el abono a la MYPE y el total a cobrar por planilla en marzo.
5. Vuelve a **RR. HH.** y pulsa **Descargar archivo mensual**: un CSV con una fila por trabajador y solo las entregas firmadas.

## Reglas del prototipo

- Tope de descuento: 30 % del sueldo. Cuenta los otros descuentos del trabajador y las compras ya aprobadas o entregadas.
- Estados: pendiente → aprobada (se asigna un ID de autorización) → entregada y firmada. RR. HH. también puede rechazar.
- El primer descuento cae en marzo de 2027.

## Estructura

- `data/datos.json`: empresa, campaña, 3 MYPES con 2 productos cada una, 10 trabajadores y solicitudes iniciales.
- `lib/datos.ts`: tipos y cálculos (cuota mensual, % del tope).
- `lib/store.tsx`: estado compartido en memoria entre roles.
- `lib/csv.ts`: archivo mensual para planilla.
- `components/`: una vista por rol y el documento de autorización imprimible.
