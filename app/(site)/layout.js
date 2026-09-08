import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import MobileTabBar from "@/components/organisms/MobileTabBar/MobileTabBar";
import WhatsAppFab from "@/components/organisms/WhatsAppFab/WhatsAppFab";

/**
 * Layout do site publico.
 *
 * Painel e gestao ficam fora deste grupo de rotas justamente para nao herdarem
 * header, footer e barra de navegacao — sao ambientes de trabalho, nao paginas
 * de catalogo. O grupo `(site)` nao aparece na URL.
 */
export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileTabBar />
      <WhatsAppFab />
    </>
  );
}
