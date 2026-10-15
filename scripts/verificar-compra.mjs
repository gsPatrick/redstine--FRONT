/**
 * Verificação das telas de compra, no navegador.
 *
 * Existe no repositório, e não num ficheiro temporário, porque já se perdeu
 * duas vezes: um script de verificação que vive fora do projeto tem de ser
 * reescrito a cada sessão, e reescrito significa "não rodado".
 *
 * Verifica as três páginas contra os descritivos do cliente e contra o
 * protótipo visual, medindo o que importa — posição, cor computada, estado
 * `disabled` — e não a mera presença do elemento. Contar elementos já passou
 * em cima de telas quebradas neste projeto.
 *
 *   node scripts/verificar-compra.mjs [base]
 *
 * Precisa do site em pé (`next build && next start`) e da API apontada para o
 * banco com os dois ativos de referência. Build de produção, nunca `next dev`.
 */

/*
 * O Playwright é resolvido em tempo de execução e NÃO é dependência do
 * projeto: ele instalaria ~300MB de navegadores em cada `npm ci` do deploy,
 * por causa de um script que só corre à mão. Quem for verificar instala-o uma
 * vez, em qualquer lugar, e aponta o NODE_PATH:
 *
 *   npm i -g playwright && npx playwright install chromium
 *   node scripts/verificar-compra.mjs
 */
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  // Segunda tentativa via `createRequire`, que — ao contrário do `import`
  // nativo — respeita o NODE_PATH. É o que permite usar uma instalação global
  // ou de outro diretório sem copiar 300MB para dentro do projeto.
  try {
    const { createRequire } = await import("node:module");
    const { pathToFileURL } = await import("node:url");
    const exigir = createRequire(import.meta.url);
    // O pacote é CommonJS: o `import()` devolve-o em `default`, e desestruturar
    // o namespace diretamente dava `chromium` indefinido.
    const mod = await import(pathToFileURL(exigir.resolve("playwright")).href);
    chromium = (mod.default || mod).chromium;
  } catch {
    console.error(
      "Playwright nao encontrado.\n" +
        "  npm i -g playwright && npx playwright install chromium\n" +
        "  node scripts/verificar-compra.mjs\n" +
        "Ou aponte NODE_PATH para uma instalacao existente."
    );
    process.exit(2);
  }
}

const B = process.argv[2] || "http://localhost:3100";
const DIRETA = "cadeira-estofada-preta";
const CONSULTA = "cadeira-estofada-vermelha";

let ok = 0;
let falhou = 0;
const diz = (nome, cond, extra = "") => {
  if (cond) {
    ok += 1;
    console.log("  ok    " + nome);
  } else {
    falhou += 1;
    console.log("  FALHA " + nome + (extra ? " " + extra : ""));
  }
};

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1280, height: 1000 } });
const p = await ctx.newPage();
const erros = [];
p.on("pageerror", (e) => erros.push(String(e)));
p.on("console", (m) => {
  if (m.type() === "error") erros.push(m.text());
});

const abrirCard = async (titulo) => {
  await p.locator(`[class*="Accordion_trigger"]:has-text("${titulo}")`).click();
  await p.waitForTimeout(350);
  return p
    .locator(`[class*="Accordion_item"]:has-text("${titulo}") [class*="panelInner"]`)
    .innerText();
};

// ─────────────────────────────────────────────── produto: ordem e tipografia
console.log("\n== PRODUTO — ordem dos blocos (descritivo, seção 14) ==");
await p.goto(`${B}/produto/${DIRETA}`, { waitUntil: "networkidle" });

const ordem = await p.evaluate(() =>
  Array.from(document.querySelector("h1").parentElement.children).map(
    (el) => el.className.split(" ")[0] + "|" + el.tagName
  )
);
const pos = (frag) => ordem.findIndex((c) => c.includes(frag));
diz("categoria antes do título", pos("category") < pos("H1"));
diz("código logo depois do título", pos("codigo") === pos("H1") + 1);
diz("resumo antes do painel de compra", pos("summary") < pos("painelCompra"));
diz("acordeões depois do painel", pos("Accordion") > pos("painelCompra"));

