import CtaBand from "@/components/organisms/CtaBand/CtaBand";

/**
 * Encerramento da Home.
 *
 * Item 28 do cliente: "Padronizar banner de encerramento da home como em
 * todas as páginas, pode variar no texto, mas deve ter mesma estrutura e
 * estética". Portanto a Home não tem mais componente próprio: é o CtaBand
 * padrão com o texto e os CTAs dela. Fica como invólucro (e não removido)
 * para não exigir edição de app/(site)/page.js.
 */
export default function FinalCta() {
  return (
    <CtaBand
      tone="tinted"
      title="Dê um novo destino aos seus ativos."
      text="Compre ativos disponíveis ou envie materiais, equipamentos e mobiliário para avaliação."
      actions={[
        { label: "Explorar Ativos", href: "/shop" },
        { label: "Enviar Ativos", href: "/painel/vender/enviar" },
      ]}
    />
  );
}
