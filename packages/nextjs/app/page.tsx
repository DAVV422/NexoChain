import Link from "next/link";
import { Award, Briefcase, Coins, Search, Shield, Users } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Header } from "~~/components/Header";
import { Footer } from "~~/components/Footer";
import { Toaster } from "~~/components/ui/toaster";
import { Card, CardContent } from "~~/components/ui/card";

export default function HomePage() {
  console.log("HomePage component is rendering");

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Pagos Seguros",
      description: "Contratos inteligentes garantizan pagos seguros con sistema de escrow automático",
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Criptomonedas",
      description: "Pagos en USDC y otras stablecoins para transacciones rápidas y globales",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "NFTs de Certificación",
      description: "Recibe NFTs únicos como certificado de trabajos completados exitosamente",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad Global",
      description: "Conecta con freelancers y empleadores de todo el mundo sin fronteras",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">🚀 Plataforma Descentralizada</Badge>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Freelancing del futuro con
              <span className="text-blue-600"> Web3</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Conecta empleadores y freelancers usando contratos inteligentes, pagos en criptomonedas y certificaciones
              NFT. Sin intermediarios, sin comisiones ocultas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/freelancer">
                  <Search className="mr-2 h-5 w-5" />
                  Explorar Trabajos
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/employer">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Publicar Trabajo
                </Link>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Buscar Trabajos</h3>
                  <p className="text-sm text-gray-600 mb-4">Encuentra oportunidades perfectas para tus habilidades</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/jobs">Ver Ofertas</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Publicar Proyecto</h3>
                  <p className="text-sm text-gray-600 mb-4">Encuentra el talento perfecto para tu proyecto</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/publish">Publicar Ahora</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Mis Trabajos</h3>
                  <p className="text-sm text-gray-600 mb-4">Gestiona tus proyectos y aplicaciones</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/my-jobs">Ver Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">¿Por qué Web3?</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">El futuro del trabajo freelance</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aprovecha las ventajas de la tecnología blockchain para trabajar de forma más segura y eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución del trabajo descentralizado. Conecta tu billetera y comienza a trabajar hoy mismo.
          </p>
          {/* <WalletConnect /> */}
          <div className="text-white text-lg">Wallet Connect (Temporalmente deshabilitado)</div>
        </div>
      </section>
      <Footer />
      <Toaster />
    </div>
  );
}