const titulo = (await p.locator("h1").innerText()).trim();
const letras = titulo.replace(/[^A-Za-zÀ-ÿ]/g, "");
diz("título NÃO está todo em caixa alta", letras !== letras.toUpperCase(), `("${titulo}")`);
diz(
  "código aparece sozinho, sem a marca",
  /^Código:\s*\S+$/.test((await p.locator('[class*="codigo"]').first().innerText()).trim())
);
diz(
  "texto curto recortado em 3 linhas",
  (await p.locator('[class*="summary"]').first().evaluate((el) => getComputedStyle(el).webkitLineClamp)) === "3"
);

// ───────────────────────────────────────────────────────── painel de compra
console.log("\n== PRODUTO — painel de compra (protótipo) ==");
diz("preço, estoque e botões vivem num painel", (await p.locator('[class*="painelCompra"]').count()) === 1);

const caixas = await p.locator('[class*="precoBloco"] > *').evaluateAll((els) =>
  els.map((e) => {
    const r = e.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y) };
  })
);
diz(
  "o indicador fica AO LADO do preço, não abaixo",
  caixas.length === 2 && caixas[1].x > caixas[0].x && Math.abs(caixas[1].y - caixas[0].y) < 40,
  JSON.stringify(caixas)
);
diz(
  "há um divisor vertical entre preço e indicador",
  (await p.locator('[class*="oportunidade"]').evaluate((e) => getComputedStyle(e).borderLeftWidth)) !== "0px"
);
diz("o selo % é um círculo vermelho", (await p.locator('[class*="selo"]').evaluate((e) => getComputedStyle(e).backgroundColor)) === "rgb(196, 4, 4)");
diz("estoque tem bolinha verde", (await p.locator('[class*="bolinhaOk"]').evaluate((e) => getComputedStyle(e).backgroundColor)) === "rgb(8, 173, 33)");
diz("localização aparece com ícone", (await p.locator('[class*="metaIcone"]').count()) >= 1);

// ────────────────────────────────────────────────── venda mínima no seletor
console.log("\n== PRODUTO — venda mínima (descritivo, seção 7) ==");
const campo = p.locator('input[aria-label="Quantidade"]');
const menos = p.locator('button[aria-label="Diminuir quantidade"]');
const mais = p.locator('button[aria-label="Aumentar quantidade"]');
diz("o seletor começa na venda mínima", (await campo.inputValue()) === "5", `(${await campo.inputValue()})`);
diz('"−" desativado no mínimo', await menos.isDisabled());
await mais.click();
diz("aumenta de 1 em 1", (await campo.inputValue()) === "6");
diz('"−" reativa acima do mínimo', !(await menos.isDisabled()));
for (let i = 0; i < 25 && !(await mais.isDisabled()); i += 1) await mais.click();
diz("não passa do estoque", (await campo.inputValue()) === "15", `(${await campo.inputValue()})`);
diz('"+" desativado no teto', await mais.isDisabled());
diz(
  "quantidade disponível em texto pequeno abaixo do seletor",
  /15 unidades disponíveis/.test(await p.locator('[class*="AddToCart_minima"]').innerText())
);

// ──────────────────────────────────────────── botões: simetria e cor
console.log("\n== PRODUTO — botões (protótipo) ==");
const medir = async (sel) =>
  p.locator(sel).first().evaluate((e) => {
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return { w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor };
  });
const carrinho = await medir('button[class*="AddToCart_button"]');
const zap = await medir('[class*="ProductDetail_whatsapp"]');
diz("os dois CTAs têm a MESMA largura", Math.abs(carrinho.w - zap.w) <= 1, `(${carrinho.w} vs ${zap.w})`);
diz("e a MESMA altura", Math.abs(carrinho.h - zap.h) <= 1, `(${carrinho.h} vs ${zap.h})`);
diz('"Adicionar ao carrinho" é vermelho preenchido', carrinho.bg === "rgb(196, 4, 4)", `(${carrinho.bg})`);
diz("WhatsApp é verde", zap.bg === "rgb(8, 173, 33)", `(${zap.bg})`);
diz('"Adicionar e ir ao carrinho" continua disponível', (await p.locator('text=Adicionar e ir ao carrinho').count()) === 1);

