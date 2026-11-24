export interface SearchRecipeItem {
  id: string;
  titulo: string;
  categoriaSlug: string;
  categoriaLabel: string;
  categoriaColorAA: string;
  resumo: string;
  imagem: string;
  porcoes?: string;
  tempoPreparo?: string;
  tempoMinutos: number | null;
  dificuldade?: string;
  destaque: boolean;
  tags: string[];
  plainBody: string;
  url: string;
}

let cachedRecipes: SearchRecipeItem[] | null = null;
let fetchPromise: Promise<SearchRecipeItem[]> | null = null;

export function normalizeQuery(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export async function loadSearchRecipes(): Promise<SearchRecipeItem[]> {
  if (cachedRecipes) return cachedRecipes;
  if (!fetchPromise) {
    fetchPromise = fetch('/api/receitas.json')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar receitas');
        return res.json() as Promise<SearchRecipeItem[]>;
      })
      .then((data) => {
        cachedRecipes = Array.isArray(data) ? data : [];
        return cachedRecipes;
      })
      .catch(() => {
        fetchPromise = null;
        return [];
      });
  }
  return fetchPromise;
}

export function searchRecipes(items: SearchRecipeItem[], rawQuery: string): SearchRecipeItem[] {
  const q = normalizeQuery(rawQuery);
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      const titleNorm = normalizeQuery(item.titulo);
      const catNorm = normalizeQuery(item.categoriaLabel);
      const tagsNorm = normalizeQuery(item.tags.join(' '));
      const bodyNorm = normalizeQuery(`${item.resumo} ${item.plainBody}`);
      const haystack = `${titleNorm} ${catNorm} ${tagsNorm} ${bodyNorm}`;

      const matchesAll = terms.every((term) => haystack.includes(term));
      if (!matchesAll) return null;

      let score = 0;
      if (titleNorm.includes(q)) score += 100;
      if (catNorm.includes(q)) score += 40;
      if (tagsNorm.includes(q)) score += 30;
      for (const term of terms) {
        if (titleNorm.includes(term)) score += 20;
      }
      return { item, score };
    })
    .filter((x): x is { item: SearchRecipeItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderResultsMarkup(results: SearchRecipeItem[], query: string): string {
  const trimmed = query.trim();
  if (!trimmed) {
    return '';
  }

  if (results.length === 0) {
    return `
      <div class="results-error bg-[#FAF5F3] px-6 py-4 rounded-b-3xl text-[#1F1F1F]">
        <p class="font-bold text-base m-0">Nenhum resultado para o(s) termo(s) pesquisado(s).</p>
        <p class="text-sm text-[#666666] mt-1">
          Tente buscar por outro ingrediente ou <a href="/receitas" class="font-bold text-[#B03D1F] underline">explore todas as receitas</a>.
        </p>
      </div>
    `;
  }

  const limited = results.slice(0, 8);
  const rows = limited
    .map((item, idx) => {
      const meta = [item.porcoes, item.tempoPreparo].filter(Boolean).join(' • ');
      return `
        <a
          href="${escapeHtml(item.url)}"
          role="option"
          data-search-index="${idx}"
          class="mr-search-option flex items-center gap-3 px-4 py-2.5 min-h-[50px] text-sm font-bold text-[#3F3E3D] hover:bg-[#C73E00] hover:text-white focus-visible:bg-[#C73E00] focus-visible:text-white transition-colors border-b border-[#E5E7EB]/60 last:border-b-0 no-underline"
        >
          <img
            src="${escapeHtml(item.imagem)}"
            alt=""
            class="w-10 h-10 rounded-md object-cover shrink-0 bg-[#F3F4F6]"
            loading="lazy"
          />
          <div class="min-w-0 flex-1">
            <div class="truncate font-bold">${escapeHtml(item.titulo)}</div>
            <div class="text-xs font-medium opacity-80 truncate">${escapeHtml(item.categoriaLabel)}${meta ? ` • ${escapeHtml(meta)}` : ''}</div>
          </div>
        </a>
      `;
    })
    .join('');

  const seeAll = `
    <a
      href="/busca?q=${encodeURIComponent(trimmed)}"
      role="option"
      data-search-index="${limited.length}"
      class="mr-search-option block px-4 py-3 text-center text-sm font-bold text-[#B03D1F] bg-white/70 hover:bg-[#B03D1F] hover:text-white transition-colors border-t border-[#E5E7EB] no-underline"
    >
      Ver mais resultados para "${escapeHtml(trimmed)}" (${results.length})
    </a>
  `;

  return `${rows}${seeAll}`;
}

export function initHeaderSearch(): void {
  const desktopInput = document.getElementById('emr-input-search') as HTMLInputElement | null;
  const desktopForm = document.getElementById('mr-desktop-search-form') as HTMLFormElement | null;
  const desktopCloseBtn = document.getElementById('mr-desktop-search-close') as HTMLButtonElement | null;
  const desktopResults = document.getElementById('emr-search-results') as HTMLElement | null;
  const desktopOverlay = document.getElementById('mr-header-search-overlay') as HTMLElement | null;

  let activeIndex = -1;

  const closeDesktopSearch = () => {
    desktopResults?.classList.add('hidden');
    desktopOverlay?.classList.add('hidden');
    desktopCloseBtn?.classList.add('hidden');
    desktopInput?.classList.remove('rounded-t-[22px]', 'rounded-b-none');
    desktopInput?.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  };

  const openDesktopResults = async (query: string) => {
    if (!desktopResults || !desktopInput) return;
    const trimmed = query.trim();
    desktopCloseBtn?.classList.toggle('hidden', trimmed.length === 0);

    if (!trimmed) {
      desktopResults.innerHTML = '';
      desktopResults.classList.add('hidden');
      desktopOverlay?.classList.add('hidden');
      desktopInput.classList.remove('rounded-t-[22px]', 'rounded-b-none');
      desktopInput.setAttribute('aria-expanded', 'false');
      return;
    }

    const items = await loadSearchRecipes();
    const matches = searchRecipes(items, trimmed);
    desktopResults.innerHTML = renderResultsMarkup(matches, trimmed);
    desktopResults.classList.remove('hidden');
    desktopOverlay?.classList.remove('hidden');
    desktopInput.classList.add('rounded-t-[22px]', 'rounded-b-none');
    desktopInput.setAttribute('aria-expanded', 'true');
    activeIndex = -1;
  };

  if (desktopInput && desktopForm) {
    desktopInput.addEventListener('focus', () => {
      void loadSearchRecipes();
      if (desktopInput.value.trim().length > 0) {
        void openDesktopResults(desktopInput.value);
      }
    });

    desktopInput.addEventListener('input', () => {
      void openDesktopResults(desktopInput.value);
    });

    desktopInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDesktopSearch();
        desktopInput.blur();
        return;
      }

      const options = Array.from(
        desktopResults?.querySelectorAll<HTMLAnchorElement>('.mr-search-option') ?? []
      );
      if (options.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % options.length;
        options.forEach((opt, i) => {
          opt.classList.toggle('bg-[#C73E00]', i === activeIndex);
          opt.classList.toggle('text-white', i === activeIndex);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
        options.forEach((opt, i) => {
          opt.classList.toggle('bg-[#C73E00]', i === activeIndex);
          opt.classList.toggle('text-white', i === activeIndex);
        });
      } else if (e.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
        e.preventDefault();
        window.location.href = options[activeIndex].href;
      }
    });

    desktopForm.addEventListener('submit', (e) => {
      const q = desktopInput.value.trim();
      if (!q) {
        e.preventDefault();
        desktopInput.focus();
      }
    });

    desktopCloseBtn?.addEventListener('click', () => {
      desktopInput.value = '';
      closeDesktopSearch();
      desktopInput.focus();
    });

    desktopOverlay?.addEventListener('click', closeDesktopSearch);
    document.addEventListener('click', (e) => {
      const target = e.target as Node | null;
      if (target && !desktopForm.contains(target) && !desktopResults?.contains(target)) {
        closeDesktopSearch();
      }
    });
  }

  // Mobile Fullscreen Search Modal
  const mobileSearchTrigger = document.getElementById('header-search-bar');
  const mobileModal = document.getElementById('mr-mobile-search-modal');
  const mobileModalClose = document.getElementById('mr-mobile-search-close');
  const mobileModalInput = document.getElementById('mr-mobile-search-input') as HTMLInputElement | null;
  const mobileModalResults = document.getElementById('mr-mobile-search-results');

  const closeMobileSearch = () => {
    if (!mobileModal) return;
    mobileModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    mobileSearchTrigger?.focus();
  };

  mobileSearchTrigger?.addEventListener('click', () => {
    if (!mobileModal) return;
    mobileModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    void loadSearchRecipes();
    window.setTimeout(() => mobileModalInput?.focus(), 20);
  });

  mobileModalClose?.addEventListener('click', closeMobileSearch);

  mobileModalInput?.addEventListener('input', async () => {
    if (!mobileModalResults) return;
    const q = mobileModalInput.value.trim();
    if (!q) {
      mobileModalResults.innerHTML =
        '<p class="text-sm text-[#666666] px-2 py-4">Digite um prato, categoria ou ingrediente para buscar.</p>';
      return;
    }
    const items = await loadSearchRecipes();
    const matches = searchRecipes(items, q);
    mobileModalResults.innerHTML = renderResultsMarkup(matches, q);
  });

  mobileModal?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileSearch();
    }
  });
}
