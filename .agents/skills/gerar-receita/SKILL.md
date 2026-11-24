---
name: gerar-receita
description: >-
  Cria novos arquivos de receita em Markdown (.md) na pasta receitas/ do aplicativo
  Astro Minha Receita, seguindo exatamente o modelo, o frontmatter YAML e as seções
  padronizadas do projeto. Use esta skill sempre que o usuário pedir para criar,
  gerar ou adicionar uma nova receita.
---

# Gerar Receita (`.md`)

Gera um novo arquivo Markdown de receita em `receitas/<slug>.md` compatível com a Content Collection `receitas` definida em `src/content.config.ts`, baseado no modelo em [modelo-receita.md](./resources/modelo-receita.md).

## Passos

1. **Definir o nome do arquivo (`slug`):**
   - Converta o título da receita para `kebab-case` em letras minúsculas, sem acentos, sem caracteres especiais e com extensão `.md`.
   - Salve sempre em `receitas/<slug>.md` (ex.: `receitas/pudim-de-leite-condensado.md`).

2. **Preencher o Frontmatter YAML (obrigatório seguir os tipos de `src/content.config.ts`):**
   - `titulo` *(string, obrigatório)*: título editorial da receita entre aspas.
   - `categoria` *(string)*: prefira um dos 9 slugs oficiais do projeto:
     - `aves`
     - `peixes-e-frutos-do-mar`
     - `carne-suina`
     - `bovinos`
     - `cordeiro`
     - `frios-e-embutidos`
     - `vegetal`
     - `doces-bolos-e-sobremesas`
     - `paes-e-massas`
   - `resumo` *(string)*: frase curta e apetitosa em 1–2 linhas.
   - `imagem` *(string)*: caminho em `/images/receitas/<slug>.jpg` (se gerar/salvar uma foto nova) ou a imagem padrão da categoria já existente em `public/images/receitas/`.
     - Se o usuário pedir foto própria ou não fornecer imagem, gere uma fotografia culinária editorial 16:9 com `image-generator` e copie para `public/images/receitas/<slug>.jpg`; caso prefira agilidade sem gerar imagem, reutilize uma imagem compatível em `public/images/receitas/` ou omita o campo (o app aplica o banner da categoria automaticamente).
   - `imagemAlt` *(string)*: descrição acessível da fotografia do prato.
   - `porcoes` *(string)*: ex.: `"8 porções"` ou `"4 a 6 porções"`.
   - `tempoPreparo` *(string)*: ex.: `"55 min"` ou `"1h 20min"`.
   - `tempoMinutos` *(número inteiro positivo)*: tempo total em minutos (ex.: `55`, `80`).
   - `dificuldade` *(enum)*: exatamente `"Fácil"`, `"Médio"` ou `"Difícil"`.
   - `destaque` *(booleano)*: `false` por padrão (use `true` somente se o usuário pedir para destacar na Home/Hero).
   - `publicadoEm` *(data ISO)*: data atual no formato `YYYY-MM-DD` (sem aspas).
   - `tags` *(lista YAML)*: 3 a 5 palavras-chave em minúsculas.

3. **Estruturar o corpo Markdown seguindo o modelo:**
   Consulte [modelo-receita.md](./resources/modelo-receita.md) para a formatação exata:
   - `## Ingredientes`: lista não ordenada (`- item`) com quantidades claras em medidas brasileiras (xícaras, colheres, gramas/ml). Cada item vira um checkbox interativo na página.
   - `## Modo de preparo`: lista numerada (`1. passo`) clara, sequencial e objetiva. Cada passo vira uma etapa interativa na página.
   - `## Dicas do Chef`: 2 ou 3 dicas práticas em lista (`- dica`) sobre ponto, substituição ou conservação.

4. **Validar a receita gerada:**
   - Execute `npx astro sync` na raiz do projeto para validar o frontmatter contra o schema Zod de `src/content.config.ts`.
   - Se o comando reportar erro de schema, corrija o frontmatter antes de concluir.
   - Informe ao usuário o caminho clicável do arquivo criado e a rota resultante (`/receita/<slug>`).