const cartoes = await p.locator('[class*="cartaoAcao"]').evaluateAll((els) =>
  els.map((e) => Math.round(e.getBoundingClientRect().width))
);
diz("três cartões de ação secundária", cartoes.length === 3, `(${cartoes.length})`);
diz("em colunas IGUAIS", new Set(cartoes).size === 1, `(${cartoes.join(",")})`);
diz(
  "o cartão de visualizações tem UM olho, não dois",
  (await p.locator('[class*="cartaoViews"] svg').count()) === 1
);

// ────────────────────────────────────────────────────── galeria
console.log("\n== PRODUTO — galeria ==");
diz("miniaturas em coluna", (await p.locator('[class*="galleryVertical"]').count()) === 1);
diz("coração sobre a imagem", (await p.locator('[class*="ProductGallery_canto"] button').count()) === 1);
diz('dica "Passe o mouse para ampliar"', (await p.locator('text=Passe o mouse para ampliar').count()) === 1);

// ───────────────────────────────────────── acordeões: conteúdo de cada card
console.log("\n== PRODUTO — os três cards (descritivo, seções 5 a 8) ==");
const gatilhos = p.locator('[class*="Accordion_trigger"]');
diz("três acordeões", (await gatilhos.count()) === 3);
diz("todos nascem FECHADOS", (await p.locator('[class*="Accordion_trigger"][aria-expanded="true"]').count()) === 0);
diz("cada um tem ícone à esquerda", (await p.locator('[class*="Accordion_icone"]').count()) === 3);

const carac = await abrirCard("Características");
diz("Características: campos próprios do produto", /Condição/.test(carac));
diz("  e NÃO repete Localização", !/Localização/.test(carac));
diz("  e NÃO repete Disponibilidade nem Quantidade", !/Disponibilidade|Quantidade disponível/.test(carac));
diz("  e NÃO repete Venda mínima", !/Venda mínima/.test(carac));

await gatilhos.nth(1).click();
await p.waitForTimeout(350);
diz("abrir um FECHA o outro", (await p.locator('[class*="Accordion_trigger"][aria-expanded="true"]').count()) === 1);

const com = await p
  .locator('[class*="Accordion_item"]:has-text("Condições comerciais") [class*="panelInner"]')
  .innerText();
for (const campo of ["Unidade de venda", "Venda mínima", "Possibilidade de negociação", "Reserva do produto", "Garantia"]) {
  diz(`Condições comerciais tem "${campo}"`, com.includes(campo));
}

const ret = await abrirCard("Retirada e transporte");
for (const campo of ["Local de retirada", "Retirada no local", "Transporte", "Carregamento", "Agendamento", "Dúvidas"]) {
  diz(`Retirada e transporte tem "${campo}"`, ret.includes(campo));
}
diz("  e NÃO promete frete, prazo de entrega nem transportadora", !/frete|prazo de entrega|transportadora/i.test(ret));

// ─────────────────────────────────────────────────────────────── abas
console.log("\n== PRODUTO — abas (descritivo, seção 12) ==");
const abas = p.locator('[class*="Abas_aba__"]');
const rotulos = await abas.allTextContents();
diz("aba Sobre o produto", rotulos.includes("Sobre o produto"), rotulos.join(" | "));
diz("aba Aplicações", rotulos.includes("Aplicações"), rotulos.join(" | "));
diz("aba Especificações", rotulos.includes("Especificações"), rotulos.join(" | "));
diz("NÃO existe Avaliações nem Perguntas", !rotulos.some((r) => /Avalia|Pergunta/i.test(r)));
diz(
  "rótulos em capitalização normal, sem caixa alta",
  (await abas.first().evaluate((e) => getComputedStyle(e).textTransform)) === "none"
);
diz('a aba Sobre o produto abre com o título "Descrição"', (await p.locator('[class*="abaTitulo"]').count()) === 1);
await p.locator('[class*="Abas_aba__"]:has-text("Aplicações")').click();
diz("Aplicações traz a lista escrita na gestão", /Hotéis/.test(await p.locator('[class*="Abas_painel"]').innerText()));
await p.locator('[class*="Abas_aba__"]:has-text("Especificações")').click();
diz(
  "Especificações traz a ficha COMPLETA, inclusive o que saiu do card",
  /Localização|Disponibilidade|Forma de venda/.test(await p.locator('[class*="Abas_painel"]').innerText())
);

