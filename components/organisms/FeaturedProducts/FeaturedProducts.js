"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import EmptyBlock from "@/components/molecules/EmptyBlock/EmptyBlock";
import styles from "./FeaturedProducts.module.css";

const DURACAO = 5000;
const TRANSICAO = 750;

/**
 * Carrossel com trilho que sangra na borda (recipe edge-bleed-track) e régua
 * de progresso (recipe carousel-progress-autoplay):
 * - três cópias dos slides, começa no meio → loop sem costura
 * - posiciona por offsetLeft, não por largura × índice
 * - a pausa preserva o progresso restante em vez de reiniciar
 */
export default function FeaturedProducts({
  products,
  title = "Oportunidades em destaque",
  vazio,
}) {
  const N = products?.length ?? 0;
  // `products[i % N]` com N = 0 dá NaN, e o contador da régua mostrava
  // "NaN / 00" na tela. O carrossel só é montado quando há o que rodar.
  const slides = N ? Array.from({ length: N * 3 }, (_, i) => products[i % N]) : [];

  const trackRef = useRef(null);
  const [atual, setAtual] = useState(N);
  const [semTransicao, setSemTransicao] = useState(false);
  const [pausado, setPausado] = useState(false);

  const restante = useRef(DURACAO);
  const ultimoTick = useRef(0);
  const timer = useRef(null);
  const arraste = useRef({ ativo: false, x: 0 });

  const real = ((atual % N) + N) % N;

  // Posiciona pelo offsetLeft do slide — margens irregulares não acumulam erro.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const el = t.children[atual];
    if (!el) return;
    t.style.transition = semTransicao
      ? "none"
      : `transform ${TRANSICAO / 1000}s cubic-bezier(0.45, 0, 0.55, 1)`;
    t.style.transform = `translate3d(${-el.offsetLeft}px, 0, 0)`;
  }, [atual, semTransicao]);

  // Normaliza de volta ao bloco do meio, sem animação.
  useEffect(() => {
    const id = setTimeout(() => {
      let s = atual;
      while (s >= 2 * N) s -= N;
      while (s < N) s += N;
      if (s !== atual) {
        setSemTransicao(true);
        setAtual(s);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setSemTransicao(false))
        );
      }
    }, TRANSICAO + 20);
    return () => clearTimeout(id);
  }, [atual, N]);

  // Autoplay: `restante` guarda quanto falta, então voltar do hover continua.
  useEffect(() => {
    clearTimeout(timer.current);
    if (pausado) {
      const passou = Date.now() - ultimoTick.current;
      restante.current = Math.max(50, restante.current - passou);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    ultimoTick.current = Date.now();
    timer.current = setTimeout(() => {
      restante.current = DURACAO;
      setAtual((a) => a + 1);
    }, restante.current);
    return () => clearTimeout(timer.current);
  }, [atual, pausado]);

  const ir = (delta) => {
    restante.current = DURACAO;
    setAtual((a) => a + delta);
  };

  const irPara = (i) => {
    restante.current = DURACAO;
    setAtual(N + i);
  };

  const inicio = (e) => {
    arraste.current = { ativo: true, x: e.pageX };
    setPausado(true);
  };

  const fim = (e) => {
    if (!arraste.current.ativo) return;
    const dx = e.pageX - arraste.current.x;
    arraste.current.ativo = false;
    setPausado(false);
    if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
  };

  // Sem ativos, a seção mantém o título e troca o carrossel por um bloco que
  // explica a ausência. Uma faixa em branco sob um título faria o visitante
  // achar que a página quebrou.
  if (!N) {
    return (
      <section className={`${styles.section} ${styles.sectionVazia}`}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.kicker}>O que circula na RED</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
        </div>

        <div className={styles.inner}>
          <EmptyBlock
            titulo={vazio?.titulo ?? "Nenhum ativo publicado no momento."}
            descricao={
              vazio?.descricao ??
              "A curadoria RED está avaliando os próximos lotes. Assim que forem aprovados, aparecem aqui."
            }
            acao={vazio?.acao ?? { label: "Enviar Ativos", href: "/painel/vender/enviar" }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.kicker}>O que circula na RED</span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => ir(-1)}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 12H6M11 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => ir(1)}
            aria-label="Próximo"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={styles.viewport}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => {
          arraste.current.ativo = false;
          setPausado(false);
        }}
        onPointerDown={inicio}
        onPointerUp={fim}
      >
        <div className={styles.track} ref={trackRef}>
          {slides.map((product, i) => (
            <div className={styles.slide} key={`${product.id}-${i}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.ruler} role="tablist" aria-label="Paginação">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={i === real}
              aria-label={`Ativo ${i + 1}`}
              className={`${styles.bullet} ${i === real ? styles.bulletActive : ""}`}
              onClick={() => irPara(i)}
            >
              {i === real ? (
                <span
                  className={styles.bulletFill}
                  style={{
                    width: pausado ? undefined : "100%",
                    transition: `width ${restante.current}ms linear`,
                  }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className={styles.counter}>
          <span className={styles.counterNow}>{String(real + 1).padStart(2, "0")}</span>
          <span className={styles.counterSep}>/</span>
          <span>{String(N).padStart(2, "0")}</span>
        </div>

        <Link href="/shop" className={styles.catalogo}>
          Ver Catálogo
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h13M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
