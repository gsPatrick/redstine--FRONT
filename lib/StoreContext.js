"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const StoreContext = createContext(null);

const CART_KEY = "redestine.cart";
const WISH_KEY = "redestine.wishlist";
const USER_KEY = "redestine.user";

const initialState = { cart: [], wishlist: [], user: null, ready: false };

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload, ready: true };

    case "addToCart": {
      const existing = state.cart.find((line) => line.id === action.product.id);
      const cart = existing
        ? state.cart.map((line) =>
            line.id === action.product.id
              ? { ...line, quantity: line.quantity + action.quantity }
              : line
          )
        : [
            ...state.cart,
            {
              id: action.product.id,
              slug: action.product.slug,
              name: action.product.name,
              price: action.product.price,
              image: action.product.images[0]?.src ?? null,
              condition: action.product.condition,
              location: action.product.location,
              // Guardado na linha para o carrinho e o checkout saberem, sem
              // consultar a API de novo, que este ativo nao se compra direto.
              // Linhas gravadas antes desta mudanca nao tem o campo e seguem
              // tratadas como compra direta — corrige-se sozinho quando o
              // utilizador remove e adiciona de novo.
              underConsultation: Boolean(action.product.underConsultation),
              quantity: action.quantity,
            },
          ];
      return { ...state, cart };
    }

    case "setQuantity": {
      const cart = state.cart
        .map((line) =>
          line.id === action.id ? { ...line, quantity: Math.max(0, action.quantity) } : line
        )
        .filter((line) => line.quantity > 0);
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
        wishlist: read(WISH_KEY, []),
        user: read(USER_KEY, null),
      },
    });
  }, []);

  useEffect(() => {
    if (state.ready) write(CART_KEY, state.cart);
  }, [state.cart, state.ready]);

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
