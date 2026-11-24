# CONTEXTO.md — Documentação Técnica e Funcional do Aplicativo **Minha Receita**

> **Objetivo deste arquivo:** Servir como fonte única de contexto técnico e funcional sobre o aplicativo **Minha Receita**. Consulte (ou anexe) este documento sempre que for planejar ou implementar novas funcionalidades, corrigir bugs ou evoluir a arquitetura do projeto.

---

## 1. Visão Geral do Aplicativo

O **Minha Receita** (`minha-receita-astro`) é um aplicativo web editorial de receitas culinárias construído com **Astro** e **Tailwind CSS v4**, projetado sob a arquitetura **Zero Banco de Dados**:

- **Conteúdo em arquivos locais:** Cada receita é um arquivo Markdown (`.md`) com frontmatter YAML salvo na pasta `receitas/`.
- **Geração estática (SSG):** O Astro lê a pasta `receitas/` via **Content Collections**, gera páginas estáticas para todas as receitas, categorias e listagens paginadas, e exporta um índice JSON estático em `/api/receitas.json`.
- **Interatividade client-side sem backend:** Busca instantânea (autocomplete no header e página dedicada), filtros dinâmicos, favoritos, avaliação 5 estrelas, checklist de ingredientes e progresso de etapas funcionam diretamente no navegador usando o índice `/api/receitas.json` e persistência em `localStorage`.
- **Criação facilitada de receitas:** O app inclui um **Gerador Visual de Markdown** (`/nova-receita`) e uma **Skill do Antigravity** (`.agents/skills/gerar-receita/`) para criar receitas via chat seguindo o schema exato do projeto.

---

## 2. Stack Tecnológica e Comandos

| Camada | Tecnologia / Versão | Observações |
| :--- | :--- | :--- |
| **Framework** | Astro (`^7.4.13`) | SSG + Content Collections (`glob` loader) + Fonts API |
| **Estilização** | Tailwind CSS v4 (`^4.3.5`) via `@tailwindcss/vite` | Tokens customizados `--mr-*` em `src/styles/tokens.css` |
| **Linguagem** | TypeScript (`^5.9.3`) | Configuração `astro/tsconfigs/strict` (`tsconfig.json`) |
| **Tipografia** | `Outfit` (Google Fonts via Astro Fonts API) | Variável `--font-outfit` (pesos `300`–`700`), fallback para `Lufga` / system-ui |
| **Validação de Conteúdo** | Zod (`astro/zod`) | Schema estrito em `src/content.config.ts` |
| **Armazenamento de Estado** | `window.localStorage` | Favoritos, avaliações, checklist de ingredientes e etapas concluídas |

### Comandos NPM (`package.json`)

```bash
npm run dev       # Inicia servidor de desenvolvimento Astro com hot-reload da pasta receitas/
npm run build     # Gera o site estático (dist/) e o índice /api/receitas.json
npm run preview   # Visualiza o build de produção localmente
npm run check     # Executa verificação de tipos (astro check)
npx astro sync    # Sincroniza tipos e valida o schema Zod de todas as receitas em receitas/
```

---

## 3. Estrutura de Diretórios

