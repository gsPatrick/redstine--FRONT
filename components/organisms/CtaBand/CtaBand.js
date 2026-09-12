import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import styles from "./CtaBand.module.css";

/* Imagem de fundo padrão do encerramento.
   O cliente sugeriu no item 28: "sendo imagem de fundo (talvez usar a mesma
   possa funcionar também)". É a mesma foto que a Home já usava no FinalCta,
   então adotá-la em todas as páginas é literalmente o que ele pediu. */
const DEFAULT_IMAGE = "/images/2026/07/distribuidora-de-material-de-construcao-1.jpg";

/**
 * BANNER PADRÃO DE ENCERRAMENTO DE PÁGINA (itens 5 e 28 do documento).
 *
 * Antes existiam DUAS estéticas de encerramento: FinalCta (painel com foto de
 * fundo, texto branco, cantos arredondados) só na Home, e CtaBand (faixa
 * cinza clara, texto escuro, título à esquerda e botões à direita) em todas as
 * demais páginas. O cliente pediu estrutura e estética ÚNICAS, variando apenas
 * texto e CTAs — então a estética do FinalCta (a que ele chamou de padrão da
 * home) foi trazida para cá, e FinalCta passou a ser um invólucro deste
 * componente.
 *
 * `tone` continua aceito porque várias páginas passam tone="tinted"/"light",
 * mas é deliberadamente IGNORADO no painel: o encerramento não pode variar de
 * cor de página para página. Só o enquadramento da Section responde ao tom.
 */
export default function CtaBand({ tone = "tinted", title, text, actions = [], image }) {
  return (
    <Section tone={tone} innerClassName={styles.inner}>
      <div
        className={styles.panel}
        style={{ backgroundImage: `url(${image || DEFAULT_IMAGE})` }}
      >
        <span className={styles.veil} aria-hidden="true" />

        <div className={styles.copy}>
          <Reveal animation="fadeInUp" delay={250} as="h2" className={styles.title}>
            {title}
          </Reveal>
          {text ? (
            <Reveal animation="fadeInUp" delay={250}>
              <p className={styles.text}>{text}</p>
            </Reveal>
          ) : null}
        </div>

        {actions.length ? (
          <Reveal animation="fadeInUp" delay={320} className={styles.actions}>
            {actions.map((action, i) => (
              /* Hierarquia de CTA fixa no padrão: o primeiro é a ação
                 principal (vermelho da marca) e os seguintes são secundários.
                 Os `variant` que as páginas passam ("dark", "outline") foram
                 pensados para a faixa cinza antiga e ficariam ilegíveis sobre
                 a foto — por isso são normalizados aqui, sem exigir edição das
                 páginas. O par solid/ghost é o do item 26 para fundo escuro ou
                 imagem, e CTA de banner é size "lg". */
              <Button
                key={action.label}
                href={action.href}
                variant={i === 0 ? "solid" : "ghost"}
                size="lg"
              >
                {action.label}
              </Button>
            ))}
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
