"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { BlockieAvatar } from "~~/components/scaffold-eth";

/**
 * Componente para el botón de Login/Logout con Privy.
 */
export function PrivyLoginButton() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();

  // Espera a que el SDK de Privy esté listo antes de renderizar nada.
  if (!ready) {
    return null;
  }

  return (
    <>
      {authenticated ? (
        // Si el usuario está autenticado, muestra su dirección y un botón de Logout.
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold">
              {/* Muestra la dirección acortada de la billetera */}
              {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
            </span>
            <button className="text-xs hover:underline" onClick={logout}>
              Logout
            </button>
          </div>
          {/* Usa el componente de avatar de Scaffold-ETH para consistencia visual */}
          {user?.wallet?.address && <BlockieAvatar address={user.wallet.address} size={30} />}
        </div>
      ) : (
        // Si el usuario no está autenticado, muestra el botón de Login.
        <button className="btn btn-primary btn-sm" onClick={() => router.push("/login")}>
          Login
        </button>
      )}
    </>
  );
};
