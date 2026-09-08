import Link from "next/link";
import PanelLogo from "@/components/panel/atoms/PanelLogo/PanelLogo";
import styles from "./auth.module.css";

export const metadata = { title: "Acessar — RED" };

/**
 * Layout das telas de conta.
 *
 * Fora do grupo `(site)`: quem está entrando não precisa do menu de catálogo
 * nem do rodapé institucional, e o header do site empurraria o formulário para
 * baixo da dobra em telas pequenas.
 */
export default function AuthLayout({ children }) {
  return (
    <div className={`painel ${styles.tela}`}>
      <div className={styles.coluna}>
        <header className={styles.topo}>
          <PanelLogo />
        </header>
        <main className={styles.conteudo}>{children}</main>
        <footer className={styles.rodape}>
          <Link href="/">← Voltar ao site</Link>
        </footer>
      </div>

      {/* Painel de apoio: some no mobile, onde só atrapalharia. */}
      <aside className={styles.lado} aria-hidden="true">
        <div className={styles.ladoTexto}>
          <p className={styles.ladoTitulo}>
            Materiais, equipamentos e mobiliário em novos ciclos de uso.
          </p>
          <p className={styles.ladoApoio}>
            Compre ativos disponíveis ou envie os seus para avaliação da curadoria RED.
          </p>
        </div>
      </aside>
    </div>
  );
}
