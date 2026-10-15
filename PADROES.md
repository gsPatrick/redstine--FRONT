# Padrões de design do site RED

Fonte única das decisões de padronização. Toda regra aqui foi **decidida pelo
cliente**, com a data e a citação, para não se perder em áudio e conversa e
para não ser redecidida por engano.

Quando um padrão daqui conflitar com o que está no código, **o padrão vence** e
o código está errado. Quando faltar padrão para um caso novo, escolher o mais
próximo daqui e registrar a extensão neste arquivo.

---

## 1. Cores

Decidido em 11/09 e reafirmado em 12/09: *"vamos abandonar as cores antigas e
usar só vermelho, preto e cinza"*.

| papel | cor |
|---|---|
| Marca / ação | vermelho `#c00000` |
| Texto e fundo forte | preto |
| Secundárias | cinza claro e cinza escuro |

O verde e o roxo do logotipo antigo **saem de tudo**, inclusive dos cards de
categoria, que os usavam para diferenciar Construção, Equipamentos e Mobiliário.

> **Conflito resolvido a favor desta seção.** Os descritivos do carrinho (seção
> 27) e de finalizar compra (seção 4) pedem **azul-marinho nos títulos**. Eles
> são anteriores à decisão acima, de 11 e 12/09, e foram implementados em
> vermelho/preto/cinza. Se o cliente quiser mesmo o azul, é esta seção que muda
> primeiro — não as páginas, uma a uma.

O **verde do WhatsApp** é a única cor fora da paleta, e fica: é a cor do canal,
reconhecida, e nunca é o CTA principal de uma página.

## 2. Botões

Citação: *"eu particularmente gosto de botão vazado (só as linhas, outline e cta
interno) e não gosto de botão preto, mas agora como faz parte da cor da marca,
pode ser que faça mais sentido; de qualquer forma vazado e vermelho é a minha
preferência"*.

| papel | forma |
|---|---|
| **Primário** | vazado vermelho: borda e texto `#c00000`, fundo transparente; ao passar o rato, preenche de vermelho com texto branco |
| **Secundário** | vazado neutro: borda e texto pretos |
| **Sobre imagem escura** | vazado branco |

Preenchido sólido fica reservado ao CTA de maior peso da página, **um por
página**. Regra completa e o mapa de variantes estão em
`components/atoms/Button/Button.js`.

Tamanho: `lg` em banner e fim de seção, `sm` em ação dentro de conteúdo.

## 3. Banner de topo (capa das páginas)

Três níveis, decididos em 12/09. A referência de altura é o próprio site.

| nível | páginas | altura | conteúdo |
|---|---|---|---|
| **Capa** | Home, Comprar | 800px | **só** título + 2 CTAs (Comprar e Vender) |
| **Interna principal** | páginas do menu: Vender, Como Funciona, Sobre a RED | 340px | título até 2 linhas + apoio até 2 linhas. **Sem CTA** |
| **Secundária** | subcategorias, páginas do rodapé | 240px | título 1 linha + apoio **1 linha**. **Sem CTA** |

> Correção de 12/09 à noite: *"nas páginas de subcategorias tem o botão de CTA no
> banner de capa; nesse padrão, as páginas internas e subcategorias não têm
> botão CTA"*. E o apoio das secundárias caiu de 2 linhas para 1.

O CTA não sumiu do fluxo: ele vive no bloco de encerramento, que toda página tem.

## 4. Banner horizontal de 1 coluna

Ocupa a largura inteira da página. **Mesma altura em todos os usos.**

Usos: banner de 50%, "para quem vende", "para quem compra", circularidade,
curadoria, e o **CTA FINAL** que encerra todas as páginas.

Estrutura fixa: **texto à esquerda, um ou dois CTAs à direita.**

> *"esse banner de baixo, do encerramento, ainda tá meio alto... deixar sempre o
> texto à esquerda e colocar um ou dois botões de CTA à direita. Desse jeito ele
> pode ser mais baixo. Se esse banner puder ter a mesma altura do banner de 50%,
> eu acho ideal."*

