"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import PanelLogo from "../../atoms/PanelLogo/PanelLogo";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./PanelSidebar.module.css";

/**
 * Navegacao lateral dos dois ambientes.
 *
 * A estrutura vem do documento e nao e negociavel na V1: cada nivel tem uma
 * funcao diferente (Visao Geral resume, Comprar concentra a atividade de
 * compra, Vender a de fornecedor). Por isso os grupos sao rotulados — sem o
 * rotulo, 13 itens viram uma lista sem hierarquia.
 *
 * O sino NAO aparece aqui: e elemento transversal do cabecalho, disponivel em
 * qualquer tela, e nao um item de menu no mesmo nivel de Comprar e Vender.
 */
export default function PanelSidebar({ titulo, grupos, aberta, onFechar, onSair }) {
  const pathname = usePathname();
  const [expandidos, setExpandidos] = useState(() =>
    Object.fromEntries(grupos.map((g) => [g.rotulo, true]))
  );

  const ativo = (href, exato) =>
    exato ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {aberta && <button type="button" className={styles.veu} onClick={onFechar} aria-label="Fechar menu" />}

      <aside className={`${styles.barra} ${aberta ? styles.abertaMobile : ""}`}>
        <div className={styles.topo}>
          <PanelLogo className={styles.logo} />
          <button type="button" className={styles.fechar} onClick={onFechar} aria-label="Fechar menu">
            <PanelIcon name="close" size={18} />
          </button>
        </div>

        {titulo && <p className={styles.contexto}>{titulo}</p>}

        <nav className={styles.nav}>
          {grupos.map((grupo) => (
            <div key={grupo.rotulo} className={styles.grupo}>
              {grupo.rotulo && !grupo.itens[0]?.filhos && (
                <span className={styles.rotulo}>{grupo.rotulo}</span>
              )}

              <ul className={styles.lista}>
                {grupo.itens.map((item) =>
                  item.filhos ? (
                    <li key={item.label}>
                      <button
                        type="button"
                        className={`${styles.item} ${styles.pai} ${
                          item.filhos.some((f) => ativo(f.href)) ? styles.paiAtivo : ""
                        }`}
                        onClick={() =>
                          setExpandidos((e) => ({ ...e, [item.label]: !e[item.label] }))
                        }
                        aria-expanded={expandidos[item.label] !== false}
                      >
                        {item.icone && <PanelIcon name={item.icone} size={17} />}
                        <span>{item.label}</span>
                        <PanelIcon
                          name="chevronDown"
                          size={13}
                          className={`${styles.caret} ${
                            expandidos[item.label] === false ? styles.caretFechado : ""
                          }`}
                        />
                      </button>

                      {expandidos[item.label] !== false && (
                        <ul className={styles.sublista}>
                          {item.filhos.map((filho) => (
                            <li key={filho.href}>
                              <Link
                                href={filho.href}
                                onClick={onFechar}
                                className={`${styles.subitem} ${
                                  ativo(filho.href) ? styles.ativo : ""
                                }`}
                                aria-current={ativo(filho.href) ? "page" : undefined}
                              >
                                {filho.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onFechar}
                        className={`${styles.item} ${
                          ativo(item.href, item.exato) ? styles.ativo : ""
                        }`}
                        aria-current={ativo(item.href, item.exato) ? "page" : undefined}
                      >
                        {item.icone && <PanelIcon name={item.icone} size={17} />}
                        <span>{item.label}</span>
                        {item.contador > 0 && <em className={styles.contador}>{item.contador}</em>}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </nav>

        <button type="button" className={`${styles.item} ${styles.sair}`} onClick={onSair}>
          <PanelIcon name="logout" size={17} />
          <span>Sair</span>
        </button>
      </aside>
    </>
  );
}
