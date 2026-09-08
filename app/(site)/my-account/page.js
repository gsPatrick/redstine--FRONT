import { redirect } from "next/navigation";

/**
 * Rota herdada do site anterior.
 *
 * A Área do Cliente real é `/painel`, com sessão de verdade. Esta rota tinha
 * um segundo formulário de login que apenas gravava um nome no navegador —
 * um visitante "entrava" ali e não acontecia nada.
 *
 * Fica como redirecionamento porque há links antigos apontando para cá.
 * O guard do painel manda para `/entrar` quem não tem sessão.
 */
export default function MinhaContaPage() {
  redirect("/painel");
}
