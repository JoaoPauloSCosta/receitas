# DESIGN.md — Base de design do app

> Referência analisada: https://www.seara.com.br/minha-receita/ (Minha Receita, Seara).
> Valores medidos no navegador (estilos computados + variáveis CSS do site). Onde o valor é **estimado** (visual, não medido) está marcado com `~`.
> Use este arquivo como fonte única de verdade para cores, tipografia, componentes e comportamento. Se algo não estiver aqui, siga o padrão mais próximo, não invente um novo.

---

## 1. Princípios

1. **Quente e apetitoso**: laranja forte + terracota, muito branco, fotos grandes e saturadas. O conteúdo (imagem) é o protagonista.
2. **Arredondado e amigável**: pílulas (`9999px`) para ações e etiquetas, `8px` em cards, `12px` em modais, círculos em botões de ícone.
3. **Hierarquia por cor e peso, não por tamanho**: títulos em terracota `#ce5032` bold; texto de apoio em cinza.
4. **Tipografia única** (uma família, vários pesos). Sem serifa, sem fonte decorativa.
5. **Interações curtas**: transições de `0.3s`, sem animação chamativa.
6. **Tailwind-friendly**: o site usa classes utilitárias (`text-2xl`, `rounded-lg`, `p-4`, `line-clamp-3`). Os tokens abaixo mapeiam direto para `tailwind.config`.

---

## 2. Cores

### 2.1 Marca
| Token | Hex | Uso |
|---|---|---|
| `--brand-orange` | `#ff5300` | Cor principal: botões de cookie, input de busca, rodapé (faixa de aviso), títulos de coluna do rodapé |
| `--brand-orange-header` | `#ff5b0d` | Fundo do header (fixo) |
| `--brand-orange-seara` | `#ff6720` | Botão primário de modal (ex.: "Fazer Login") |
| `--brand-orange-dark` | `#fa4616` | Hover/pressed do laranja |
| `--brand-terracotta` | `#ce5032` | **Cor de destaque de conteúdo**: títulos de seção, H1, rótulo de categoria, botões pílula, setas de carrossel, bolinhas de paginação |
| `--brand-yellow` | `#fdda25` | Amarelo do logo / realces pontuais |
| `--brand-yellow-dark` | `#ff8f1c` | Âmbar de apoio |
| `--brand-gold` | `#e0bb6e` | Linha premium (Gourmet) |

Gradientes da linha premium (só para seção "gourmet", não usar no resto):
- Borda: `linear-gradient(#2b2b2b,#2b2b2b) padding-box, linear-gradient(90deg,#ffd277,#77530a,#ffd277) border-box`
- Texto: `linear-gradient(270deg,#ffd277,#e5c682,#d0a044,#71531f,#f1d286,#b18143,#edcd8b,#ffd277,#e0bb6e)`
- Bolinhas de paginação: `linear-gradient(0deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c)`

### 2.2 Neutros
| Token | Hex | Uso |
|---|---|---|
| `--white` | `#ffffff` | Fundo da página, cards, modal |
| `--cream` | `#faf5f3` | Fundo alternativo suave |
| `--cream-icon` | `#f6e4dc` | Ícone de coração (favorito) vazio |
| `--gray-900` | `#333333` | Títulos de modal |
| `--gray-text` | `#503c3c` | Texto corrido (tom quente) |
| `--gray-700` | `#3f3e3d` | Itens de submenu |
| `--gray-600` | `#666666` | Mensagens, títulos de card pequeno, meta |
| `--gray-550` | `#696969` | Subtítulos (h4) |
| `--gray-500` | `#6b7280` | Botão secundário ("Cancelar") |
| `--gray-400` | `#8e8e8e` | Texto terciário |
| `--gray-border` | `#e5e7eb` | Bordas padrão (Tailwind gray-200) |
| `--overlay` | `rgba(0,0,0,.5)` | Fundo de modais |

### 2.3 Cores de categoria (etiqueta em pílula sobre a foto)
Estimadas visualmente (`~`), validar com o time de marca antes de fixar.
| Categoria | Cor `~` |
|---|---|
| Aves | `#e8643a` |
| Peixes e frutos do mar | `#2e7aa8` |
| Carne suína | `#e8336d` |
| Bovinos | `#e0262d` |
| Cordeiro | `#b0153c` |
| Frios e embutidos | `#d4743a` |
| 100% vegetal | `#8fb23a` |
| Doces, bolos e sobremesas | `#b05cc2` |
| Pães e massas | `#a07840` |

