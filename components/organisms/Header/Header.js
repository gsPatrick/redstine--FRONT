"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/atoms/Logo/Logo";
import Icon from "@/components/atoms/Icon/Icon";
import MegaMenu from "@/components/molecules/MegaMenu/MegaMenu";
import SearchOverlay from "@/components/molecules/SearchOverlay/SearchOverlay";
import SearchField from "@/components/molecules/SearchField/SearchField";
import { mainNav } from "@/lib/navigation";
import { useStore } from "@/lib/StoreContext";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();
  const [openMenu, setOpenMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { autenticado, podeGerir, utilizador } = useSession();
  // Quem tem capacidade de gestão cai na gestão; os demais, na Área do Cliente.
  const destinoDoPainel = podeGerir ? "/gestao" : "/painel";

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, searchOpen]);

  const isActive = (href) => href === pathname;

  return (
    <header className={styles.header}>
      <div className={styles.desktop}>
        <div className={styles.inner}>
          <div className={styles.logoSlot}>
            <Logo priority />
          </div>

          <div className={styles.rail}>
            <SearchField className={styles.search} />

            <nav className={styles.nav} aria-label="Navegação principal">
              <ul className={styles.navList}>
                {mainNav.map((item) => (
                  <li
                    key={item.label}
                    className={styles.navItem}
                    onMouseEnter={() => setOpenMenu(item.columns ? item.label : null)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
                    >
                      {item.label}
                      {item.columns ? <Icon name="chevron" size={9} className={styles.caret} /> : null}
                    </Link>

                    {item.columns ? (
                      <MegaMenu columns={item.columns} open={openMenu === item.label} />
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Já autenticado vai direto ao painel; visitante vai ao login.
                Mandar todos ao painel funcionaria — o guard redireciona —, mas
                o visitante veria uma tela de espera antes do formulário. */}
            <Link
              href={autenticado ? destinoDoPainel : "/entrar"}
              className={`${styles.iconLink} ${autenticado ? styles.iconLinkAtivo : ""}`}
              aria-label={autenticado ? "Minha conta" : "Entrar"}
              title={autenticado ? utilizador?.name : "Entrar"}
            >
              <Icon name="account" size={22} />
            </Link>
            <Link href="/lista-de-desejos" className={styles.iconLink} aria-label="Lista de desejos">
              <Icon name="heart" size={22} />
              {wishlist.length ? <span className={styles.badge}>{wishlist.length}</span> : null}
            </Link>
            <Link href="/cart" className={styles.iconLink} aria-label="Carrinho">
              <Icon name="cart" size={22} />
              {cartCount ? <span className={styles.badge}>{cartCount}</span> : null}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.mobileInner}>
          <button
            type="button"
            className={styles.burger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
          >
            <Icon name="menu" size={22} />
          </button>

          <div className={styles.mobileLogo}>
            <Logo priority />
          </div>

          <div className={styles.mobileIcons}>
            <Link
              href={autenticado ? destinoDoPainel : "/entrar"}
              className={`${styles.iconLink} ${autenticado ? styles.iconLinkAtivo : ""}`}
              aria-label={autenticado ? "Minha conta" : "Entrar"}
            >
              <Icon name="account" size={20} />
            </Link>
            <Link href="/lista-de-desejos" className={styles.iconLink} aria-label="Lista de desejos">
              <Icon name="heart" size={20} />
              {wishlist.length ? <span className={styles.badge}>{wishlist.length}</span> : null}
            </Link>
            <Link href="/cart" className={styles.iconLink} aria-label="Carrinho">
              <Icon name="cart" size={20} />
              {cartCount ? <span className={styles.badge}>{cartCount}</span> : null}
            </Link>
            <button
              type="button"
              className={styles.iconLink}
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <Icon name="magnifier" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHead}>
          <span className={styles.drawerTitle}>Menu</span>
          <button
            type="button"
            className={styles.iconLink}
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Navegação móvel">
          <ul className={styles.drawerList}>
            {mainNav.map((item) => (
              <li key={item.label} className={styles.drawerItem}>
                <Link href={item.href} className={styles.drawerLink}>
                  {item.label}
                </Link>
                {item.columns ? (
                  <ul className={styles.drawerSub}>
                    {item.columns.map((col) => (
                      <li key={col.label}>
                        <Link href={col.href} className={styles.drawerSubHead}>
                          {col.label}
                        </Link>
                        <ul className={styles.drawerLeaf}>
                          {col.items.map((leaf) => (
                            <li key={leaf.label}>
                              <Link href={leaf.href} className={styles.drawerLeafLink}>
                                {leaf.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`${styles.scrim} ${drawerOpen ? styles.scrimOpen : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
