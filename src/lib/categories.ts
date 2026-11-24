export interface CategoryInfo {
  slug: string;
  label: string;
  description: string;
  color: string;
  colorAA: string;
  cssVarAA: string;
  bannerImage: string;
}

export const OFFICIAL_CATEGORIES: CategoryInfo[] = [
  {
    slug: 'aves',
    label: 'Aves',
    description: 'Assados suculentos, cortes grelhados e receitas práticas com frango e peru.',
    color: '#F35935',
    colorAA: '#C83E1D',
    cssVarAA: '--mr-cat-aves-aa',
    bannerImage: '/images/receitas/frango-assado-ervas.jpg',
  },
  {
    slug: 'peixes-e-frutos-do-mar',
    label: 'Peixes e Frutos do Mar',
    description: 'Moquecas aromáticas, filés grelhados e preparos leves com sabor do mar.',
    color: '#2C7AA8',
    colorAA: '#2C7AA8',
    cssVarAA: '--mr-cat-peixes-aa',
    bannerImage: '/images/receitas/moqueca-baiana.jpg',
  },
  {
    slug: 'carne-suina',
    label: 'Carne Suína',
    description: 'Costelinhas caramelizadas, lombos suculentos e cortes especiais na brasa ou forno.',
    color: '#E72667',
    colorAA: '#B8144C',
    cssVarAA: '--mr-cat-suina-aa',
    bannerImage: '/images/receitas/costelinha-barbecue.jpg',
  },
  {
    slug: 'bovinos',
    label: 'Bovinos',
    description: 'Cortes de churrasco na brasa, assados de domingo e pratos clássicos do dia a dia.',
    color: '#E82A2C',
    colorAA: '#C41C1E',
    cssVarAA: '--mr-cat-bovinos-aa',
    bannerImage: '/images/receitas/picanha-na-brasa.jpg',
  },
  {
    slug: 'cordeiro',
    label: 'Cordeiro',
    description: 'Carrés aromáticos, pernis assados lentamente e harmonizações com ervas frescas.',
    color: '#A70030',
    colorAA: '#A70030',
    cssVarAA: '--mr-cat-cordeiro-aa',
    bannerImage: '/images/receitas/carre-cordeiro.jpg',
  },
  {
    slug: 'frios-e-embutidos',
    label: 'Frios e Embutidos',
    description: 'Tábuas rústicas, sanduíches artesanais e petiscos rápidos para receber bem.',
    color: '#CE6933',
    colorAA: '#A84F1E',
    cssVarAA: '--mr-cat-frios-aa',
    bannerImage: '/images/receitas/tabua-frios.jpg',
  },
  {
    slug: 'vegetal',
    label: '100% Vegetal',
    description: 'Risotos cremosos, assados coloridos e receitas 100% à base de plantas.',
    color: '#A0B340',
    colorAA: '#5C6E18',
    cssVarAA: '--mr-cat-vegetal-aa',
    bannerImage: '/images/receitas/risoto-cogumelos.jpg',
  },
  {
    slug: 'doces-bolos-e-sobremesas',
    label: 'Doces, Bolos e Sobremesas',
    description: 'Bolos fofinhos de família, coberturas brilhantes e sobremesas irresistíveis.',
    color: '#B352AF',
    colorAA: '#8E378B',
    cssVarAA: '--mr-cat-doces-aa',
    bannerImage: '/images/receitas/bolo-cenoura-brigadeiro.jpg',
  },
  {
    slug: 'paes-e-massas',
    label: 'Pães e Massas',
    description: 'Focaccias aeradas, pães de fermentação lenta e massas artesanais caseiras.',
    color: '#946932',
    colorAA: '#7D5726',
    cssVarAA: '--mr-cat-paes-aa',
    bannerImage: '/images/receitas/focaccia-tomate-confit.jpg',
  },
];

const SLUG_TO_CATEGORY = new Map(OFFICIAL_CATEGORIES.map((cat) => [cat.slug, cat]));

const CATEGORY_ALIASES: Record<string, string> = {
  aves: 'aves',
  frango: 'aves',
  peru: 'aves',
  peixes: 'peixes-e-frutos-do-mar',
  'peixes e frutos do mar': 'peixes-e-frutos-do-mar',
  'frutos do mar': 'peixes-e-frutos-do-mar',
  'peixes-e-frutos-do-mar': 'peixes-e-frutos-do-mar',
  suina: 'carne-suina',
  suino: 'carne-suina',
  'carne suina': 'carne-suina',
  'carne-suina': 'carne-suina',
  porco: 'carne-suina',
  bovinos: 'bovinos',
  bovina: 'bovinos',
  carne: 'bovinos',
  churrasco: 'bovinos',
  cordeiro: 'cordeiro',
  frios: 'frios-e-embutidos',
  embutidos: 'frios-e-embutidos',
  'frios e embutidos': 'frios-e-embutidos',
  'frios-e-embutidos': 'frios-e-embutidos',
  vegetal: 'vegetal',
  '100 vegetal': 'vegetal',
  '100% vegetal': 'vegetal',
  vegano: 'vegetal',
  vegana: 'vegetal',
  vegetariana: 'vegetal',
  doces: 'doces-bolos-e-sobremesas',
  bolos: 'doces-bolos-e-sobremesas',
  sobremesas: 'doces-bolos-e-sobremesas',
  'doces bolos e sobremesas': 'doces-bolos-e-sobremesas',
  'doces, bolos e sobremesas': 'doces-bolos-e-sobremesas',
  'doces-bolos-e-sobremesas': 'doces-bolos-e-sobremesas',
  paes: 'paes-e-massas',
  massas: 'paes-e-massas',
  'paes e massas': 'paes-e-massas',
  'paes-e-massas': 'paes-e-massas',
};

export function normalizeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/%/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function resolveCategory(raw: string | undefined): CategoryInfo {
  const input = (raw ?? 'geral').trim();
  const normalizedSpace = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[,%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const normalizedSlug = normalizeSlug(input);
  const matchedSlug =
    CATEGORY_ALIASES[normalizedSpace] ??
    CATEGORY_ALIASES[normalizedSlug] ??
    (SLUG_TO_CATEGORY.has(normalizedSlug) ? normalizedSlug : undefined);

  if (matchedSlug && SLUG_TO_CATEGORY.has(matchedSlug)) {
    return SLUG_TO_CATEGORY.get(matchedSlug)!;
  }

  const label = input.length > 0 ? input : 'Geral';
  const slug = normalizedSlug || 'geral';

  return {
    slug,
    label,
    description: `Receitas especiais da categoria ${label}.`,
    color: '#CE5032',
    colorAA: '#B03D1F',
    cssVarAA: '--mr-terracotta-hover',
    bannerImage: '/images/receitas/frango-assado-ervas.jpg',
  };
}