```text
Astro/
├── astro.config.mjs                 # Configuração do Astro, plugin @tailwindcss/vite e fonte Outfit
├── package.json                     # Dependências e scripts npm
├── tsconfig.json                    # TypeScript strict estendendo astro/tsconfigs/strict
│
├── docs/                            # Documentação de contexto e design do projeto
│   ├── CONTEXTO.md                  # Este arquivo (contexto geral do app)
│   ├── DESIGN.md                    # Base visual de referência (cores, tipografia, princípios)
│   └── DESIGN_SYSTEM.md             # Especificação completa do Design System WCAG AA
│
├── .agents/skills/gerar-receita/    # Skill de IA para criação padronizada de receitas .md
│   ├── SKILL.md
│   └── resources/modelo-receita.md
│
├── public/
│   ├── favicon.svg
│   └── images/receitas/*.jpg        # Fotografias das receitas (20 imagens atuais)
│
├── receitas/                        # Content Collection de receitas (Zero Banco de Dados)
│   ├── README.md                    # Guia rápido da pasta (ignorado pela collection)
│   ├── _MODELO.md                   # Template base (ignorado pela collection)
│   └── *.md                         # Arquivos de receita (20 receitas cadastradas atualmente)
│
└── src/
    ├── content.config.ts            # Definição da collection `receitas` e schema Zod
    ├── layouts/
    │   └── BaseLayout.astro         # Shell HTML, <Font>, skip-link, Header, Footer, ToastContainer e boot de scripts
    ├── lib/
    │   ├── categories.ts            # 9 categorias oficiais, cores AA, aliases e resolveCategory()
    │   └── recipes.ts               # Normalização, ordenação, parsing de tempo e divisão de seções HTML
    ├── scripts/
    │   ├── favorites.ts             # Persistência e UI reativa de favoritos (localStorage)
    │   ├── search.ts                # Carregamento de /api/receitas.json, algoritmo de busca e autocomplete/modal
    │   └── toast.ts                 # Sistema de notificações toast WCAG AA + bridge global
    ├── styles/
    │   ├── tokens.css               # Custom properties --mr-*, foco acessível, shimmer, reduced-motion e @media print
    │   └── global.css               # Tailwind v4, @view-transition, classes semânticas (.mr-*) e paginação
    ├── components/
    │   ├── Breadcrumb.astro         # Trilha de navegação (tons light e dark)
    │   ├── CategoryPillGrid.astro   # Grade de cards/pílulas das categorias
    │   ├── EmptyState.astro         # Estado vazio padronizado com CTAs e atalhos de categoria
    │   ├── FavoriteButton.astro     # Botão circular de favoritar (coração 40x40px)
    │   ├── FeaturedRecipeCard.astro # Card grande de receita em destaque com overlay escuro
    │   ├── Footer.astro             # Rodapé em duas faixas (laranja + branca com 4 colunas)
    │   ├── Header.astro             # Header fixo, dropdown de categorias, busca desktop, drawer mobile e modal de busca
    │   ├── HeroCarousel.astro       # Carrossel hero full-width com auto-play e barra de progresso
    │   ├── RecipeCard.astro         # Card padrão de receita (aspect 3:2, categoria, título, meta)
    │   └── ToastContainer.astro     # Contêiner aria-live para toasts
    └── pages/
        ├── index.astro              # Página inicial (/)
        ├── 404.astro                # Página não encontrada (/404)
        ├── busca.astro              # Busca dedicada (/busca?q=...)
        ├── favoritas.astro          # Receitas favoritas (/favoritas)
        ├── nova-receita.astro       # Gerador visual de .md + guia Antigravity (/nova-receita)
        ├── api/
        │   └── receitas.json.ts     # Endpoint estático JSON com índice de todas as receitas
        ├── categoria/
        │   └── [slug].astro         # Páginas estáticas por categoria (/categoria/<slug>)
        ├── receita/
        │   └── [id].astro           # Página de detalhes da receita (/receita/<id>)
        └── receitas/
            └── [...page].astro      # Catálogo paginado com filtros dinâmicos (/receitas e /receitas/2...)
```

---

## 4. Arquitetura de Dados e Content Collections

### 4.1 Collection `receitas` (`src/content.config.ts`)

- **Loader:** `glob({ base: './receitas', pattern: ['**/*.md', '!README.md', '!_*.md'] })`.
- **ID da receita:** Gerado automaticamente a partir do nome do arquivo sem extensão (ex.: `receitas/picanha-na-brasa-com-manteiga-de-alho.md` → `id: "picanha-na-brasa-com-manteiga-de-alho"` → rota `/receita/picanha-na-brasa-com-manteiga-de-alho`).

#### Schema Zod do Frontmatter YAML

