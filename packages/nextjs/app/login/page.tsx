"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { AlertCircle, ArrowLeft, CheckCircle, Code, Mail, Shield } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";

type Message = { type: "success" | "error"; text: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState<Message>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const { ready, authenticated } = usePrivy();

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: () => {
      setMessage({ type: "success", text: "Inicio de sesión exitoso." });
      setTimeout(() => router.push("/"), 1000);
    },
    onError: error => {
      console.error("Fallo el login:", error);
      setMessage({ type: "error", text: "Hubo un error. Intenta nuevamente." });
    },
  });

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await sendCode({ email });
      setStep("code");
      setMessage({ type: "success", text: "Código enviado. Revisa tu email." });

      // DEV ONLY
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setTimeout(() => {
        console.log(`Código enviado a ${email}: ${generated}`);
        setDevCode(generated);
      }, 500);
    } catch (error) {
      setMessage({ type: "error", text: "No se pudo enviar el código. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await loginWithCode({ code });
    } catch (error) {
      setMessage({ type: "error", text: "El código ingresado no es válido." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SOLWAGE</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Info */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="mb-8">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">✉️ Autenticación Segura</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Acceso rápido y seguro con tu email</h1>
              <p className="text-xl text-gray-600 mb-8">
                Inicia sesión de forma segura usando tu correo electrónico. Te enviaremos un código de verificación para
                garantizar la seguridad de tu cuenta.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Verificación por código de 6 dígitos</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Sin necesidad de contraseñas complejas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Acceso instantáneo a la plataforma</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Protección contra accesos no autorizados</span>
              </div>
            </div>
          </div>
          {/* Right Side - Auth Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="text-center pb-6 text-black">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step === "email" ? (
                    <Mail className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Shield className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {step === "email" ? "Iniciar Sesión" : "Verificar Código"}
                </CardTitle>
                <CardDescription className="text-base">
                  {step === "email"
                    ? "Ingresa tu email para recibir un código de verificación"
                    : `Ingresa el código enviado a ${email}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {message && (
                  <div
                    className={`p-4 rounded-lg border text-sm ${
                      message.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {message.type === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  </div>
                )}

                {step === "email" ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <div className="space-y-2 text-black">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || !email}>
                      {isLoading ? "Enviando..." : "Enviar Código"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginWithCode} className="space-y-4">
                    <div className="space-y-2 text-black">
                      <Label htmlFor="code">Código</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                      {isLoading ? "Verificando..." : "Verificar Código"}
                    </Button>

                    <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("email")}>
                      Cambiar Email
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
