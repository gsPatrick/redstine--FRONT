"use client";

import { useState } from "react";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import {
  anexarFotosAoAtivo,
  reordenarFotosDoAtivo,
  removerFotoDoAtivo,
} from "@/lib/painel/api-cliente";
import styles from "./ativo.module.css";

const MAX_MB = 8;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Fotos do ativo.
 *
 * A ordem importa: a primeira imagem é a capa que aparece no catálogo e na
 * busca. Por isso reordenar existe aqui, e a capa é marcada — sem isso o
 * utilizador tem de adivinhar qual das oito fotos o site vai mostrar.
 *
 * Setas em vez de arrastar: arrastar não funciona no toque sem uma biblioteca,
 * e não é alcançável por teclado. Duas setas resolvem o mesmo problema e
 * funcionam em todo lado.
 *
 * Cada ação grava na hora. Um "salvar fotos" separado do "salvar dados" faria o
 * utilizador perder alterações ao sair sem clicar no botão certo.
 */
export default function Fotos({ ativoId, imagens = [], aoMudar }) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState(null);

  const proteger = async (fn) => {
    setErro(null);
    setOcupado(true);
    try {
      await fn();
      await aoMudar();
    } catch (e) {
      setErro(e.details?.[0]?.motivo || e.message);
    } finally {
      setOcupado(false);
    }
  };

  const enviar = (lista) => {
    const escolhidos = Array.from(lista || []);
    if (!escolhidos.length) return;

    const recusados = [];
    const aceites = escolhidos.filter((f) => {
      if (!TIPOS.includes(f.type)) return recusados.push(`${f.name}: formato não aceito`) && false;
      if (f.size > MAX_MB * 1024 * 1024) return recusados.push(`${f.name}: acima de ${MAX_MB} MB`) && false;
      return true;
    });

    if (recusados.length) setErro(recusados.join(". "));
    if (aceites.length) proteger(() => anexarFotosAoAtivo(ativoId, aceites));
  };

  const mover = (de, para) => {
    if (para < 0 || para >= imagens.length) return;
    const ordem = imagens.map((i) => i.id);
    const [movida] = ordem.splice(de, 1);
    ordem.splice(para, 0, movida);
    proteger(() => reordenarFotosDoAtivo(ativoId, ordem));
  };

  const remover = (img) => {
    // Apagar imagem é irreversível e o ficheiro sai do disco: confirmar aqui
    // custa um clique e evita perder a única foto boa de um ativo.
    if (!window.confirm("Remover esta foto? A imagem é apagada e não há como desfazer.")) return;
    proteger(() => removerFotoDoAtivo(img.id));
  };

  return (
    <div className={ocupado ? styles.ocupado : undefined}>
      {erro && (
        <p className={styles.erro}>
          <PanelIcon name="alert" size={15} />
          {erro}
        </p>
      )}

      {imagens.length > 0 ? (
        <ul className={styles.fotos}>
          {imagens.map((img, i) => (
            <li key={img.id} className={styles.foto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ""} loading="lazy" />

              {i === 0 && <span className={styles.capa}>Capa</span>}

              <div className={styles.acoesFoto}>
                <button
                  type="button"
                  onClick={() => mover(i, i - 1)}
                  disabled={i === 0 || ocupado}
                  aria-label="Mover para trás"
                  title="Mover para trás"
                >
                  <PanelIcon name="chevronLeft" size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => mover(i, i + 1)}
                  disabled={i === imagens.length - 1 || ocupado}
                  aria-label="Mover para a frente"
                  title="Mover para a frente"
                >
                  <PanelIcon name="chevronRight" size={13} />
                </button>
                <button
                  type="button"
                  className={styles.removerFoto}
                  onClick={() => remover(img)}
                  disabled={ocupado}
                  aria-label="Remover foto"
                  title="Remover foto"
                >
                  <PanelIcon name="close" size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.semFoto}>
          Este ativo não tem nenhuma foto. Um ativo sem imagem publica no catálogo
          com um espaço em branco no lugar do produto.
        </p>
      )}

      <label
        className={styles.solta}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          enviar(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept={TIPOS.join(",")}
          multiple
          className={styles.inputArquivo}
          disabled={ocupado}
          onChange={(e) => {
            enviar(e.target.files);
            e.target.value = "";
          }}
        />
        <PanelIcon name="image" size={20} />
        <strong>{ocupado ? "Enviando…" : "Arraste fotos ou clique para adicionar"}</strong>
        <span>JPG, PNG ou WEBP até {MAX_MB} MB cada</span>
      </label>

      {imagens.length > 1 && (
        <p className={styles.dicaOrdem}>
          A primeira foto é a capa usada no catálogo. Use as setas para reordenar.
        </p>
      )}
    </div>
  );
}