Outras cores vistas em fundos: `#27455c` (azul-petróleo) e `#346e4a` (verde escuro) em blocos de marca/banners.

### 2.4 Semânticas (propostas, o site não mostra estados de erro/sucesso)
| Estado | Cor |
|---|---|
| Sucesso | `#346e4a` (verde do site) |
| Erro | `#fa4616` (laranja-escuro) |
| Aviso | `#ff8f1c` |
| Info | `#27455c` |
| WhatsApp flutuante | verde `~#25d366` |

**Regra de contraste**: texto branco só sobre `#ce5032`, `#ff5300`, `#ff5b0d`, `#6b7280` ou foto com gradiente escuro. Texto sobre laranja claro/amarelo deve ser preto/cinza escuro.

---

## 3. Tipografia

**Família**: `Lufga` (comercial/proprietária) com fallback `sans-serif`. Pesos carregados: 300, 400, 500, 600, 700.

> Lufga é licenciada. Para o nosso app, usar uma alternativa geométrica/humanista de licença livre e com visual próximo (ex.: **Outfit**, **Plus Jakarta Sans** ou **Poppins**) **somente após aprovação**, ou licenciar a Lufga. Não instalar fonte nova sem confirmar.

```css
font-family: "Lufga", "Outfit", system-ui, -apple-system, "Segoe UI", sans-serif;
```

### Escala
| Papel | Tamanho / altura de linha | Peso | Cor | Extras |
|---|---|---|---|---|
| H1 (título da página) | 36px / 40px | 700 | `#ce5032` | centralizado, `mb-8` |
| Título de seção ("Churrasco", "Navegue por Marca") | ~20–24px | 700 | `#ce5032` | alinhado à esquerda |
| Título de card destaque | 24px / 32px (`text-2xl`) | 700 | `#fff` | `line-clamp-3` |
| Título de card pequeno | ~16–18px / 28px | 700 | `#666` | |
| H3 | 18px / 28px | 700 | `#666` | |
| Título de modal | 18px / 27px | 700 | `#333` | centralizado |
| Corpo | 16px / 24px | 400–700 | `#503c3c` ou `#000` | |
| Parágrafo de hero | 18px / 28px | 400 | `rgba(255,255,255,.9)` | |
| H4 / nav | 14px / 21px | 600 | `#fff` (header) / `#3f3e3d` (submenu) | |
| Rótulo de categoria | 12px | 700 | `#ce5032` | `uppercase`, tracking padrão |
| Meta (porções • tempo) | 12px | 700 | `#666` (ou `#fff` sobre foto) | separador `•` |
| Rodapé: aviso | 14px | 700 | `#fff` | |
| Rodapé: links | 14px | 400 | `#000` | |
| Rodapé: título de coluna | 14px | 700 | `#ff5300` | |
| Rodapé: legal | ~11–12px | 400 | `#000` | |

Regras: peso 700 domina títulos e rótulos; 600 em navegação e botões pequenos; 400 em texto corrido longo. Texto de ação/etiqueta em **CAIXA ALTA**; título e frase em caixa normal.

---

## 4. Layout, espaçamento e forma

- **Container**: largura útil ~1012px (desktop), margem lateral ~24–32px. Grid de cards com gap ~16–24px.
- **Header**: `position: fixed`, altura **72px**, fundo `#ff5b0d`, sem sombra. Logo à esquerda (branco), item "Categorias" com seta, links "Receitas · Matérias · Livros de Receitas" (14/600 branco), busca à direita, ícone de usuário em círculo.
- **Escala de espaço** (Tailwind): 4, 8 (`p-2`), 12, 16 (`p-4`), 20, 24, 30, 32 (`mb-8`).
- **Raios**: `2px` (botões de cookie), `6px` (botões de modal), `8px` (cards, imagens), `~11–12px` (input de busca, modal 12px), `9999px` (pílulas), `50%` (botões de ícone).
- **Sombras**: botão de ícone `0 2px 8px rgba(0,0,0,.1)`; setas de carrossel `0 2px 8px rgba(0,0,0,.15)`; banner de cookie `0 0 18px rgba(0,0,0,.2)`; modal `0 10px 30px rgba(0,0,0,.3)`. Cards em si **sem sombra**.
- **Z-index**: widgets flutuantes `999`; modal acima de tudo; banner de cookie e menu de acessibilidade no máximo.
- **Responsivo**: grid de cards 1 col (mobile) → 2 → 3/4 col (desktop); card destaque ocupa `col-span-2`.

