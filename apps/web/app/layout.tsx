import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L.E.V. - Logoterapia, Espírito e Vida",
  description:
    "Promover sentido, esperança e transformação por meio da formação de profissionais, produção de conhecimento e serviço à pessoa humana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
