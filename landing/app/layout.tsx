import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saúde Prime | Sistema para Corretores de Planos de Saúde",
  description:
    "Plataforma completa para corretoras de saúde. Cotador comparativo, catálogo digital e apresentações profissionais — tudo em um só lugar. Brasília/DF.",
  keywords: ["planos de saúde", "cotador", "corretor", "saúde corporativa", "Brasília"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={ibmPlex.variable}>
      <body className="bg-[#080808] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
