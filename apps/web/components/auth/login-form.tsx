"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSesionAdmin, loginAdmin } from "@/lib/api/auth";
import { LoadingPantalla } from "./loading-pantalla";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarLoading, setMostrarLoading] = useState(false);
  const [faseLoading, setFaseLoading] = useState<"entrada" | "salida">("entrada");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setEnviando(true);

    try {
      await loginAdmin({
        email,
        password,
        rememberMe,
      });

      setMostrarLoading(true);
      setFaseLoading("entrada");

      await getSesionAdmin();

      setFaseLoading("salida");

      setTimeout(() => {
        router.push("/groups");
        router.refresh();
      }, 420);
    } catch (err) {
      setMostrarLoading(false);
      setFaseLoading("entrada");
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
      setEnviando(false);
      return;
    }

    setEnviando(false);
  };

  return (
    <>
      <LoadingPantalla visible={mostrarLoading} fase={faseLoading} />

      <div className="h-screen w-screen flex items-center justify-center p-6" style={{ background: "#6E6A83" }}>
        <div
          className="w-full max-w-270 rounded-[18px] overflow-hidden grid"
          style={{
            gridTemplateColumns: "minmax(320px, 1fr) minmax(360px, 1.1fr)",
            background: "#292537",
            boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          }}
        >
          <section
            className="relative p-8 flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(165deg, var(--color-fondo-app) 0%, var(--color-acento) 55%, #282243 100%)",
              minHeight: 560,
            }}
          >
            <div className="relative z-10">
              <Image
                src="/icons/logo.png"
                alt="Logo Segurinite"
                width={120}
                height={64}
                priority
                style={{ height: "auto", width: "auto", maxWidth: "70%" }}
              />
            </div>

            <div
              className="absolute inset-6 rounded-[14px] opacity-25"
              style={{
                backgroundImage: "url('/mapa.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 text-white">
              <h2 className="font-bold" style={{ fontSize: "clamp(30px, 2.7vw, 40px)" }}>
                Segurinite
              </h2>
              <p className="mt-1" style={{ fontSize: "clamp(19px, 1.9vw, 26px)" }}>
                Panel de Control
              </p>
            </div>
          </section>

          <section className="p-10 lg:p-14 flex flex-col justify-center text-white">
            <h1 className="font-bold" style={{ fontSize: "clamp(34px, 3.2vw, 48px)" }}>
              Iniciar sesión
            </h1>
            <p className="mt-2 text-white/75" style={{ fontSize: 16 }}>
              Acceso exclusivo para administradores del sistema.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Correo electrónico"
                autoComplete="email"
                required
                className="w-full h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/45 focus:outline-none"
              />

              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  required
                  className="w-full h-12 rounded-xl border border-white/20 bg-white/10 px-4 pr-14 text-white placeholder:text-white/45 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setMostrarPassword((valor) => !valor)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <label className="flex items-center gap-3 text-white/85" style={{ fontSize: 15 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-white/40"
                />
                Recordarme
              </label>

              {error && (
                <p className="text-[#FF8F8F]" style={{ fontSize: 14 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full h-12 rounded-xl border-none text-white font-bold"
                style={{
                  background: "var(--color-acento)",
                  opacity: enviando ? 0.8 : 1,
                  cursor: enviando ? "not-allowed" : "pointer",
                }}
              >
                {enviando ? "Validando..." : "Entrar"}
              </button>
            </form>

            <Link
              href="#"
              className="mt-4 inline-block text-white/80 underline"
              style={{ fontSize: 14 }}
            >
              Eres imbecil y olvidaste tu contraseña? 🥶
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
