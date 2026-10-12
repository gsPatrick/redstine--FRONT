"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const StoreContext = createContext(null);

const CART_KEY = "redestine.cart";
const SAVED_KEY = "redestine.saved";
const WISH_KEY = "redestine.wishlist";
const USER_KEY = "redestine.user";

const initialState = { cart: [], saved: [], wishlist: [], user: null, ready: false };

/**
 * Linha do carrinho.
 *
 * O carrinho vive no localStorage e é lido por telas que não voltam à API — a
 * linha tem de carregar tudo o que o carrinho e o checkout mostram: código,
 * condição, localização, unidade, saldo e a venda mínima. Faltando um campo, a
 * tela não mostra "—": mostra espaço vazio onde devia estar o código do
 * produto.
 *
 * Linhas gravadas por versões anteriores não têm os campos novos. Em vez de
 * migrar o storage, cada leitura cai num default seguro (mínima 1, saldo
 * desconhecido) — que é exatamente o comportamento antigo.
 */
function linhaDoProduto(product, quantity) {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku || null,
    name: product.name,
    price: product.price,
    image: product.images?.[0]?.src ?? null,
    condition: product.condition,
    location: product.location,
    unit: product.unit || "unidade",
    category: product.categories?.[0]?.name || null,
    categorySlug: product.categories?.[0]?.slug || null,
    // Saldo e mínima viajam na linha para o seletor do carrinho respeitar os
    // mesmos limites da página do produto sem consultar a API de novo.
    stock: Number.isFinite(Number(product.quantity)) ? Number(product.quantity) : null,
    inStock: product.inStock !== false,
    minOrderQuantity: Math.max(1, Number(product.minOrderQuantity || 1)),
    // Guardado na linha para o carrinho e o checkout saberem, sem consultar a
    // API de novo, que este ativo nao se compra direto.
    underConsultation: Boolean(product.underConsultation),
    quantity,
  };
}

/** Mínima de uma linha, tolerante a linha antiga sem o campo. */
const minimaDaLinha = (linha) => Math.max(1, Number(linha?.minOrderQuantity || 1));

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, ready: true };

    case "addToCart": {
      const existing = state.cart.find((line) => line.id === action.product.id);
      const minima = Math.max(1, Number(action.product.minOrderQuantity || 1));
      // Pedido abaixo da mínima sobe para a mínima em vez de ser recusado em
      // silêncio: quem chega aqui com 1 num ativo de mínima 5 veio de um link
      // antigo ou de um botão sem seletor, e o que ele quer é comprar.
      const pedida = Math.max(minima, Number(action.quantity) || 1);
      const cart = existing
        ? state.cart.map((line) =>
            line.id === action.product.id
              ? { ...line, quantity: line.quantity + (Number(action.quantity) || 1) }
              : line
          )
        : [...state.cart, linhaDoProduto(action.product, pedida)];
      return { ...state, cart };
    }

    /**
     * "Salvar para depois" — pedido no descritivo do carrinho.
     *
     * Lista separada, não um sinalizador na linha do carrinho: o subtotal, a
     * contagem do cabeçalho e o checkout varrem `cart` inteiro, e um item
     * salvo que continuasse lá teria de ser excluído em cada um desses lugares
     * (e um deles acabaria esquecido, somando ao total um item que o comprador
     * tirou do pedido).
     */
    case "saveForLater": {
      const line = state.cart.find((l) => l.id === action.id);
      if (!line) return state;
      return {
        ...state,
        cart: state.cart.filter((l) => l.id !== action.id),
        saved: state.saved.some((l) => l.id === action.id) ? state.saved : [...state.saved, line],
      };
    }

    case "moveToCart": {
      const line = state.saved.find((l) => l.id === action.id);
      if (!line) return state;
      const existing = state.cart.find((l) => l.id === action.id);
      return {
        ...state,
        saved: state.saved.filter((l) => l.id !== action.id),
        cart: existing
          ? state.cart.map((l) =>
              l.id === action.id ? { ...l, quantity: l.quantity + line.quantity } : l
            )
          : [...state.cart, line],
      };
    }

    case "removeSaved":
      return { ...state, saved: state.saved.filter((l) => l.id !== action.id) };

    /**
     * Quantidade da linha, com a venda mínima aplicada.
     *
     * Abaixo da mínima não vira zero nem remove a linha: fica NA mínima. Quem
     * quer tirar o item do carrinho usa "Excluir", e o "−" que apagasse a linha
     * ao chegar no fundo seria uma remoção sem intenção. O limite de cima é o
     * saldo, quando a linha o conhece.
     */
    case "setQuantity": {
      const cart = state.cart.map((line) => {
        if (line.id !== action.id) return line;
        const minima = minimaDaLinha(line);
        const teto = Number.isFinite(Number(line.stock)) && Number(line.stock) > 0
          ? Number(line.stock)
          : null;
        let q = Math.max(minima, Math.floor(Number(action.quantity) || minima));
        if (teto !== null) q = Math.min(teto, q);
        return { ...line, quantity: q };
      });
      return { ...state, cart };
    }

    case "removeFromCart":
      return { ...state, cart: state.cart.filter((line) => line.id !== action.id) };

    case "clearCart":
      return { ...state, cart: [] };

    case "toggleWishlist": {
      const exists = state.wishlist.some((item) => item.id === action.product.id);
      const wishlist = exists
        ? state.wishlist.filter((item) => item.id !== action.product.id)
        : [
            ...state.wishlist,
            {
              id: action.product.id,
              slug: action.product.slug,
              name: action.product.name,
              price: action.product.price,
              image: action.product.images[0]?.src ?? null,
              inStock: action.product.inStock,
            },
          ];
      return { ...state, wishlist };
    }

    case "signIn":
      return { ...state, user: action.user };

    case "signOut":
      return { ...state, user: null };

    default:
      return state;
  }
}

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage indisponível — o estado segue em memória */
  }
};