---

## 5. Componentes

### 5.1 Botão pílula (CTA de conteúdo)
"MAIS RECEITAS …", "TODAS AS RECEITAS", "VER TODAS AS MATÉRIAS".
```
bg #ce5032 · texto #fff · 14px/700 · UPPERCASE
padding 8px 16px · altura 36px · radius 9999px · sem borda/sombra
transition all .3s
```
Hover (proposto): `#fa4616`. Focus: anel 2px `#ff5300` com offset 2px.

### 5.2 Botão de modal
```
altura 44px · padding 10px 20px · radius 6px · 16px/700 · texto #fff · transition background .3s
Primário:   bg #ff6720   (hover ~#fa4616)
Secundário: bg #6b7280   (hover ~#4b5563)
```
Dois botões lado a lado, centralizados, gap ~8–12px. Secundário (cancelar) sempre à esquerda, primário à direita.

### 5.3 Botões do banner de cookies (OneTrust)
```
altura ~42px · padding 12px 10px · radius 2px · 13px/600
Preenchido (Rejeitar / Aceitar): bg #ff5300, texto #fff, borda 1px #ff5300
Contorno (Definições):           bg #fff, texto #ff5300, borda 1px #ff5300
```
Empilhados em coluna à direita, mesma largura (~233px). Fechar: "X" 44×44, cinza `#555`.

### 5.4 Botão de ícone circular
- **Favorito** (coração): 40×40, círculo branco, `position:absolute; top:10px; right:10px`, sombra suave, ícone coração contorno `#f6e4dc`. Hover/pressed: escurece para cinza translúcido. `aria-label="Fazer login para favoritar"` quando deslogado.
- **Seta de carrossel**: círculo `#ce5032`, seta branca, sombra `0 2px 8px rgba(0,0,0,.15)`.
- **Usuário (header)**: círculo laranja mais claro com ícone branco.

### 5.5 Campo de busca
```
altura 48px · bg #ff5300 · borda 2px solid #fff · radius ~12px
texto e placeholder #fff · 14px/600 · padding 0 40px 0 8px
lupa branca à direita · placeholder: "Encontre o que quiser"
```
No header laranja o campo é "vazado" (mesmo laranja, só contorno branco).

### 5.6 Card de receita
```
radius 8px · fundo branco · cursor pointer · imagem h 22rem (352px) object-cover radius 8px
hover: imagem com transform scale (transition transform .3s cubic-bezier(.4,0,.2,1))
```
- **Destaque** (`col-span-2`): texto **sobre a foto**, com gradiente `linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.6) 30%, rgba(0,0,0,.3) 60%, rgba(0,0,0,0) 100%)`, padding 16px. Ordem: rótulo de categoria (terracota) → título 24px branco → linha fina → meta branca 12px.
- **Pequeno**: imagem em cima; abaixo rótulo `#ce5032` 12px uppercase → título `#666` 700 → divisor `border-top` claro → meta `#666` 12px.
- **Meta**: `porções • tempo` (ex.: `3 a 4 • 40 min`). Separador `•` com espaço. Se faltar dado, mostrar só o que existe (o site às vezes mostra `•` sozinho — **evitar**).

### 5.7 Tile de categoria
Foto com cantos arredondados (~16–20px) e **pílula colorida sobreposta na base** (cor da §2.3), texto branco 12–13px/600 uppercase, pílula quase da largura da foto. Grade 3×3.

### 5.8 Hero / banner rotativo
Imagem full-bleed com overlay escuro. Etiqueta "RECEITA" (pílula branca, texto pequeno cinza) → título branco bold ~36px → descrição branca 18px truncada com reticências. Indicadores: barras finas horizontais na base (inativas translúcidas, ativa sólida), não bolinhas.

