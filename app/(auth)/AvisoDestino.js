import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

/** Rota única de envio de ativos. */
export const ROTA_ENVIO = "/painel/vender/enviar";

/**
 * Aviso do destino interrompido.
 *
 * Quem chega ao login vindo do envio de ativos precisa saber POR QUE foi
 * parado aqui — sem isto a pessoa clica em "Enviar Ativos", aparece uma tela
 * de login sem explicação e ela desiste achando que o site quebrou.
 *
 * O texto é explícito sobre a regra: cadastro e sessão são obrigatórios para
 * enviar ativos, e o envio acontece dentro da Área do Cliente.
 */
export default function AvisoDestino({ de }) {
  if (!de || !de.startsWith(ROTA_ENVIO)) return null;

  return (
    <p className={styles.aviso}>
      <PanelIcon name="alert" size={15} />
      <span>
        Para enviar ativos é obrigatório ter cadastro e estar logado. Ao concluir, você volta direto
        para o formulário de envio na Área do Cliente.
      </span>
    </p>
  );
}