/**
 * Sincroniza os favoritos com a API.
 *
 * Falha em silêncio de propósito: o favorito já está gravado no navegador e o
 * coração já reagiu na tela. Derrubar a interação porque a rede caiu seria
 * pior do que ficar dessincronizado por um instante — a próxima ação
 * reconcilia.
 *
 * Visitante sem sessão continua só no navegador; ao entrar, `sincronizar`
 * envia o que ele juntou antes de ter conta.
 */
async function sincronizarFavorito(assetId) {
  const { post, lerToken } = await import("./api");
  if (!lerToken()) return;
  try {
    await post(`/wishlist/${assetId}/toggle`);
  } catch {
    /* o navegador continua sendo a fonte enquanto a API não responde */
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: "hydrate",
      payload: {
        cart: read(CART_KEY, []),
        saved: read(SAVED_KEY, []),
        wishlist: read(WISH_KEY, []),
        user: read(USER_KEY, null),
      },
    });
  }, []);

  useEffect(() => {
    if (state.ready) write(CART_KEY, state.cart);
  }, [state.cart, state.ready]);

  useEffect(() => {
    if (state.ready) write(SAVED_KEY, state.saved);
  }, [state.saved, state.ready]);

  useEffect(() => {
    if (state.ready) write(WISH_KEY, state.wishlist);
  }, [state.wishlist, state.ready]);

  useEffect(() => {
    if (state.ready) write(USER_KEY, state.user);
  }, [state.user, state.ready]);

  const value = useMemo(() => {
    const cartCount = state.cart.reduce((total, line) => total + line.quantity, 0);
    const cartTotal = state.cart.reduce((total, line) => total + line.price * line.quantity, 0);

    return {
      ...state,
      cartCount,
      cartTotal,
      addToCart: (product, quantity = 1) => dispatch({ type: "addToCart", product, quantity }),
      setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
      removeFromCart: (id) => dispatch({ type: "removeFromCart", id }),
      clearCart: () => dispatch({ type: "clearCart" }),
      saveForLater: (id) => dispatch({ type: "saveForLater", id }),
      moveToCart: (id) => dispatch({ type: "moveToCart", id }),
      removeSaved: (id) => dispatch({ type: "removeSaved", id }),
      toggleWishlist: (product) => {
        dispatch({ type: "toggleWishlist", product });
        sincronizarFavorito(product.id);
      },
      isWished: (id) => state.wishlist.some((item) => item.id === id),
      signIn: (user) => dispatch({ type: "signIn", user }),
      signOut: () => dispatch({ type: "signOut" }),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore precisa estar dentro de StoreProvider");
  return context;
}