### 5.9 Carrossel de marcas
Logos em cores originais, nome abaixo (14px/600 azul-petróleo/cinza), setas terracota nas laterais, paginação por pontos pequenos `#ce5032` (ativo preenchido e maior).

### 5.10 Rodapé
1. Faixa laranja `#ff5300` com aviso institucional: texto branco 14/700, links de contato com ícone (telefone / WhatsApp).
2. Fundo branco, 4 colunas: título `#ff5300` 14/700, links `#000` 14/400, espaçamento vertical ~8px.
3. Linha legal 11–12px preto; CNPJ/endereço em negrito; copyright.

---

## 6. Popups, modais e notificações

### 6.1 Modal de confirmação / login (observado)
Disparado ao clicar no coração estando deslogado.
```
overlay: position fixed, cobre a tela, rgba(0,0,0,.5), flex center
caixa:   bg #fff · radius 12px · padding 30px · width 400px (max 400, 90% no mobile)
         sombra 0 10px 30px rgba(0,0,0,.3) · texto centralizado · transition transform .3s (entra com leve escala)
título:  "OPA..." 18px/700 #333, margin-bottom 10px
texto:   "Você precisa estar logado para adicionar um favorito." 16px #666, margin-bottom 20px
ações:   [Cancelar cinza #6b7280] [Fazer Login laranja #ff6720]
```
Tom de voz: curto, informal, em PT-BR; título é uma interjeição ("OPA...", "Ops!"). Fecha com Cancelar, clique no overlay e `Esc`. Trava o scroll do fundo enquanto aberto.

### 6.2 Banner de cookies (observado)
Barra fixa no rodapé, fundo branco, sombra `0 0 18px rgba(0,0,0,.2)`, z-index máximo. Texto à esquerda (cinza escuro 13–14px) com links **Política de Cookies** e **Política de Privacidade** em negrito sublinhado; botões à direita (§5.3). Depois de escolher, vira um **botão flutuante laranja circular** (canto inferior esquerdo, ícone de biscoito) para reabrir as preferências.
> Padrão do nosso app: pré-selecionar sempre a opção mais restritiva, nunca "Aceitar todos" como padrão.

### 6.3 Toast de notificação
**Não foi observado nenhum toast visual neste site** (só regiões `aria-live` ocultas do carrossel, sem aparência). O padrão abaixo é **proposto**, derivado dos tokens, para manter o mesmo vocabulário visual:
```
posição: canto inferior direito (desktop) / topo centralizado (mobile), margem 16px, empilha com gap 8px
caixa:   bg #fff · radius 8px · padding 12px 16px · sombra 0 2px 8px rgba(0,0,0,.15)
         borda esquerda 4px na cor semântica (§2.4) · texto 14px/600 #503c3c · ícone 20px na cor semântica
duração: 4s (erro: 6s ou até fechar) · entrada slide+fade .3s · botão "×" 24×24
role:    status (sucesso/info) · alert (erro) · aria-live polite/assertive
```
Mensagens curtas, 1 frase, verbo no início ("Receita salva", "Não foi possível salvar").

### 6.4 Widgets flutuantes (observados)
| Widget | Posição | Forma |
|---|---|---|
| WhatsApp | direita-baixo, 60×60, z 999 | círculo verde com ícone branco |
| Acessibilidade | direita-baixo (acima), 50×50 | círculo `#d0d0d7` com anel branco 3px |
| Leitor de áudio (Audima) | direita, meio, 52×62 | aba cinza escura com ícone de alto-falante |
| Preferências de cookie | esquerda-baixo, 50×50 | círculo laranja com ícone |

Não empilhar mais de 3 widgets flutuantes; reservar `padding-bottom` no fim da página para não cobrir conteúdo.

---

## 7. Movimento
- Duração padrão **0.3s** (`transition: all .3s`); easing dos cards `cubic-bezier(.4, 0, .2, 1)`.
- Hover de card: zoom suave na imagem; botões: troca de cor.
- Respeitar `prefers-reduced-motion`: desativar zoom e slide.

---