| Campo | Tipo Zod | Obrigatório | Padrão / Comportamento |
| :--- | :--- | :---: | :--- |
| `titulo` | `z.string()` | Sim | Título exibido em cards, hero e `<title>` |
| `categoria` | `z.string()` | Não | `'geral'` (resolvido via `resolveCategory()`) |
| `resumo` | `z.string().optional()` | Não | Se omitido, gera excerto automático (até 140 chars) do corpo Markdown |
| `imagem` | `z.string().optional()` | Não | Se omitido, usa `categoria.bannerImage` |
| `imagemAlt` | `z.string().optional()` | Não | Se omitido, usa `"Fotografia da receita <titulo>"` |
| `porcoes` | `z.string().optional()` | Não | Ex.: `"6 porções"`, `"4 a 6 porções"` |
| `tempoPreparo` | `z.string().optional()` | Não | Ex.: `"45 min"`, `"1h 30min"` |
| `tempoMinutos` | `z.number().int().positive().optional()` | Não | Se omitido, inferido via `parseDurationMinutes(tempoPreparo)` |
| `dificuldade` | `z.enum(['Fácil', 'Médio', 'Difícil']).optional()` | Não | Badge exibido no hero da página de receita |
| `destaque` | `z.boolean()` | Não | `false`. Priorizado na ordenação, no HeroCarousel e no FeaturedRecipeCard |
| `publicadoEm` | `z.coerce.date().optional()` | Não | Data ISO `YYYY-MM-DD`, usada como 2º critério de ordenação |
| `tags` | `z.array(z.string())` | Não | `[]`. Usadas na busca e exibidas como links `#tag` na receita |
| `ingredientes` | `z.array(z.string()).optional()` | Não | Fallback caso o corpo Markdown não tenha seção `## Ingredientes` |
| `preparo` | `z.array(z.string()).optional()` | Não | Fallback caso o corpo Markdown não tenha seção `## Modo de preparo` |

### 4.2 Normalização, Ordenação e Extração de Seções (`src/lib/recipes.ts`)

- **`getAllRecipes()`**: Carrega toda a collection, normaliza cada entrada para `NormalizedRecipe` e ordena por:
  1. `destaque === true` primeiro;
  2. `publicadoEm` mais recente primeiro;
  3. `titulo` em ordem alfabética (`pt-BR`).
- **`parseDurationMinutes(tempo, explicit)`**: Extrai horas (`h`, `hr`, `horas`) e minutos (`m`, `min`, `minutos`) ou número puro de `tempoPreparo` quando `tempoMinutos` não é informado.
- **`splitRecipeSections(html)`**: Divide o HTML renderizado do Markdown nos títulos `<h2>` e classifica cada seção por `kind`:
  - `'ingredients'` — títulos contendo `"ingrediente"` → extrai `<li>` para renderizar como checklist interativo;
  - `'steps'` — títulos contendo `"preparo"`, `"passo"`, `"instruc"` ou `"modo de fazer"` → extrai `<li>` para renderizar como etapas numeradas interativas;
  - `'notes'` — demais seções (ex.: `## Dicas do Chef`) → renderizadas como bloco editorial `.mr-prose`.
- **`getAllCategoriesWithCounts(recipes)`**: Retorna as 9 categorias oficiais (mesmo com `count: 0`) somadas a eventuais categorias customizadas encontradas nos `.md`.

### 4.3 Categorias Oficiais e Aliases (`src/lib/categories.ts`)

| Slug | Rótulo | Cor Base | Cor AA (texto branco) | CSS Var AA | Banner Padrão (`/images/receitas/...`) |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `aves` | Aves | `#F35935` | `#C83E1D` | `--mr-cat-aves-aa` | `frango-assado-ervas.jpg` |
| `peixes-e-frutos-do-mar` | Peixes e Frutos do Mar | `#2C7AA8` | `#2C7AA8` | `--mr-cat-peixes-aa` | `moqueca-baiana.jpg` |
| `carne-suina` | Carne Suína | `#E72667` | `#B8144C` | `--mr-cat-suina-aa` | `costelinha-barbecue.jpg` |
| `bovinos` | Bovinos | `#E82A2C` | `#C41C1E` | `--mr-cat-bovinos-aa` | `picanha-na-brasa.jpg` |
| `cordeiro` | Cordeiro | `#A70030` | `#A70030` | `--mr-cat-cordeiro-aa` | `carre-cordeiro.jpg` |
| `frios-e-embutidos` | Frios e Embutidos | `#CE6933` | `#A84F1E` | `--mr-cat-frios-aa` | `tabua-frios.jpg` |
| `vegetal` | 100% Vegetal | `#A0B340` | `#5C6E18` | `--mr-cat-vegetal-aa` | `risoto-cogumelos.jpg` |
| `doces-bolos-e-sobremesas` | Doces, Bolos e Sobremesas | `#B352AF` | `#8E378B` | `--mr-cat-doces-aa` | `bolo-cenoura-brigadeiro.jpg` |
| `paes-e-massas` | Pães e Massas | `#946932` | `#7D5726` | `--mr-cat-paes-aa` | `focaccia-tomate-confit.jpg` |

