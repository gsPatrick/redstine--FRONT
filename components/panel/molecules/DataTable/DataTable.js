"use client";

import { useMemo, useState } from "react";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./DataTable.module.css";

/**
 * Tabela do painel.
 *
 * Uma so implementacao para as ~12 tabelas das duas areas: ordenacao,
 * paginacao, alinhamento e responsividade resolvidos aqui em vez de
 * reescritos — e divergindo — em cada tela.
 *
 * `colunas`: { chave, titulo, alinhar?, largura?, ordenavel?, valor?, render? }
 *   `valor` alimenta a ordenacao; `render` alimenta a celula. Separados porque
 *   ordenar por JSX nao funciona: uma pilula de status nao tem ordem, o texto
 *   por tras dela tem.
 */
export default function DataTable({
  colunas,
  linhas,
  chave = "id",
  porPagina = 8,
  vazio,
  rodape,
  className = "",
}) {
  const [ordem, setOrdem] = useState(null);
  const [pagina, setPagina] = useState(1);

  const ordenadas = useMemo(() => {
    if (!ordem) return linhas;
    const col = colunas.find((c) => c.chave === ordem.chave);
    if (!col) return linhas;

    const extrair = col.valor || ((linha) => linha[col.chave]);
    const fator = ordem.direcao === "asc" ? 1 : -1;

    return [...linhas].sort((a, b) => {
      const va = extrair(a);
      const vb = extrair(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * fator;
      return String(va).localeCompare(String(vb), "pt-BR", { numeric: true }) * fator;
    });
  }, [linhas, colunas, ordem]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const atual = Math.min(pagina, totalPaginas);
  const visiveis = ordenadas.slice((atual - 1) * porPagina, atual * porPagina);

  const alternar = (col) => {
    if (!col.ordenavel) return;
    setPagina(1);
    setOrdem((anterior) => {
      if (anterior?.chave !== col.chave) return { chave: col.chave, direcao: "asc" };
      // Terceiro clique volta a ordem natural: o utilizador consegue desfazer.
      return anterior.direcao === "asc"
        ? { chave: col.chave, direcao: "desc" }
        : null;
    });
  };

  if (!linhas.length) {
    return <EmptyState {...(vazio || { titulo: "Nada por aqui ainda." })} />;
  }

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div className={styles.scroll}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              {colunas.map((col) => (
                <th
                  key={col.chave}
                  scope="col"
                  style={col.largura ? { width: col.largura } : undefined}
                  className={`${col.alinhar ? styles[col.alinhar] : ""} ${
                    col.ordenavel ? styles.ordenavel : ""
                  }`}
                  aria-sort={
                    ordem?.chave === col.chave
                      ? ordem.direcao === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {col.ordenavel ? (
                    <button type="button" className={styles.thBtn} onClick={() => alternar(col)}>
                      {col.titulo}
                      <PanelIcon
                        name={
                          ordem?.chave === col.chave && ordem.direcao === "desc"
                            ? "arrowUp"
                            : "arrowDown"
                        }
                        size={12}
                        className={ordem?.chave === col.chave ? styles.setaAtiva : styles.seta}
                      />
                    </button>
                  ) : (
                    col.titulo
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((linha, i) => (
              <tr key={linha[chave] ?? i}>
                {colunas.map((col) => (
                  <td key={col.chave} className={col.alinhar ? styles[col.alinhar] : ""}>
                    {col.render ? col.render(linha) : linha[col.chave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.rodape}>
        <span className={styles.contagem}>
          {rodape ||
            `Mostrando ${(atual - 1) * porPagina + 1} a ${Math.min(
              atual * porPagina,
              ordenadas.length
            )} de ${ordenadas.length}`}
        </span>

        {totalPaginas > 1 && (
          <nav className={styles.paginacao} aria-label="Paginação">
            <button
              type="button"
              className={styles.pgBtn}
              onClick={() => setPagina(atual - 1)}
              disabled={atual === 1}
              aria-label="Página anterior"
            >
              <PanelIcon name="chevronLeft" size={14} />
            </button>

            {paginasVisiveis(atual, totalPaginas).map((p, i) =>
              p === "..." ? (
                <span key={`gap-${i}`} className={styles.gap}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pgBtn} ${p === atual ? styles.pgAtiva : ""}`}
                  onClick={() => setPagina(p)}
                  aria-current={p === atual ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              className={styles.pgBtn}
              onClick={() => setPagina(atual + 1)}
              disabled={atual === totalPaginas}
              aria-label="Próxima página"
            >
              <PanelIcon name="chevronRight" size={14} />
            </button>
          </nav>
        )}
      </footer>
    </div>
  );
}

/** Janela deslizante com reticencias — 16 paginas nao cabem lado a lado. */
function paginasVisiveis(atual, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (atual <= 3) return [1, 2, 3, "...", total];
  if (atual >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", atual, "...", total];
}
