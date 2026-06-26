import type { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "VelDev OS",
  description: "Sistemas que não falham",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
