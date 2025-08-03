"use client";

// import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          // Crea billeteras embebidas para usuarios que inician sesión sin una.
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
          // Configuración mínima para evitar conflictos
          appearance: {
            theme: "light",
            accentColor: "#2299dd",
          },
        }}
      > */}
      {children}
      {/* </PrivyProvider> */}
    </>
  );
}
