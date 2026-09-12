"use client";

import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./envio-acesso.module.css";

/** Único lugar de envio de ativos: a Área do Cliente. */
const DESTINO = "/painel/vender/enviar";

/**
 * Acesso ao envio de ativos.
 *
 * Substitui o formulário público que existia aqui. O envio passou a viver num
 * único lugar — Área do Cliente › Vender › Enviar Ativos — porque o ativo
 * enviado precisa de dono: sem conta não há como acompanhar avaliação, preço
 * recomendado, aprovação nem repasse, e o mesmo ativo chegava por dois
 * caminhos diferentes para a curadoria.
 *
 * Quem não tem sessão vê aqui, de forma explícita, que cadastro e login são
 * obrigatórios — e sai daqui com o destino guardado em `?de=`, para voltar ao
 * envio assim que autenticar em vez de cair no início do painel.
 */
export default function EnvioAcesso({ title, note, id = "enviar" }) {
  const { autenticado, carregando } = useSession();

  return (
    <Section tone="tinted" id={id}>
      <SectionTitle title={title} />

      <div className={styles.painel}>
        {autenticado ? (
          <>
            <p className={styles.texto}>
              Sua conta já está ativa. O envio de ativos acontece dentro da Área do Cliente, em
              <strong> Vender › Enviar Ativos</strong>, onde você acompanha avaliação, preço
              recomendado e aprovação de cada ativo enviado.
            </p>
            <div className={styles.acoes}>
              <Button href={DESTINO} variant="dark">
                Enviar Ativos
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.aviso}>
              Para enviar ativos é obrigatório ter cadastro e estar logado.
            </p>
            <p className={styles.texto}>
              O envio fica dentro da Área do Cliente para que cada ativo tenha um responsável: é ali
              que você acompanha a avaliação da curadoria, o preço e o modelo recomendados, e aprova
              a publicação. Depois de entrar, você volta direto para o formulário de envio.
            </p>
            <div className={styles.acoes}>
              <Button
                href={`/entrar?de=${encodeURIComponent(DESTINO)}`}
                variant="dark"
                aria-disabled={carregando || undefined}
              >
                Entrar
              </Button>
              <Button href={`/criar-conta?de=${encodeURIComponent(DESTINO)}`} variant="outline">
                Criar conta
              </Button>
            </div>
          </>
        )}

        {note ? <p className={styles.nota}>{note}</p> : null}
      </div>
    </Section>
  );
}