## 5. Banner horizontal de 2 colunas

Dois blocos lado a lado, retângulo próximo do quadrado.

Usos: RED Estoque / RED Catálogo (Vender e Modelos Comerciais), Quer Comprar /
Quer Vender (Home), Compra Direta / Sob Consulta (fim de Comprar), Para quem
compra / Para quem vende (Como Funciona).

**Altura de referência: a da Home**, que ele aprovou. Os da página Vender estão
altos demais e descem para essa altura.

Tipografia idêntica entre todos os usos. O número do bloco pode ser vermelho.

> *"esse formato de dois banners é um banner horizontal, mas de duas colunas.
> Ele aparece na home e aparece no Comprar... vai ser o mesmo padrão de todos os
> banners que tiverem nessa diagramação."*

## 6. Cards

Mesmo raciocínio dos banners: dois ou três modelos, e todo card de um mesmo
formato tem a mesma altura e a mesma tipografia.

## 7. Títulos de seção

Rótulo curto em vermelho acima do título, título alinhado à **esquerda**, no
padrão da Home que o cliente aprovou. Vive em
`components/atoms/SectionTitle/SectionTitle.js`; nenhum componente deve ter
rótulo próprio.

Exceção deliberada: estado vazio (carrinho, checkout) fica centralizado, porque
o texto é a única coisa na tela.

## 8. Simetria e alinhamento

> *"eu sou meio chato com esse negócio de padronização, assimetria, alinhamento
> e tal... se puder dar uma atenção nisso pra tentar deixar tudo organizadinho"*.

Na prática: elementos do mesmo tipo têm a mesma altura; grade com número de
colunas igual ao número de itens (nada de coluna vazia sobrando); e o mesmo
espaçamento entre blocos irmãos.

## 9. Conteúdo

- A estrutura de blocos de cada página é a do documento **"NOVO SITE RED — Corte
  conteúdo V3.3"**, confirmada em 12/09: *"nessas páginas a ordem é aquela mesmo,
  pode executar"*.
- Toda página termina com o bloco **CTA FINAL**.
- **Ativo Próprio não aparece no site.** É conceito interno. Citação: *"não vamos
  apresentar o modelo de ativo próprio no site inicialmente... inicialmente mata
  o marketplace, todo mundo vai querer vender direto"*. Por isso "Dois modelos
  comerciais" continua correto no texto público.

## 10. Marca

O logotipo novo é vermelho com preto, branco ou cinza, sem verde e sem roxo. A
**tipografia do logotipo é para manter**: *"abri mão das cores, mas gostaria de
manter a fonte, já me acostumei com o RED"*.

## 11. Dados

- **Localização** é lista fechada. Hoje com duas opções: `Rio de Janeiro - RJ` e
  `São Paulo - SP`. Era texto livre e gerava "Rio de Janeiro/RJ" e
  "Rio de Janeiro — RJ" como lugares diferentes.

  Implementada como **tabela** (`locations`), não como enum nem como chave em
  settings, porque a pergunta que decide é *quem adiciona a terceira cidade*: a
  RED, em **Configurações > Localizações**, sem migração e sem deploy. O ativo
  aponta a localização por `location_id`; o rótulo de texto continua na coluna
  `location` como cópia escrita só pelo serviço de localizações — renomear uma
  localização reetiqueta os ativos dela.

  **Sem localização é um estado válido**, e é diferente de "cidade em falta na
  lista": significa ativo por localizar. Aparece como pendência operacional e
  como a última barra do indicador de Localizações. Não se preenche por
  adivinhação — na migração dos dados antigos, "Belo Horizonte", "Curitiba" e
  "Salvador" ficaram vazios em vez de virarem cidade nova.
- **"Aguardando entrada"** foi descartado: não existe registro de recebimento
  físico e o cliente decidiu não criar agora.
- **Percentual por ativo** não existe: o percentual vem do modelo comercial e é
  rígido. Fica para uma expansão futura, quando houver participação negociada.

## 12. Blocos reservados