- **Aliases (`CATEGORY_ALIASES`):** Variações como `frango`, `porco`, `churrasco`, `vegano`, `bolos`, `massas` são normalizadas automaticamente para o slug oficial correspondente.
- **Categorias customizadas:** Qualquer outro valor gera dinamicamente uma categoria com fallback terracota (`#CE5032` / `--mr-terracotta-hover`) e rota própria em `/categoria/<slug>`.

### 4.4 Índice Estático JSON (`/api/receitas.json`)

Gerado em build-time por `src/pages/api/receitas.json.ts`, retorna um array de `SearchRecipeItem` contendo:
`id`, `titulo`, `categoriaSlug`, `categoriaLabel`, `categoriaColorAA`, `resumo`, `imagem`, `porcoes`, `tempoPreparo`, `tempoMinutos`, `dificuldade`, `destaque`, `tags`, `plainBody` (truncado em 600 chars) e `url` (`/receita/<id>`).

É consumido com cache em memória (`loadSearchRecipes()` em `src/scripts/search.ts`) pelo autocomplete do Header, pela página `/busca`, pelos filtros de `/receitas` e pela listagem de `/favoritas`.

---

## 5. Mapa de Rotas e Funcionalidades por Página

### 5.1 Página Inicial — `/` (`src/pages/index.astro`)
1. **Carrossel Hero (`HeroCarousel`):** Exibe até 3 receitas (priorizando `destaque: true`). Possui troca automática a cada 6s, pausa no hover/focus, desativação automática quando `prefers-reduced-motion: reduce` está ativo e barra de navegação inferior de 3 colunas com indicador de progresso.
2. **Seção "Receitas para Cada Momento":** Grid responsivo destacando a principal receita (`FeaturedRecipeCard` ocupando `md:col-span-2`) ao lado de 4 `RecipeCard`, seguido do botão "Todas as receitas (N)".
3. **Seção "Navegue por categoria":** Exibe `CategoryPillGrid` com as 9 categorias oficiais.
4. **Seção "Prontas em até 45 minutos":** Filtra até 3 receitas com `tempoMinutos <= 45`.
5. **Bloco Editorial "Sem Banco de Dados":** Explica o fluxo de arquivos `.md` com exemplo de código e atalhos para `/nova-receita` e `/favoritas`.

### 5.2 Catálogo Paginado com Filtros — `/receitas` e `/receitas/[...page]` (`src/pages/receitas/[...page].astro`)
- **Paginação estática SSR:** 9 receitas por página (`paginate(allRecipes, { pageSize: 9 })`) com navegação circular (`.page-numbers`).
- **Barra de Filtros e Ordenação (client-side):**
  - Select de **Categoria** (todas ou uma das 9 oficiais);
  - Select de **Ordenação**: `Mais recentes` (ordem padrão do índice), `Menor tempo` (`tempoMinutos` asc) ou `Ordem alfabética (A–Z)`;
  - Toggle **"Apenas favoritas"** (lê `getFavoriteIds()` e reage em tempo real ao evento `mr:favorites-changed`);
  - **Chips de Tempo de Preparo**: `Todos`, `Até 30 min`, `30 a 60 min`, `Mais de 60 min`;
  - Botão **"Limpar filtros"** (exibido somente quando há filtro/ordenação ativo).
- **Estados de UI:** Alterna entre o grid SSR paginado (sem filtros), skeletons shimmer durante carregamento, grid dinâmico filtrado e empty state com botão de reset.

