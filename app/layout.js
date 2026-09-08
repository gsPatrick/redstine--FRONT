import { Poppins } from "next/font/google";
import { StoreProvider } from "@/lib/StoreContext";
import { SessionProvider } from "@/lib/auth/SessionContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Redestine",
  description:
    "A RED transforma materiais, equipamentos e mobiliário em novas oportunidades. Compre ativos disponíveis ou envie os seus para avaliação.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Layout raiz: apenas html, body, fonte e store. Cada ambiente (site, painel
 * do cliente, gestao) monta o proprio chrome no seu grupo de rotas.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>
        <SessionProvider>
          <StoreProvider>{children}</StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
