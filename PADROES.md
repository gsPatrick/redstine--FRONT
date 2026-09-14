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
- **"Aguardando entrada"** foi descartado: não existe registro de recebimento
  físico e o cliente decidiu não criar agora.
- **Percentual por ativo** não existe: o percentual vem do modelo comercial e é
  rígido. Fica para uma expansão futura, quando houver participação negociada.

## 12. Limpeza

> *"pode apagar e limpar tudo que não faça parte do site atual, quanto mais
> limpo, leve e otimizado melhor"*.

Página, componente ou rota sem uso é para remover, não para guardar "por
garantia".
