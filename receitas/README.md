# Pasta de Receitas (`.md`)

Todas as receitas do aplicativo **Minha Receita** vivem diretamente nesta pasta (`receitas/`) em arquivos Markdown (`.md`). Não há banco de dados.

Ao salvar um novo arquivo `.md` aqui (manualmente ou pedindo pelo chat do Antigravity):
- Em modo desenvolvimento (`npm run dev`), o Astro recarrega a coleção automaticamente.
- Em produção (`npm run build`), o site gera páginas estáticas e atualiza a busca (`/api/receitas.json`).

---

## Como adicionar uma nova receita

1. **Manualmente:** duplique `_MODELO.md`, renomeie usando letras minúsculas e hífens (ex.: `strogonoff-de-frango.md`) e edite os campos. Você também pode gerar o `.md` pronto pela página `/nova-receita` no aplicativo!
2. **Pelo chat do Antigravity:** peça em linguagem natural:
   - *"Crie uma receita de lasanha à bolonhesa na pasta `receitas/` com tempo de preparo de 55 min."*
   - *"Adicione uma receita 100% vegetal de moqueca de banana-da-terra em `receitas/`."*

---

## Campos do Frontmatter (YAML)

| Campo | Obrigatório | Descrição / Exemplo |
| :--- | :--- | :--- |
| `titulo` | Sim | Nome da receita (ex.: `"Frango Assado com Ervas e Limão Siciliano"`) |
| `categoria` | Não (padrão `geral`) | Veja categorias oficiais abaixo |
| `resumo` | Não | Frase curta exibida no hero e na listagem |
| `imagem` | Não | Caminho em `/images/receitas/arquivo.jpg` ou URL `https://...` |
| `imagemAlt` | Não | Descrição da foto para acessibilidade |
| `porcoes` | Não | Ex.: `"6 porções"` ou `"4 a 6 porções"` |
| `tempoPreparo` | Não | Ex.: `"45 min"` ou `"1h 30min"` |
| `tempoMinutos` | Não | Número inteiro em minutos (usado para filtros e ordenação; inferido automaticamente de `tempoPreparo` se omitido) |
| `dificuldade` | Não | `"Fácil"`, `"Médio"` ou `"Difícil"` |
| `destaque` | Não | `true` para destacar na Home e no Carrossel Hero |
| `publicadoEm` | Não | Data ISO `YYYY-MM-DD` (ex.: `2026-11-22`) |
| `tags` | Não | Lista YAML de palavras-chave (ex.: `["forno", "almoço"]`) |

### Categorias Oficiais

- `aves` (`Aves`)
- `peixes-e-frutos-do-mar` (`Peixes e Frutos do Mar`)
- `carne-suina` (`Carne Suína`)
- `bovinos` (`Bovinos`)
- `cordeiro` (`Cordeiro`)
- `frios-e-embutidos` (`Frios e Embutidos`)
- `vegetal` (`100% Vegetal`)
- `doces-bolos-e-sobremesas` (`Doces, Bolos e Sobremesas`)
- `paes-e-massas` (`Pães e Massas`)

> Qualquer categoria personalizada também funciona e recebe página própria automaticamente em `/categoria/<slug>/`.

---

## Estrutura recomendada do corpo Markdown

Use títulos `##` para organizar a receita na página de detalhes:

- `## Ingredientes` — listas (`- item`) viram checkboxes interativos na página.
- `## Modo de preparo` — listas numeradas (`1. passo`) viram etapas interativas.
- `## Dicas do Chef` *(opcional)* — notas extras, acompanhamentos ou conservação.