O item 35 (banners "para quem compra", "para quem vende" e curadoria) está
**aguardando o texto do cliente**: *"estou trabalhando nisso, se você puder
deixar o espaço reservado para esse elemento te passo tudo depois"*.

O espaço existe em `lib/home.js → bannersReservados`, no formato do banner
horizontal de 1 coluna (seção 4). Enquanto `reservado: true`, o bloco **não
renderiza**: texto de espera no ar é pior do que bloco a menos, porque o
cliente leria o provisório achando que é a versão dele.

Para publicar: substituir `title` e `text` pelo texto definitivo e apagar a
linha `reservado: true`.

## 13. Limpeza

> *"pode apagar e limpar tudo que não faça parte do site atual, quanto mais
> limpo, leve e otimizado melhor"*.

Página, componente ou rota sem uso é para remover, não para guardar "por
garantia".

## 14. Página do produto

Estrutura decidida no descritivo **"Descritivo Página de Produto REDestine —
ATUALIZADO"** (outubro/2026). Duas colunas: galeria à esquerda, com as
miniaturas EM COLUNA e zoom na imagem; informação à direita.

A **ordem dos blocos da coluna direita é a sequência em que o comprador
decide**, e não se reorganiza por conveniência de layout:

1. categoria (caixa alta pequena)
2. título — **nunca em CAIXA ALTA**, mesmo quando o fornecedor cadastrou assim
3. **código do produto sozinho**, sem a marca ao lado (a marca está na ficha)
4. texto curto, no máximo **3 linhas**
5. preço, ou "Sob consulta" **no mesmo lugar do preço**
6. estoque e localização
7. botões principais (CTA da modalidade + WhatsApp verde)
8. ações secundárias: **cartões só de ícone** — coração, compartilhar, olho com
   a contagem de visualizações. Mesma altura e mesma moldura nos três.
9. três acordeões: Características, Condições comerciais, Retirada e transporte
10. três abas: Sobre o produto, Aplicações, Especificações

**Cada card leva o que é dele, e nada do vizinho** (seções 5, 6 e 8 do
descritivo). Despejar a ficha inteira nos três repetia a mesma linha em dois
lugares:

| card | conteúdo |
|---|---|
| **Características** | só informação PRÓPRIA do produto: condição, tipo, material, cor, tamanho, marca e os campos técnicos. Localização, disponibilidade, quantidade e venda mínima **não entram** |
| **Condições comerciais** | unidade de venda, venda mínima, lote fechado (explícito, quando for), possibilidade de negociação, reserva, garantia |
| **Retirada e transporte** | local de retirada, retirada no local, transporte, carregamento, agendamento, dúvidas. **Nunca** frete integrado, prazo de entrega ou transportadora — a RED não tem nenhum dos três |

A aba **Especificações** é que traz a ficha completa, incluindo o que o card
deixou de fora.

**Aplicações** é campo novo, em `attributes.aplicacoes`, escrito na gestão (uma
por linha). Fica fora da ficha técnica de propósito: a ficha é campo-e-valor, e
aplicações é prosa — na ficha apareceria dentro de "Características".

Os acordeões **nascem fechados** e são mutuamente exclusivos: *"quando um abre o
outro fecha"*.

As abas são três e **não existem "Avaliações" nem "Perguntas e Respostas"** — o
documento é explícito. Num acervo de peça única as duas ficariam
permanentemente vazias, e aba vazia num marketplace lê-se como "ninguém
comprou".

## 15. Venda mínima

Propriedade **do ativo** (`assets.min_order_quantity`, default 1), editável em
Gestão > Comercial > Ativos.

> *"A venda mínima é uma propriedade do produto e deve controlar o seletor de
> quantidade."* Exemplo do cliente: mínima 5 com 15 em estoque permite de 5 a 15.

Regras, nos três lugares em que ela vale:

- o seletor **começa na mínima** e anda de 1 em 1;
- o "−" fica **desativado** na mínima (desativado, não escondido: botão que
  some move os irmãos de lugar);
- o "+" para no **estoque**;
- o **carrinho aplica a mesma regra** — a linha vive no `localStorage` e pode ter
  sido gravada antes de a mínima subir;
