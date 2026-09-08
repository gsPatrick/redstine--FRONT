"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import Field from "@/components/molecules/Field/Field";
import Tabs from "@/components/molecules/Tabs/Tabs";
import ProductGrid from "@/components/molecules/ProductGrid/ProductGrid";
import WishlistTable from "@/components/organisms/WishlistTable/WishlistTable";
import { useStore } from "@/lib/StoreContext";
import styles from "./AccountView.module.css";

const PLACEHOLDER_CARDS = 4;

function PlaceholderRow({ title }) {
  return (
    <div className={styles.placeholderBlock}>
      <h3 className={styles.placeholderTitle}>{title}</h3>
      <div className={styles.placeholderGrid}>
        {Array.from({ length: PLACEHOLDER_CARDS }).map((_, index) => (
          <article key={index} className={styles.placeholderCard}>
            <Image
              src="/images/placeholder.png"
              alt=""
              width={300}
              height={300}
              className={styles.placeholderImage}
            />
            <h4 className={styles.placeholderLabel}>Card do produto</h4>
          </article>
        ))}
      </div>
    </div>
  );
}

function AuthPanels({ onSignIn }) {
  const [tab, setTab] = useState("entrar");

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") || data.get("usuario") || "cliente";
    onSignIn({ name: String(email).split("@")[0], email: String(email) });
  };

  return (
    <div className={styles.auth}>
      <div className={styles.authSwitch} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "entrar"}
          className={`${styles.authTab} ${tab === "entrar" ? styles.authTabActive : ""}`}
          onClick={() => setTab("entrar")}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "cadastro"}
          className={`${styles.authTab} ${tab === "cadastro" ? styles.authTabActive : ""}`}
          onClick={() => setTab("cadastro")}
        >
          <h3 className={styles.authTabLabel}>Cadastre-se</h3>
        </button>
      </div>

      <div hidden={tab !== "entrar"}>
        <form className={styles.authForm} onSubmit={submit}>
          <Field label="Nome de usuário ou e-mail" name="usuario" required />
          <Field label="Senha" name="senha" type="password" required />

          <label className={styles.remember}>
            <input type="checkbox" name="lembrar" className={styles.rememberInput} />
            <span className={styles.rememberBox} aria-hidden="true" />
            <span>Lembre-me</span>
          </label>

          <button type="submit" className={styles.authSubmit}>
            Acessar
          </button>

          <Link href="/my-account" className={styles.authLink}>
            Perdeu sua senha?
          </Link>
        </form>
      </div>

      <div hidden={tab !== "cadastro"}>
        <form className={styles.authForm} onSubmit={submit}>
          <Field label="Endereço de e-mail" name="email" type="email" required />
          <Field label="Senha" name="senha" type="password" required />

          <p className={styles.privacy}>
            Your personal data will be used to support your experience throughout this website, to
            manage access to your account, and for other purposes described in our{" "}
            <Link href="/politica-de-privacidade" className={styles.inlineLink}>
              política de privacidade
            </Link>
            .
          </p>

          <button type="submit" className={styles.authSubmit}>
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AccountView({ variant = "account" }) {
  const { user, signIn, signOut, cart, wishlist } = useStore();

  const salesTabs = [
    {
      label: "Resumo",
      content: (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <h4 className={styles.metricLabel}>Valor já pago</h4>
            <h3 className={styles.metricValue}>R$ 000,00</h3>
          </div>
          <div className={styles.metric}>
            <h4 className={styles.metricLabel}>Valor a receber</h4>
            <h3 className={styles.metricValue}>R$ 000,00</h3>
          </div>
        </div>
      ),
    },
    {
      label: "Ativos Publicados",
      content: <PlaceholderRow title="Confira seus ativos que estão publicados na platafomra" />,
    },
    {
      label: "Ativos Vendidos",
      content: <PlaceholderRow title="Confira seus ativos que foram vendidos na plataforma" />,
    },
    {
      label: "Valor a Receber",
      content: (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <h4 className={styles.metricLabel}>Valor a receber</h4>
            <h3 className={styles.metricValue}>R$ 000,00</h3>
          </div>
        </div>
      ),
    },
    {
      label: "Histórico",
      content: <p className={styles.empty}>Nenhum registro no histórico.</p>,
    },
  ];

  const panelTabs = [
    {
      label: "Compras",
      content: cart.length ? (
        <ProductGrid
          products={cart.map((line) => ({
            id: line.id,
            slug: line.slug,
            name: line.name,
            price: line.price,
            shortDescription: "",
            condition: line.condition,
            location: line.location,
            images: line.image ? [{ src: line.image, alt: line.name, width: 600, height: 600 }] : [],
            categories: [],
            attributes: [],
          }))}
        />
      ) : (
        <p className={styles.empty}>Nenhuma compra registrada ainda.</p>
      ),
    },
    { label: "Vendas", content: <Tabs items={salesTabs} variant="ghost" /> },
    { label: "Favoritos", content: <WishlistTable bare /> },
    {
      label: "Minha Conta",
      content: (
        <div className={styles.accountBox}>
          <dl className={styles.accountRows}>
            <div className={styles.accountRow}>
              <dt>Nome</dt>
              <dd>{user?.name ?? "—"}</dd>
            </div>
            <div className={styles.accountRow}>
              <dt>E-mail</dt>
              <dd>{user?.email ?? "—"}</dd>
            </div>
            <div className={styles.accountRow}>
              <dt>Favoritos</dt>
              <dd>{wishlist.length}</dd>
            </div>
          </dl>
          <button type="button" className={styles.signOut} onClick={signOut}>
            Sair da conta
          </button>
        </div>
      ),
    },
  ];

  const dashboardTabs = [
    ...panelTabs,
    {
      label: "Sair",
      content: (
        <div className={styles.accountBox}>
          <p className={styles.empty}>Encerrar a sessão neste dispositivo.</p>
          <button type="button" className={styles.signOut} onClick={signOut}>
            Sair da conta
          </button>
        </div>
      ),
    },
  ];

  return (
    <Section tone="light">
      <SectionTitle
        title={variant === "dashboard" ? "Seus Últimos Pedidos na Redestine" : "Painel Cliente"}
        align="start"
      />
      <div className={styles.dashLink}>
        {variant === "dashboard" ? (
          <Button href="/my-account" variant="outline" size="sm">
            Voltar ao Dashboard V1
          </Button>
        ) : (
          <Button href="/teste-dashboard" variant="outline" size="sm">
            Acessar Dashboard Vendas Demo
          </Button>
        )}
      </div>
      {user ? null : (
        <div className={styles.authSlot}>
          <AuthPanels onSignIn={signIn} />
        </div>
      )}

      <Tabs items={variant === "dashboard" ? dashboardTabs : panelTabs} />
      {variant === "dashboard" ? null : <h2 className={styles.panelNote}>painel 4</h2>}
    </Section>
  );
}