// ──────────────────────────────────────────────────────── sob consulta
console.log("\n== PRODUTO SOB CONSULTA (descritivo, seção 10) ==");
await p.goto(`${B}/produto/${CONSULTA}`, { waitUntil: "networkidle" });
const bloco = await p.locator('[class*="precoBloco"]').first().innerText();
diz('"Sob consulta" ocupa o lugar do preço', /Sob consulta/.test(bloco), `("${bloco}")`);
diz("indicador de oportunidade aparece", /abaixo do preço de mercado/.test(bloco), `("${bloco}")`);
const consulta = await medir('[class*="consultar"]');
const zap2 = await medir('[class*="ProductDetail_whatsapp"]');
diz('CTA é "Faça sua consulta"', (await p.locator('text=Faça sua consulta').count()) > 0);
diz("  com a linha de apoio DENTRO do botão", (await p.locator('[class*="consultar"] [class*="consultarApoio"]').count()) === 1);
diz("  vazado, não preenchido", consulta.bg !== "rgb(196, 4, 4)", `(${consulta.bg})`);
diz("mesma largura do WhatsApp ao lado", Math.abs(consulta.w - zap2.w) <= 1, `(${consulta.w} vs ${zap2.w})`);
diz("mesma altura", Math.abs(consulta.h - zap2.h) <= 1, `(${consulta.h} vs ${zap2.h})`);
diz("sob consulta NÃO oferece carrinho", (await p.locator('text=Adicionar ao carrinho').count()) === 0);

// ─────────────────────────────────────────────────────────── carrinho
console.log("\n== CARRINHO (descritivo) ==");
await p.goto(`${B}/cart`, { waitUntil: "networkidle" });
diz('vazio diz "Seu carrinho está vazio"', (await p.locator('text=Seu carrinho está vazio').count()) > 0);
diz("  com o texto de apoio do descritivo", (await p.locator('text=Encontre equipamentos, materiais e produtos').count()) > 0);
diz('  e "Começar a comprar"', (await p.locator('text=Começar a comprar').count()) > 0);