## 8. Imagens e ícones
- Fotografia de comida com alta saturação, fundo escuro ou neutro, enquadramento próximo.
- Cantos sempre arredondados (`8px`); `object-fit: cover`; altura fixa nos cards para alinhar a grade.
- Ícones de traço simples, 24px, na cor do contexto (branco no laranja, `#ce5032` no branco). Evitar mistura de estilos (contorno × preenchido).

---

## 9. Acessibilidade
- `aria-label` em todo botão só-ícone (ex.: "Fazer login para favoritar", "Next slide").
- Contraste: branco sobre `#ff5300`/`#ce5032` passa para texto grande/negrito; para texto pequeno regular, preferir `#ce5032` ou mais escuro. Verificar cada caso.
- Foco visível em todos os controles; modal com foco preso e retorno ao gatilho ao fechar.
- Alvos de toque ≥ 40×40px.
- Manter ferramentas de acessibilidade (leitor de tela/áudio, menu de acessibilidade) quando o produto for público.

---

## 10. Tokens prontos

### CSS
```css
:root {
  --brand-orange: #ff5300;
  --brand-orange-header: #ff5b0d;
  --brand-orange-seara: #ff6720;
  --brand-orange-dark: #fa4616;
  --brand-terracotta: #ce5032;
  --brand-yellow: #fdda25;
  --brand-amber: #ff8f1c;
  --brand-gold: #e0bb6e;

  --cream: #faf5f3;
  --text: #503c3c;
  --gray-900: #333333;
  --gray-600: #666666;
  --gray-500: #6b7280;
  --border: #e5e7eb;
  --overlay: rgba(0, 0, 0, 0.5);

  --success: #346e4a;
  --error: #fa4616;
  --warning: #ff8f1c;
  --info: #27455c;

  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 9999px;

  --shadow-icon: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-arrow: 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-bar: 0 0 18px rgba(0, 0, 0, 0.2);
  --shadow-modal: 0 10px 30px rgba(0, 0, 0, 0.3);

  --font: "Lufga", "Outfit", system-ui, sans-serif;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --header-h: 72px;
}
```

### Tailwind (`theme.extend`)
```js
colors: {
  brand: { DEFAULT: '#ff5300', header: '#ff5b0d', seara: '#ff6720', dark: '#fa4616',
           terracotta: '#ce5032', yellow: '#fdda25', amber: '#ff8f1c', gold: '#e0bb6e' },
  cream: '#faf5f3',
  ink: { DEFAULT: '#503c3c', 900: '#333333', 600: '#666666', 500: '#6b7280' },
},
borderRadius: { pill: '9999px' },
boxShadow: {
  icon: '0 2px 8px rgba(0,0,0,.1)', arrow: '0 2px 8px rgba(0,0,0,.15)',
  modal: '0 10px 30px rgba(0,0,0,.3)',
},
fontFamily: { sans: ['Lufga', 'Outfit', 'system-ui', 'sans-serif'] },
```

---

## 11. Checklist para cada tela nova
- [ ] Título em `#ce5032` 700; textos de apoio em cinza da paleta.
- [ ] Ações primárias como pílula terracota (conteúdo) ou botão 6px laranja (modal/formulário).
- [ ] Cards `8px`, sem sombra, imagem com zoom no hover.
- [ ] Rótulos/etiquetas em CAIXA ALTA 12px 700.
- [ ] Modais: overlay 50%, caixa 12px, 2 botões (cancelar cinza + ação laranja).
- [ ] Toasts: padrão da §6.3, com cor semântica e `aria-live`.
- [ ] Textos em PT-BR, tom curto e informal.
- [ ] Contraste e foco verificados; botões só-ícone com `aria-label`.

## 12. Limites desta análise
- Cores de categoria (§2.3) e algumas alturas/tamanhos de título de seção são **estimados** visualmente.
- Estados de hover/focus e toasts não puderam ser medidos (o site não expõe toast visual); os valores propostos estão marcados como tal.
- Medido apenas em **desktop** (~1012px de largura útil); breakpoints mobile devem ser validados à parte.
- Logos, fotos e a fonte Lufga pertencem à Seara/terceiros: **não reutilizar** no nosso app; usar identidade e ativos próprios.
