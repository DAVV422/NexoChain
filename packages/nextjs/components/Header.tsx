"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PrivyLoginButton } from "./PrivyLoginButton";
// import { AuthButton } from "./wallet-connect";
import { usePathname } from "next/navigation";
import { Code } from "lucide-react";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FreelanceWeb3</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Ver Trabajos
            </Link>
            <Link href="/my-jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Mis Trabajos
            </Link>
            <Link href="/publish" className="text-gray-600 hover:text-blue-600 transition-colors">
              Publicar Trabajo
            </Link>
          </nav>
          {/* <AuthButton /> */}
          <PrivyLoginButton />
        </div>
      </div>
    </header>
  );
};