await p.goto(`${B}/produto/${DIRETA}`, { waitUntil: "networkidle" });
await p.locator('button:has-text("Adicionar ao carrinho")').first().click();
await p.waitForTimeout(400);
await p.goto(`${B}/cart`, { waitUntil: "networkidle" });
diz('título é "Carrinho de compras"', (await p.locator(':text-is("Carrinho de compras")').count()) > 0);
diz('contagem diz "no seu carrinho"', /no seu carrinho/.test(await p.locator('[class*="contagem"]').innerText()));
diz('"← Continuar comprando" no topo', (await p.locator('[class*="voltarTopo"]').count()) === 1);
const linha = await p.locator('[class*="CartView_line"]').first().innerText();
diz("a linha mostra o código", /Código:/.test(linha));
diz("a linha mostra o estado de estoque", /em estoque|Indisponível/i.test(linha));
diz('tem "Salvar para depois" e "Excluir"', (await p.locator('text=Salvar para depois').count()) > 0 && (await p.locator('button:text-is("Excluir")').count()) > 0);
diz("a quantidade respeita a mínima", (await p.locator('input[type="number"]').first().inputValue()) === "5");
diz('"−" do carrinho desativado na mínima', await p.locator('button[aria-label^="Diminuir"]').first().isDisabled());
diz("subtotal mostra a contagem", /Subtotal \(\d+ it/.test(await p.locator('[class*="rows"]').innerText()));
diz("faixa de benefícios com 4 itens", (await p.locator('[class*="FaixaBeneficios_item"]').count()) === 4);

// ─────────────────────────────────────────────────────────── checkout
console.log("\n== CHECKOUT (PDF) ==");
await p.goto(`${B}/checkout`, { waitUntil: "networkidle" });
const passos = await p.locator('li[class*="CheckoutView_passo"]').allTextContents();
diz("exatamente DOIS passos", passos.length === 2, `(${passos.length})`);
const legendas = await p.locator('[class*="legend"]').allTextContents();
diz('bloco "1. Dados do comprador"', legendas[0] === "1. Dados do comprador", legendas.join(" | "));
diz('bloco "2. Forma de pagamento"', legendas[1] === "2. Forma de pagamento", legendas.join(" | "));
diz('"Endereço para faturamento" é subtítulo interno', (await p.locator('[class*="subtitulo"]').count()) === 1);
for (const campo of ["nome", "documento", "email", "telefone", "cep", "cidade", "estado", "endereco", "bairro"]) {
  diz(`campo obrigatório: ${campo}`, (await p.locator(`#field-${campo}[required]`).count()) === 1);
}
for (const campo of ["empresa", "inscricaoEstadual", "observacoes"]) {
  diz(`campo opcional: ${campo}`, (await p.locator(`#field-${campo}`).count()) === 1 && (await p.locator(`#field-${campo}[required]`).count()) === 0);
}
diz("três formas de pagamento", (await p.locator('[class*="methodLabel"]').count()) === 3);
diz("Pix vem selecionado", await p.locator('input[value="pix"]').isChecked());
diz("aceite dos termos é obrigatório", (await p.locator('input[name="termos"][required]').count()) === 1);
const cta = p.locator('button[class*="CheckoutView_submit"]');
diz('CTA é "Confirmar pedido"', /Confirmar pedido/.test(await cta.innerText()));
diz("  vermelho preenchido", (await cta.evaluate((e) => getComputedStyle(e).backgroundColor)) === "rgb(196, 4, 4)");
diz("seis cartões informativos", (await p.locator('[class*="cartaoInfo"]').count()) === 6);

// ──────────────────────────────────────────────────── pedido concluído
console.log("\n== PEDIDO CONCLUÍDO (PDF, seção 2) ==");
const dados = {
  nome: "Verificador Automático",
  documento: "12345678901",
  email: "verificador@example.com",
  telefone: "21999990000",
  cep: "20000-000",
  cidade: "Rio de Janeiro",
  estado: "RJ",
  endereco: "Rua Teste, 10",
  bairro: "Centro",
};
for (const [campo, valor] of Object.entries(dados)) await p.fill(`#field-${campo}`, valor);
await p.check('input[name="termos"]');
await cta.click();
await p.waitForTimeout(4000);
diz("o pedido foi registrado e a tela 2 apareceu", (await p.locator('text=Pedido registrado com sucesso').count()) > 0);
if ((await p.locator('[class*="referencia"]').count()) > 0) {
  diz("número do pedido exibido", /RED-/.test(await p.locator('[class*="referencia"]').innerText()));
  diz("data e hora exibidas", /\d{2}\/\d{2}\/\d{4}/.test(await p.locator('[class*="dadosPedido"]').innerText()));
  diz('"Continuar comprando" é o vermelho preenchido', (await p.locator('[class*="ctaPrincipal"]').evaluate((e) => getComputedStyle(e).backgroundColor)) === "rgb(196, 4, 4)");
  diz("carrinho foi limpo", (await p.locator('text=Confirmar pedido').count()) === 0);
}

console.log("\n== CONSOLE ==");
const relevantes = erros.filter((e) => !/favicon|404|Failed to load resource/i.test(e));
diz("nenhum erro de JavaScript no caminho inteiro", relevantes.length === 0, relevantes.slice(0, 3).join(" | "));

console.log(`\n${ok} passaram, ${falhou} falharam`);
await navegador.close();
process.exit(falhou ? 1 : 0);
