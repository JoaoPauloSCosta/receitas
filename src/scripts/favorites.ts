import { showToast } from './toast';

const STORAGE_KEY = 'mr_favorites_v1';

export function getFavoriteIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

export function syncFavoriteUI(): void {
  const favSet = new Set(getFavoriteIds());

  document.querySelectorAll<HTMLButtonElement>('.emr-favorite-btn[data-recipe-id]').forEach((btn) => {
    const id = btn.dataset.recipeId;
    if (!id) return;
    const title = btn.dataset.recipeTitle || 'receita';
    const active = favSet.has(id);
    btn.classList.toggle('favorited', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      active ? `Remover ${title} das favoritas` : `Favoritar ${title}`
    );
    btn.title = active ? 'Remover das favoritas' : 'Salvar nas favoritas';
  });

  document.querySelectorAll<HTMLElement>('[data-fav-count]').forEach((badge) => {
    const count = favSet.size;
    badge.textContent = String(count);
    badge.classList.toggle('hidden', count === 0);
  });
}

export function toggleFavorite(id: string, title?: string): boolean {
  const current = getFavoriteIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  saveFavoriteIds(next);
  syncFavoriteUI();

  document.dispatchEvent(
    new CustomEvent('mr:favorites-changed', {
      detail: { ids: next, id, added: !exists },
    })
  );

  if (!exists) {
    showToast({
      type: 'success',
      message: title
        ? `"${title}" salva nas suas receitas favoritas!`
        : 'Receita salva nas suas favoritas!',
    });
  } else {
    showToast({
      type: 'info',
      message: title
        ? `"${title}" removida das favoritas.`
        : 'Receita removida das favoritas.',
    });
  }

  return !exists;
}

export function initFavorites(): void {
  syncFavoriteUI();

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const btn = target?.closest<HTMLButtonElement>('.emr-favorite-btn[data-recipe-id]');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const id = btn.dataset.recipeId;
    if (!id) return;
    toggleFavorite(id, btn.dataset.recipeTitle);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      syncFavoriteUI();
      document.dispatchEvent(
        new CustomEvent('mr:favorites-changed', {
          detail: { ids: getFavoriteIds() },
        })
      );
    }
  });
}