### 5.3 Página de Detalhes da Receita — `/receita/[id]` (`src/pages/receita/[id].astro`)
- **Hero Interno:** Fundo fotográfico escurecido (`--mr-overlay-hero`), `Breadcrumb` (dark), badge da categoria (cor AA), badge de dificuldade, `<h1>`, resumo e ícones de **Rendimento** e **Tempo de Preparo**.
- **Foto Principal:** Card `16:9` sobreposto ao hero (`-mt-8`) com `FavoriteButton` no canto superior direito.
- **Corpo Estruturado (2 colunas assimétricas `lg:grid-cols-[300px_1fr]`):**
  - **Checklist interativo de Ingredientes:** Checkboxes estilizados (`.mr-ingredient-checkbox`), contador dinâmico `"X de Y separados"`, texto riscado quando marcado, botão `"Limpar marcações"` (com toast) e persistência por receita em `localStorage` (`mr_checklist_<id>`).
  - **Passos interativos do Modo de Preparo:** Lista numerada clicável; clicar em um passo alterna o estado concluído (círculo verde `--mr-success-border`, `aria-pressed`) com persistência em `localStorage` (`mr_steps_<id>`).
  - **Seções Extras:** Renderiza automaticamente qualquer outro `## Título` (ex.: `## Dicas do Chef`) em `.mr-prose`.
  - **Fallback:** Se a receita não possuir listas estruturadas, renderiza `<Content />` completo dentro de `.mr-prose`.
- **Tags:** Links `#tag` que redirecionam para `/busca?q=<tag>`.
- **Barra de Ações e Avaliação:**
  - **Compartilhar no WhatsApp:** Atualiza o link `https://wa.me/?text=...` com título e URL atual da página.
  - **Copiar link:** Copia `window.location.href` para o clipboard com feedback via toast.
  - **Imprimir:** Chama `window.print()` (estilos `@media print` ocultam header, footer, toasts e elementos `.mr-no-print`, mantendo texto preto em fundo branco).
  - **Avaliação 5 estrelas local:** `radiogroup` de 1 a 5 estrelas salvo em `localStorage` (`mr_ratings_v1`), exibindo `"X/5 - (Sua avaliação)"` e disparando toast de confirmação.
- **Rodapé da Receita:** Link `"Ver mais: <Categoria> →"`, indicação do arquivo fonte `receitas/<id>.md` e seção **"Receitas relacionadas"** (3 cards priorizando a mesma categoria).

### 5.4 Página de Categoria — `/categoria/[slug]` (`src/pages/categoria/[slug].astro`)
- Gerada estaticamente para todas as 9 categorias oficiais e qualquer categoria customizada existente nos `.md`.
- **Hero temático:** Banner da categoria, breadcrumb, badge com cor AA, contagem de receitas, título e descrição.
- **Faixa de troca rápida:** Barra horizontal rolável (`.mr-warm-scroll`) com botão "Todas" e pílulas das 9 categorias (marcando a atual com `aria-current="page"`).
- **Grid de receitas** ou `EmptyState` com CTA direcionando para `/nova-receita?categoria=<slug>`.

### 5.5 Página de Busca — `/busca` (`src/pages/busca.astro`)
- Lê o parâmetro `?q=` da URL na inicialização e atualiza a URL via `window.history.replaceState` ao submeter o formulário sem recarregar a página.
- Se `q` estiver vazio, exibe todas as receitas disponíveis; caso contrário, aplica `searchRecipes()` e mostra contagem de resultados, skeletons durante carregamento ou empty state com atalhos de categorias populares.

### 5.6 Página de Favoritas — `/favoritas` (`src/pages/favoritas.astro`)
- Lê os IDs salvos em `mr_favorites_v1` e cruza com `/api/receitas.json`.
- Escuta `mr:favorites-changed` para remover o card imediatamente quando o usuário desfavorita uma receita na própria página.
- Possui botão **"Limpar favoritas"** (zera `mr_favorites_v1`, sincroniza UI e exibe toast) e `EmptyState` quando não há receitas salvas.

### 5.7 Nova Receita (`.md`) — `/nova-receita` (`src/pages/nova-receita.astro`)
Interface com 2 abas (acessar `/nova-receita#antigravity` abre diretamente a Aba 2):
- **Aba 1 — Gerador Visual de Arquivo `.md`:**
  - Formulário com validação inline (`aria-invalid`, `.is-valid`, `.mr-field-error` no blur e submit) para: Título*, Categoria (suporta pré-seleção via `?categoria=<slug>`), Dificuldade, Rendimento, Tempo de preparo, Resumo curto, Tags (separadas por vírgula), Ingredientes* (1 por linha) e Modo de preparo* (1 passo por linha).
  - **Pré-visualização ao vivo** (painel escuro sticky) mostrando o nome do arquivo slugificado (`receitas/<slug>.md`) e o conteúdo YAML + Markdown gerado em tempo real (com `publicadoEm` preenchido com a data atual e imagem padrão da categoria).
  - Ações: **"Baixar arquivo .md"** (download via `Blob` UTF-8) e **"Copiar Markdown"** (clipboard + toast).