- a **API recusa** pedido abaixo da mínima (`BELOW_MIN_ORDER`). O seletor é
  conveniência; a regra é do servidor.

Mínima acima do estoque é recusada no cadastro (`MIN_ORDER_ABOVE_STOCK`):
produziria um ativo que ninguém consegue comprar.

A venda externa escapa da regra, pela mesma razão que pode informar preço — o
negócio foi fechado no atendimento e o operador está a registrar o que
aconteceu.

## 16. Indicador de oportunidade (sob consulta)

Campo de **texto** do ativo (`assets.consultation_note`), editável na gestão.
Exemplo do cliente: *"Até 30% abaixo do preço de mercado"*.

Ocupa o lugar do preço no ativo sob consulta, em vermelho, **pequeno e
secundário** — maior do que isso compete com o preço, que é o número que decide.

**Não é calculado.** No sob consulta o preço ainda não foi fechado, logo não há
percentual a derivar de `price`/`marketPrice`: calcular seria anunciar um
desconto sobre um valor que ninguém autorizou. Por isso é a gestão que escreve a
frase, e por isso ela só acompanha o ativo sob consulta — na compra direta o
preço está à vista e a frase seria uma segunda afirmação sobre o mesmo valor.

## 17. Carrinho

Descritivo **"Descritivo Página de Carrinho REDestine"**. Duas colunas: linhas à
esquerda, resumo do pedido à direita (pegajoso).

Cada linha é um **cartão horizontal** que repete o que a página do produto
mostrava — categoria, nome, código, condição, localização, estado de estoque,
preço unitário e total — porque o carrinho é a última tela antes do compromisso,
e voltar ao produto para conferir o código é onde a compra se perde.

Cada linha tem **"Salvar para depois"** e **"Excluir"**, como ações de texto, não
botões: o cartão já tem o seletor de quantidade, e três botões desenhados não
têm principal. Salvar move o item para uma **lista separada** — item salvo que
continuasse no carrinho somaria ao subtotal o que o comprador tirou do pedido.

Antes de "Você também pode se interessar" há um **respiro grande, deliberado**
(90px): sem ele a faixa encosta no carrinho e lê-se como parte do pedido. São
**3 produtos da mesma categoria**, com "Ver mais produtos →" no topo direito.

Estado vazio: *"Seu carrinho está vazio"* + **"Começar a comprar"**.

## 18. Finalizar compra e pedido concluído

Descritivo **"REDestine — Descrição Páginas Finalizar Compra e Pedido
Concluído"**. **Dois passos, e só dois**: "Dados e forma de pagamento" e "Pedido
concluído". **Sem passo intermediário de pagamento ou de confirmação.**

A razão é do negócio: a RED **não cobra no ato**. O pedido entra em análise, a
equipe confirma disponibilidade, preço e retirada, e só então se paga. Um passo
de pagamento no meio prometeria uma cobrança que não acontece.

Por isso o "pedido concluído" **não é rota própria**: é o mesmo endereço do
checkout depois de o pedido existir. Uma rota `/pedido/[ref]` seria recarregável
e linkável, e mostraria "pedido registrado" a quem não registrou nada.

Campos obrigatórios: nome, CPF/CNPJ, e-mail, telefone/WhatsApp, CEP, cidade,
estado, endereço, bairro. **Opcionais:** empresa, inscrição estadual,
observações — pessoa física não tem inscrição estadual, e exigi-la barraria o
comprador certo.

Pagamento: **Pix (recomendado, pré-selecionado)**, cartão de crédito e boleto,
mais o **aceite obrigatório** dos termos e "← Voltar para o carrinho".

O **"Confirmar pedido" é vermelho PREENCHIDO** — é a exceção que a seção 2
prevê (sólido reservado ao CTA de maior peso, um por página). Aqui ele se
justifica porque "Editar carrinho" e "Voltar para o carrinho" estão por perto, e
um vazado vermelho no meio deles não se distinguiria da navegação. O mesmo vale
para "Adicionar ao carrinho" na página do produto e "Faça sua consulta" no ativo
sob consulta: um sólido por página, e é esse.

