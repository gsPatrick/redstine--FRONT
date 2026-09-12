import { notFound } from "next/navigation";
import PageHero from "@/components/organisms/PageHero/PageHero";
import PolicyBody from "@/components/organisms/PolicyBody/PolicyBody";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { policies, policySlugs } from "@/lib/policies";

export function generateStaticParams() {
  return policySlugs.map((policy) => ({ policy }));
}

export function generateMetadata({ params }) {
  const policy = policies[params.policy];
  return { title: policy ? `${policy.title} — Redestine` : "Redestine" };
}

export default function PolicyPage({ params }) {
  const policy = policies[params.policy];
  if (!policy) notFound();

  return (
    <>
      <PageHero
        size="sm"
        image="/images/2026/07/distribuidora-de-material-de-construcao-1.jpg"
        title={policy.title}
        subtitle={policy.subtitle}
        subtitleAs="h2"
      />

      <PolicyBody blocks={policy.blocks} />

      <CtaBand
        tone="tinted"
        title="Ficou alguma dúvida?"
        text="Fale com a RED para esclarecer condições, prazos e responsabilidades."
        actions={[
          { label: "Fale com a RED", href: "/contato", variant: "dark" },
          { label: "Explorar Ativos", href: "/shop", variant: "outline" },
        ]}
      />
    </>
  );
}