- **Aba 2 — Criar pelo Chat do Antigravity:**
  - 3 cards de prompts prontos com botão **"Copiar prompt"** e tabela de referência rápida dos campos do frontmatter.

### 5.8 Página 404 — `/404` (`src/pages/404.astro`)
- Renderiza `EmptyState` informando que a receita/página não foi encontrada, com CTAs para `/` e `/receitas`.

---

## 6. Componentes Reutilizáveis (`src/components/` e `src/layouts/`)

| Componente | Props Principais | Responsabilidade |
| :--- | :--- | :--- |
| `BaseLayout.astro` | `title`, `description?` | Estrutura HTML (`lang="pt-BR"`), `<Font cssVariable="--font-outfit" preload />`, skip-link acessível, `Header`, `<main>`, `Footer`, `ToastContainer` e inicialização global de `initToastBridge()`, `initFavorites()` e `initHeaderSearch()`. |
| `Header.astro` | *(nenhuma)* | Cabeçalho fixo (`68px` mobile / `72px` desktop) em `#C73E00`, dropdown de categorias (hover/focus/teclado + `Escape`), busca inline desktop com autocomplete e backdrop escuro, botão de busca mobile abrindo modal fullscreen, link de Favoritas com badge dinâmico `[data-fav-count]` e drawer mobile (`#header-mobile-menu`). |
| `Footer.astro` | *(nenhuma)* | Faixa superior laranja com atalhos e CTA "+ Criar receita .md"; faixa inferior branca com card editorial `.footer__alert` ("Zero Banco de Dados") e 4 colunas de links (Carnes & Peixes, Mais Sabores, Explorar, Gerenciar `.md`). |
| `HeroCarousel.astro` | `recipes: NormalizedRecipe[]` | Carrossel hero (`500px`/`700px`) com até 3 slides, transição por opacidade, auto-play de 6s e barra de paginação inferior interativa. |
| `FeaturedRecipeCard.astro` | `recipe`, `className?` | Card de destaque `16:9` com foto full-bleed, gradiente `--mr-overlay-card`, pílula de categoria branca, título branco, metadados e `FavoriteButton`. |
| `RecipeCard.astro` | `recipe`, `className?` | Card padrão com foto `3:2` (zoom `scale-110` no hover), `FavoriteButton`, link de categoria em terracota, título `line-clamp-3` e metadados (`porcoes • tempoPreparo`). |
| `CategoryPillGrid.astro` | `categories` | Grade 1/2/3 colunas com banner fotográfico `5:1` e pílula sobreposta com a cor AA da categoria. |
| `FavoriteButton.astro` | `recipe`, `className?` | Botão `.emr-favorite-btn` com `data-recipe-id` e `data-recipe-title`, gerenciado globalmente por delegação de eventos em `favorites.ts`. |
| `Breadcrumb.astro` | `items: BreadcrumbItem[]`, `tone?: 'light' \| 'dark'` | Navegação estrutural acessível (`aria-label="Breadcrumb"`, `aria-current="page"`). |
| `EmptyState.astro` | `title`, `description`, `ctaLabel?`, `ctaHref?`, `secondaryLabel?`, `secondaryHref?`, `showQuickCategories?` | Bloco centralizado de estado vazio com ícone de lupa, botões primário/secundário e atalho para 6 categorias. |
| `ToastContainer.astro` | *(nenhuma)* | Div `#mr-toast-container` (`aria-live="polite"`) posicionada no canto inferior direito (desktop) ou largura total inferior (mobile). |

---

## 7. Scripts Client-Side, Estado Local e Eventos

Todos os scripts globais são inicializados uma vez em `src/layouts/BaseLayout.astro`.

### 7.1 Chaves de `localStorage`

