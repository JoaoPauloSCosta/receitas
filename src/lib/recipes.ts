import { getCollection, type CollectionEntry } from 'astro:content';
import { OFFICIAL_CATEGORIES, resolveCategory, type CategoryInfo } from './categories';

export type RecipeEntry = CollectionEntry<'receitas'>;

export interface NormalizedRecipe {
  id: string;
  titulo: string;
  categoria: CategoryInfo;
  resumo: string;
  imagem: string;
  imagemAlt: string;
  porcoes?: string;
  tempoPreparo?: string;
  tempoMinutos: number | null;
  dificuldade?: 'Fácil' | 'Médio' | 'Difícil';
  destaque: boolean;
  publicadoEm: Date | null;
  tags: string[];
  metaItems: string[];
  plainBody: string;
  entry: RecipeEntry;
}

export interface RecipeSection {
  id: string;
  title: string;
  kind: 'ingredients' | 'steps' | 'notes';
  html: string;
  items: string[];
}

export function normalizeText(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function parseDurationMinutes(tempo?: string, explicit?: number): number | null {
  if (typeof explicit === 'number' && Number.isFinite(explicit) && explicit > 0) {
    return explicit;
  }
  if (!tempo) return null;

  const clean = normalizeText(tempo);
  let total = 0;

  const hourMatch = clean.match(/(\d+)\s*(h|hr|hrs|hora|horas)/);
  if (hourMatch) {
    total += Number.parseInt(hourMatch[1], 10) * 60;
  }

  const minMatch = clean.match(/(\d+)\s*(m|min|mins|minuto|minutos)/);
  if (minMatch) {
    total += Number.parseInt(minMatch[1], 10);
  }

  if (total === 0) {
    const bareNumber = clean.match(/^(\d+)$/);
    if (bareNumber) {
      total = Number.parseInt(bareNumber[1], 10);
    }
  }

  return total > 0 ? total : null;
}

export function formatMeta(porcoes?: string, tempoPreparo?: string): string[] {
  const items: string[] = [];
  if (porcoes && porcoes.trim().length > 0) {
    items.push(porcoes.trim());
  }
  if (tempoPreparo && tempoPreparo.trim().length > 0) {
    items.push(tempoPreparo.trim());
  }
  return items;
}

function stripMarkdown(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`~>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function createExcerpt(entry: RecipeEntry): string {
  if (entry.data.resumo && entry.data.resumo.trim().length > 0) {
    return entry.data.resumo.trim();
  }
  const plain = stripMarkdown(entry.body ?? '');
  if (!plain) return 'Receita prática armazenada em Markdown na coleção local.';
  return plain.length > 140 ? `${plain.slice(0, 137).trim()}...` : plain;
}

export function normalizeRecipe(entry: RecipeEntry): NormalizedRecipe {
  const categoria = resolveCategory(entry.data.categoria);
  const imagem = entry.data.imagem?.trim() || categoria.bannerImage;
  const imagemAlt = entry.data.imagemAlt?.trim() || `Fotografia da receita ${entry.data.titulo}`;
  const tempoMinutos = parseDurationMinutes(entry.data.tempoPreparo, entry.data.tempoMinutos);
  const metaItems = formatMeta(entry.data.porcoes, entry.data.tempoPreparo);

  return {
    id: entry.id,
    titulo: entry.data.titulo,
    categoria,
    resumo: createExcerpt(entry),
    imagem,
    imagemAlt,
    porcoes: entry.data.porcoes?.trim() || undefined,
    tempoPreparo: entry.data.tempoPreparo?.trim() || undefined,
    tempoMinutos,
    dificuldade: entry.data.dificuldade,
    destaque: Boolean(entry.data.destaque),
    publicadoEm: entry.data.publicadoEm ?? null,
    tags: entry.data.tags ?? [],
    metaItems,
    plainBody: stripMarkdown(entry.body ?? ''),
    entry,
  };
}

export async function getAllRecipes(): Promise<NormalizedRecipe[]> {
  const entries = await getCollection('receitas');
  return entries
    .map(normalizeRecipe)
    .sort((a, b) => {
      if (a.destaque !== b.destaque) {
        return a.destaque ? -1 : 1;
      }
      const timeA = a.publicadoEm ? a.publicadoEm.getTime() : 0;
      const timeB = b.publicadoEm ? b.publicadoEm.getTime() : 0;
      if (timeA !== timeB) {
        return timeB - timeA;
      }
      return a.titulo.localeCompare(b.titulo, 'pt-BR');
    });
}

export async function getAllCategoriesWithCounts(recipes: NormalizedRecipe[]): Promise<Array<CategoryInfo & { count: number }>> {
  const map = new Map<string, CategoryInfo & { count: number }>();

  for (const cat of OFFICIAL_CATEGORIES) {
    map.set(cat.slug, { ...cat, count: 0 });
  }

  for (const recipe of recipes) {
    const existing = map.get(recipe.categoria.slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(recipe.categoria.slug, { ...recipe.categoria, count: 1 });
    }
  }

  return Array.from(map.values());
}

function classifySectionKind(title: string): 'ingredients' | 'steps' | 'notes' {
  const normalized = normalizeText(title);
  if (normalized.includes('ingrediente')) return 'ingredients';
  if (
    normalized.includes('preparo') ||
    normalized.includes('passo') ||
    normalized.includes('instruc') ||
    normalized.includes('modo de fazer')
  ) {
    return 'steps';
  }
  return 'notes';
}

function extractListItems(sectionHtml: string): string[] {
  const items: string[] = [];
  const liRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = liRegex.exec(sectionHtml)) !== null) {
    const inner = match[1].replace(/^<p>([\s\S]*)<\/p>$/i, '$1').trim();
    if (inner) items.push(inner);
  }
  return items;
}

export function splitRecipeSections(html: string): {
  introHtml: string;
  sections: RecipeSection[];
} {
  const trimmed = (html ?? '').trim();
  if (!trimmed) {
    return { introHtml: '', sections: [] };
  }

  const h2Regex = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const matches: Array<{ index: number; end: number; titleHtml: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = h2Regex.exec(trimmed)) !== null) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      titleHtml: m[1].replace(/<[^>]+>/g, '').trim(),
    });
  }

  if (matches.length === 0) {
    return { introHtml: trimmed, sections: [] };
  }

  const introHtml = trimmed.slice(0, matches[0].index).trim();
  const sections: RecipeSection[] = matches.map((curr, idx) => {
    const nextStart = idx + 1 < matches.length ? matches[idx + 1].index : trimmed.length;
    const sectionHtml = trimmed.slice(curr.end, nextStart).trim();
    const kind = classifySectionKind(curr.titleHtml);
    return {
      id: `sec-${idx}-${normalizeText(curr.titleHtml).replace(/[^a-z0-9]+/g, '-')}`,
      title: curr.titleHtml,
      kind,
      html: sectionHtml,
      items: kind === 'notes' ? [] : extractListItems(sectionHtml),
    };
  });

  return { introHtml, sections };
}
