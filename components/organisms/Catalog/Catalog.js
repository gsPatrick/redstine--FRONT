"use client";

import { useMemo, useState } from "react";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Icon from "@/components/atoms/Icon/Icon";
import FilterGroup from "@/components/molecules/FilterGroup/FilterGroup";
import ProductGrid from "@/components/molecules/ProductGrid/ProductGrid";
import styles from "./Catalog.module.css";

const facet = (products, pick) => {
  const counts = new Map();
  products.forEach((product) => {
    const values = pick(product);
    values.filter(Boolean).forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
    .map(([value, count]) => ({ value, label: value, count }));
};

export default function Catalog({ products, initialTerm = "", title, subtitle }) {
  const [term, setTerm] = useState(initialTerm);
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    location: [],
    condition: [],
    // Forma de venda e disponibilidade entram no filtro assim que o catálogo
    // passar a vir da API — o facet só aparece quando existe valor, então o
    // bloco não exibe grupo vazio enquanto os dados estáticos não os têm.
    saleFormat: [],
    availability: [],
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const facets = useMemo(
    () => ({
      category: facet(products, (p) => p.categories.map((c) => c.name)),
      brand: facet(products, (p) => [p.brand]),
      location: facet(products, (p) => [p.location]),
      condition: facet(products, (p) => [p.conditionLabel || p.condition]),
      saleFormat: facet(products, (p) => [p.saleFormatLabel]),
      availability: facet(products, (p) => [p.availabilityLabel]),
    }),
    [products]
  );

  const toggle = (group) => (value) =>
    setFilters((current) => {
      const list = current[group];
      return {
        ...current,
        [group]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });

  const results = useMemo(() => {
    const needle = term.trim().toLowerCase();

    return products.filter((product) => {
      if (needle) {
        const haystack = `${product.name} ${product.shortDescription} ${product.categories
          .map((c) => c.name)
          .join(" ")} ${product.location ?? ""}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      if (
        filters.category.length &&
        !product.categories.some((c) => filters.category.includes(c.name))
      ) {
        return false;
      }
      if (filters.brand.length && !filters.brand.includes(product.brand)) return false;

      if (filters.saleFormat.length && !filters.saleFormat.includes(product.saleFormatLabel)) {
        return false;
      }
      if (
        filters.availability.length &&
        !filters.availability.includes(product.availabilityLabel)
      ) {
        return false;
      }
      if (filters.location.length && !filters.location.includes(product.location)) return false;
      if (filters.condition.length && !filters.condition.includes(product.condition)) return false;

      return true;
    });
  }, [products, term, filters]);

  const activeCount = Object.values(filters).reduce((total, list) => total + list.length, 0);

  const clear = () => {
    setFilters({ category: [], brand: [], location: [], condition: [] });
    setTerm("");
  };

  return (
    <Section tone="light" id="comprar">
      <SectionTitle title={title} subtitle={subtitle} />

      <div className={styles.layout}>
        <button
          type="button"
          className={styles.panelToggle}
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
        >
          Filtro{activeCount ? ` (${activeCount})` : ""}
          <Icon name="chevron" size={10} />
        </button>

        <aside className={`${styles.sidebar} ${panelOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHead}>
            <h3 className={styles.sidebarTitle}>Filtro</h3>
            {activeCount ? (
              <button type="button" className={styles.clear} onClick={clear}>
                Limpar
              </button>
            ) : null}
          </div>

          <label className={styles.keyword}>
            <span className={styles.keywordLabel}>Palavra Chave</span>
            <input
              type="search"
              className={styles.keywordInput}
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar…"
            />
          </label>

          <FilterGroup
            title="Categoria"
            options={facets.category}
            selected={filters.category}
            onToggle={toggle("category")}
          />
          <FilterGroup
            title="Marca"
            options={facets.brand}
            selected={filters.brand}
            onToggle={toggle("brand")}
          />
          <FilterGroup
            title="Localização"
            options={facets.location}
            selected={filters.location}
            onToggle={toggle("location")}
          />
          <FilterGroup
            title="Condição"
            options={facets.condition}
            selected={filters.condition}
            onToggle={toggle("condition")}
          />
          {/* Estes dois só aparecem quando há valor para filtrar — um grupo
              vazio na barra lateral sugere que o filtro está quebrado. */}
          {facets.saleFormat.length > 0 && (
            <FilterGroup
              title="Forma de venda"
              options={facets.saleFormat}
              selected={filters.saleFormat}
              onToggle={toggle("saleFormat")}
            />
          )}
          {facets.availability.length > 0 && (
            <FilterGroup
              title="Disponibilidade"
              options={facets.availability}
              selected={filters.availability}
              onToggle={toggle("availability")}
            />
          )}
        </aside>

        <div className={styles.results}>
          <p className={styles.count}>
            {results.length} {results.length === 1 ? "ativo" : "ativos"}
          </p>
          <ProductGrid products={results} />
        </div>
      </div>
    </Section>
  );
}