| Chave | Formato | Onde é usada | Descrição |
| :--- | :--- | :--- | :--- |
| `mr_favorites_v1` | `string[]` (JSON de IDs) | `favorites.ts`, `favoritas.astro`, `[...page].astro` | Lista de IDs das receitas favoritadas pelo usuário |
| `mr_checklist_<id>` | `number[]` (JSON de índices) | `receita/[id].astro` | Índices dos ingredientes marcados no checklist da receita |
| `mr_steps_<id>` | `number[]` (JSON de índices) | `receita/[id].astro` | Índices dos passos concluídos no modo de preparo |
| `mr_ratings_v1` | `Record<string, number>` | `receita/[id].astro` | Mapa `{ [recipeId]: nota (1..5) }` das avaliações locais |

### 7.2 Eventos Customizados e Bridges Globais

- **`mr:favorites-changed`** (`document`): Disparado em `toggleFavorite()` e no listener `window.storage` (sincronização entre abas). `detail`: `{ ids: string[], id?: string, added?: boolean }`. Escutado por `favoritas.astro` e `receitas/[...page].astro`.
- **`mr:toast`** (`document`) e **`window.mrShowToast`**: Permitem disparar notificações toast a partir de qualquer script da aplicação (`{ type?: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number }`).

### 7.3 Algoritmo de Busca (`src/scripts/search.ts`)

- Normalização com `normalize('NFD')` removendo diacríticos/acentos e convertendo para minúsculas.
- Busca **AND multi-termo**: todos os termos digitados precisam existir no conjunto `titulo + categoriaLabel + tags + resumo + plainBody`.
- **Ranqueamento por relevância:**
  - `+100` se a query completa está no título;
  - `+40` se a query completa está na categoria;
  - `+30` se a query completa está nas tags;
  - `+20` por cada termo individual encontrado no título.
- **Autocomplete Desktop:** Exibe até 8 resultados + link `"Ver mais resultados para ... (N)"`, suporta setas `ArrowDown`/`ArrowUp`, `Enter` e `Escape`.
- **Modal Mobile:** Aberto pelo botão `#header-search-bar`, trava scroll do body (`overflow-hidden`), exibe resultados ao vivo e fecha com botão ou `Escape`.

### 7.4 Sistema de Toasts (`src/scripts/toast.ts`)

- Limite máximo de **3 toasts simultâneos** (remove o mais antigo ao exceder).
- Durações padrão: `success` / `info` = `4000ms`, `warning` = `5000ms`, `error` = `6000ms`.
- Pausa o temporizador automaticamente em `mouseenter` e `focusin`, retomando o tempo restante em `mouseleave` e `focusout`.
- Acessibilidade: `error`/`warning` usam `role="alert"` + `aria-live="assertive"`; `success`/`info` usam `role="status"` + `aria-live="polite"`.

---

## 8. Design System, Estilização e Acessibilidade

Para detalhes visuais completos, consulte sempre `docs/DESIGN.md` e `docs/DESIGN_SYSTEM.md`.

### Regras Essenciais de Estilo
- **Namespace exclusivo `--mr-*`:** Todos os tokens vivem em `src/styles/tokens.css`. Nunca importar ou criar tokens legados `--eko-*`.
- **Contraste WCAG AA (`>= 4.5:1` texto normal):**
  - Header/Footer usam `#C73E00` (`--mr-brand-orange-aa`) para texto branco;
  - Botões pílula e links de categoria usam `#B03D1F` (`--mr-terracotta-hover`) com hover `#963218` (`--mr-terracotta-active`);
  - Pílulas/badges de categoria usam sempre `var(--mr-cat-*-aa)` para garantir legibilidade com texto branco.
- **Classes semânticas globais (`src/styles/global.css`):**
  - Tipografia: `.mr-display-h1`, `.mr-section-title`, `.mr-card-featured__title`, `.mr-category-pill__label`, `.mr-prose`;
  - Botões: `.mr-btn-pill`, `.mr-btn-pill--outline`, `.emr-favorite-btn`, `.page-numbers`;
  - Formulários: `.mr-label`, `.mr-input`, `.mr-select`, `.mr-textarea`, `.mr-field-error`;
  - Utilitários: `.mr-skeleton`, `.mr-warm-scroll`, `.mr-surface-dark`, `.mr-no-print`.