A tela de conclusão diz o que é verdade hoje: o pedido foi **registrado** e está
em análise. Não diz "pagamento aprovado" — não há cobrança automática enquanto o
gateway não estiver ligado.

## 19. Protótipo visual da página de produto

O cliente mandou o protótipo em 13/10, depois do descritivo em texto. Onde os
dois divergem, **vence o texto**: o próprio documento diz que os protótipos são
"referência visual" e manda "aplicar o padrão textual atualizado". Por isso o
primeiro card continua a chamar-se **"Características"**, e não "Características
e especificações" como aparece desenhado.

O que o protótipo acrescenta, e que o texto não descrevia:

- **Painel de compra.** Preço, indicador, estoque, localização, botões e ações
  secundárias vivem num cartão só, de fundo cinza claro. Soltos na coluna, eles
  tinham o mesmo peso visual do texto descritivo acima, e a área que decide a
  compra não se distinguia da que explica o produto.
- **Preço e indicador lado a lado**, separados por um divisor vertical, com o
  indicador num selo redondo vermelho com "%".
- **Estoque e localização como texto com ícone** — bolinha verde para "em
  estoque", pin para o local. Não como pílulas: dentro do painel, três pílulas
  pareciam etiquetas de filtro clicáveis.
- **Dois CTAs em colunas iguais.** O de consulta é **vazado** sobre rosa claro,
  com a linha de apoio DENTRO do botão; o WhatsApp é verde preenchido, da mesma
  largura e altura. Dois preenchidos lado a lado dariam o mesmo volume a ambos
  e nenhum seria o principal.
- **Três cartões de ação secundária em colunas iguais**, ocupando a largura do
  painel.
- **Coração sobre a imagem** e a dica **"Passe o mouse para ampliar"** no canto
  inferior da galeria — sem o aviso, ninguém descobre que o zoom existe.
- **Ícone à esquerda de cada acordeão.**
- Abas em **capitalização normal**, e a de "Sobre o produto" abre com o título
  **"Descrição"**.

A versão com preço usa exatamente o mesmo painel: muda o número no lugar de
"Sob consulta" e o par de botões passa a ser "Adicionar ao carrinho" +
WhatsApp, com "Adicionar e ir ao carrinho" abaixo.

## 20. Textos que vêm dos descritivos

Os três descritivos trazem o **texto literal** de vários elementos, e esses
textos são para usar como estão — não são exemplo:

- carrinho: título "Carrinho de compras", contagem "N itens no seu carrinho",
  "← Continuar comprando" no topo direito, "Subtotal (N itens)", "Mais itens de
  [categoria]", e os textos dos cards de compra segura e retirada;
- faixa de benefícios do carrinho: "Tire suas dúvidas com a nossa equipe",
  "Seus dados protegidos", "Pagamento facilitado", "Equipamentos verificados";
- carrinho vazio: "Encontre equipamentos, materiais e produtos disponíveis na
  REDestine.";
- checkout: "Preencha seus dados para concluir o pedido.", "1. Dados do
  comprador" com "Endereço para faturamento" como **subtítulo interno do mesmo
  bloco**, "2. Forma de pagamento" com "Escolha a melhor forma de pagamento
  para o seu pedido.";
- pedido concluído: "Pedido registrado com sucesso!", "Seu pedido foi recebido e
  está em análise pela nossa equipe.", "Em breve entraremos em contato para
  confirmar a disponibilidade, condições comerciais e retirada."

Reescrevê-los "melhor" é o que faz o cliente pedir a mesma coisa duas vezes.

**O que NÃO foi feito, de propósito:** o descritivo do carrinho (seção 13) pede
que o card de produto recomendado diga "Ver produto" e mostre a localização. O
`ProductCard` é o mesmo de todo o site e diz "Ver Ativo" — mudá-lo aqui mudaria
a vitrine inteira, que ninguém pediu. Fica para quando o cliente decidir o
rótulo do card em todo o site.
