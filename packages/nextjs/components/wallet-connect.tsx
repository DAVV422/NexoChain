"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { UserPlus, Wallet } from "lucide-react";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";

/**
 * Componente para el botón de conexión de wallet con Privy.
 */
export const WalletConnect = () => {
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
            <span className="text-sm font-bold text-white">
              {/* Muestra la dirección acortada de la billetera */}
              {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
            </span>
            <button className="text-xs text-blue-200 hover:text-white transition-colors" onClick={logout}>
              Desconectar
            </button>
          </div>
          {/* Usa el componente de avatar de Scaffold-ETH para consistencia visual */}
          {user?.wallet?.address && <BlockieAvatar address={user.wallet.address} size={30} />}
        </div>
      ) : (
        // Si el usuario no está autenticado, muestra el botón de Login.
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => router.push("/login")}
        >
          <Wallet className="h-4 w-4" />
          Conectar Billetera
        </Button>
      )}
    </>
  );
};

/**
 * Componente para el botón de registro/login en el header
 */
export const AuthButton = () => {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();

  if (!ready) {
    return null;
  }

  return (
    <>
      {authenticated ? (
        // Si el usuario está autenticado, muestra solo el avatar
        <div className="flex items-center gap-2">
          {user?.wallet?.address && <BlockieAvatar address={user.wallet.address} size={32} />}
          <button className="text-xs text-gray-600 hover:text-gray-800 transition-colors" onClick={logout}>
            Salir
          </button>
        </div>
      ) : (
        // Si el usuario no está autenticado, muestra el botón de registro
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          onClick={() => router.push("/login")}
        >
          <UserPlus className="h-4 w-4" />
          Registrarse
        </Button>
      )}
    </>
  );
};