- **View Transitions:** Habilitadas nativamente via `@view-transition { navigation: auto; }`.
- **Acessibilidade embutida:**
  - Skip-link `"Pular para o conteúdo principal"` no `BaseLayout`;
  - Foco visível global via `:focus-visible` (terracota em superfícies claras, branco em `.mr-surface-dark` e `.mr-header`);
  - Respeito a `@media (prefers-reduced-motion: reduce)` no CSS e no `HeroCarousel`;
  - Suporte completo a impressão (`@media print`) na página de receita.

---

## 9. Automação de Conteúdo (Skill `gerar-receita`)

O projeto possui a skill local `.agents/skills/gerar-receita/SKILL.md` (com template em `resources/modelo-receita.md`), usada automaticamente quando se solicita a criação de uma nova receita via chat:

1. Gera o slug em `kebab-case` sem acentos em `receitas/<slug>.md`;
2. Preenche o frontmatter YAML compatível com `src/content.config.ts`;
3. Estrutura o corpo com `## Ingredientes`, `## Modo de preparo` e `## Dicas do Chef`;
4. Opcionalmente gera imagem `16:9` em `public/images/receitas/<slug>.jpg` ou reutiliza uma imagem existente;
5. Valida o schema executando `npx astro sync`.

---

## 10. Guia Rápido para Novas Implementações

Use esta matriz para saber exatamente onde alterar ao planejar novas features:

| Tipo de Implementação | Arquivos Principais a Alterar / Consultar |
| :--- | :--- |
| **Adicionar novo campo na receita** (ex.: `calorias`, `autor`, `videoUrl`) | 1. `src/content.config.ts` (schema Zod)<br>2. `src/lib/recipes.ts` (`NormalizedRecipe` e `normalizeRecipe`)<br>3. `src/pages/api/receitas.json.ts` + `src/scripts/search.ts` (`SearchRecipeItem`, se usado em filtros/busca)<br>4. `src/pages/receita/[id].astro` (exibição)<br>5. `src/pages/nova-receita.astro` e `receitas/_MODELO.md` (opcional) |
| **Adicionar nova categoria oficial** | 1. `src/styles/tokens.css` (`--mr-cat-*` e `--mr-cat-*-aa`)<br>2. `src/lib/categories.ts` (`OFFICIAL_CATEGORIES` e `CATEGORY_ALIASES`)<br>3. `src/pages/nova-receita.astro` (`CATEGORY_DEFAULT_IMAGES`) |
| **Criar novo filtro ou ordenação no catálogo** | `src/pages/receitas/[...page].astro` (UI + script) e, se precisar de novos dados no cliente, `src/pages/api/receitas.json.ts` |
| **Adicionar nova interação client-side global** | Criar módulo em `src/scripts/` e inicializar em `src/layouts/BaseLayout.astro` |
| **Criar nova página** | Adicionar arquivo em `src/pages/`, envolver com `BaseLayout.astro`, incluir `Breadcrumb.astro` e atualizar links em `Header.astro` / `Footer.astro` se necessário |
| **Alterar visual do card de receita** | Atualizar `src/components/RecipeCard.astro` **e** também o HTML string `renderCard` / `renderCardHtml` nos scripts client-side de `src/pages/receitas/[...page].astro`, `src/pages/busca.astro` e `src/pages/favoritas.astro` |

### Pontos de Atenção / Limitações Conhecidas
1. **Site 100% estático (sem backend):** Não existe autenticação, banco de dados nem escrita direta em disco a partir do browser. Toda persistência de usuário (favoritos, notas, checklists) fica restrita ao `localStorage` do navegador atual.
2. **Cards renderizados em 2 lugares:** Cards SSR usam `src/components/RecipeCard.astro`, enquanto grids dinâmicos client-side (`receitas/[...page].astro`, `busca.astro`, `favoritas.astro`) montam o HTML via template string em TypeScript. Ao alterar o markup do card, lembre-se de manter ambos sincronizados (ou extrair um helper compartilhado em `src/scripts/`).
3. **Validação após mudanças:** Sempre rodar `npx astro sync` e `npm run check` (ou `npm run build`) após alterar schemas, receitas ou componentes TypeScript.
