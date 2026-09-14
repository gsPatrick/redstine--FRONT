import Button from "@/components/atoms/Button/Button";
import styles from "./ModelCard.module.css";

/**
 * Bloco do BANNER HORIZONTAL DE 2 COLUNAS — seção 5 do PADROES.md.
 *
 * É o mesmo formato dos painéis de Participation e CommercialModels na Home:
 * o cliente listou "RED Estoque / RED Catálogo (Vender e Modelos Comerciais)"
 * e "Quer Comprar / Quer Vender (Home)" como o MESMO padrão. Aqui o desenho
 * estava divergente em tudo o que dá para divergir — 400px de altura contra
 * 330px da Home, conteúdo centrado em vez de ancorado embaixo, véu chapado em
 * vez de gradiente, título em 28px/500 em vez da escala de card, e nenhum
 * número de bloco. Foi alinhado à Home, que é a referência aprovada.
 */
export default function ModelCard({ title, description, cta, href, image, index }) {
  return (
    <article
      className={styles.card}
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      <span className={styles.veil} aria-hidden="true" />
      <div className={styles.body}>
        {index ? <span className={styles.index}>{index}</span> : null}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.action}>
          {/* Painel escuro: `ghost` (vazado branco). Era `dark`, que neste
              padrão passou a ser o vazado VERMELHO — 2,7:1 sobre o preto do
              painel, ilegível. Ver Button.js. */}
          <Button href={href} variant="ghost" size="sm">
            {cta}
          </Button>
        </div>
      </div>
    </article>
  );
}
