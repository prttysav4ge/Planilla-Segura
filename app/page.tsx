"use client";
import { StoreProvider, useStore } from "@/lib/store";
import Encabezado from "@/components/Encabezado";
import VistaTrabajador from "@/components/VistaTrabajador";
import VistaRRHH from "@/components/VistaRRHH";
import VistaMype from "@/components/VistaMype";
import VistaCaja from "@/components/VistaCaja";
import Aviso from "@/components/Aviso";

function App() {
  const { rol } = useStore();
  return (
    <div className="min-h-screen pb-24">
      <Encabezado />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {rol === "trabajador" && <VistaTrabajador />}
        {rol === "rrhh" && <VistaRRHH />}
        {rol === "mype" && <VistaMype />}
        {rol === "caja" && <VistaCaja />}
      </main>
      <Aviso />
    </div>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
