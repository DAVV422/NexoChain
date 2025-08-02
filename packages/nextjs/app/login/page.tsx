"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const { ready, authenticated } = usePrivy();
  // Configura el hook de login con email
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: () => {
      console.log("¡Login exitoso!");
      router.push("/"); // Redirige a la página principal después del login
    },
    onError: error => {
      console.error("Fallo el login:", error);
      alert("El login falló. Por favor, intenta de nuevo.");
    },
  });

  // Si el usuario ya está autenticado, lo redirige a la página principal
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Inicia Sesión en NexoChain</h1>

        <div className="card w-96 bg-base-100 shadow-xl p-8">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">¿Cuál es tu email?</span>
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="input input-bordered w-full max-w-xs"
              onChange={e => setEmail(e.currentTarget.value)}
              value={email}
            />
            <button className="btn btn-primary mt-4" onClick={() => sendCode({ email })} disabled={!email}>
              Enviar Código
            </button>
          </div>

          <div className="divider">O</div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Ingresa tu código</span>
            </label>
            <input
              type="text"
              placeholder="123456"
              className="input input-bordered w-full max-w-xs"
              onChange={e => setCode(e.currentTarget.value)}
              value={code}
            />
            <button className="btn btn-secondary mt-4" onClick={() => loginWithCode({ code })} disabled={!code}>
              Iniciar Sesión con Código
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
