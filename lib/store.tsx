"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Rol, Solicitud, solicitudesIniciales } from "./datos";

type Aviso = { texto: string; irA?: Rol } | null;

type Store = {
  rol: Rol;
  setRol: (r: Rol) => void;
  solicitudes: Solicitud[];
  reservar: (s: Omit<Solicitud, "id" | "estado">) => void;
  aprobar: (id: string) => void;
  rechazar: (id: string) => void;
  entregar: (id: string) => void;
  reiniciar: () => void;
  aviso: Aviso;
  avisar: (a: Aviso) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [rol, setRolState] = useState<Rol>("trabajador");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(solicitudesIniciales);
  const [aviso, setAviso] = useState<Aviso>(null);

  const setRol = useCallback((r: Rol) => {
    setRolState(r);
    setAviso(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const avisar = useCallback((a: Aviso) => {
    setAviso(a);
  }, []);

  const reservar: Store["reservar"] = (s) =>
    setSolicitudes((prev) => [...prev, { ...s, id: `s${Date.now()}`, estado: "pendiente" }]);

  const aprobar = (id: string) =>
    setSolicitudes((prev) => {
      const n = prev.filter((s) => s.autorizacionId).length + 1;
      return prev.map((s) =>
        s.id === id ? { ...s, estado: "aprobada", autorizacionId: `AUT-27-${String(n).padStart(4, "0")}` } : s
      );
    });

  const rechazar = (id: string) =>
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: "rechazada" } : s)));

  const entregar = (id: string) =>
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: "entregada" } : s)));

  const reiniciar = () => {
    setSolicitudes(solicitudesIniciales);
    setRol("trabajador");
  };

  return (
    <Ctx.Provider value={{ rol, setRol, solicitudes, reservar, aprobar, rechazar, entregar, reiniciar, aviso, avisar }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider faltante");
  return c;
}
