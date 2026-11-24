export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
}

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
};

const ICON_COLORS: Record<ToastType, string> = {
  success: '#2E8555',
  error: '#D92D20',
  warning: '#B45309',
  info: '#CE5032',
};

function getIconSvg(type: ToastType): string {
  const color = ICON_COLORS[type];
  if (type === 'success') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:${color};flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if (type === 'error') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:${color};flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  if (type === 'warning') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:${color};flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:${color};flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function getContainer(): HTMLElement {
  let container = document.getElementById('mr-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mr-toast-container';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast({ type = 'info', message, duration }: ToastOptions): void {
  const container = getContainer();

  while (container.children.length >= 3) {
    container.firstElementChild?.remove();
  }

  const toast = document.createElement('div');
  toast.className = `mr-toast mr-toast--${type}`;
  const isUrgent = type === 'error' || type === 'warning';
  toast.setAttribute('role', isUrgent ? 'alert' : 'status');
  toast.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');

  const iconWrapper = document.createElement('span');
  iconWrapper.innerHTML = getIconSvg(type);

  const textEl = document.createElement('p');
  textEl.className = 'flex-1 m-0';
  textEl.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className =
    'inline-flex items-center justify-center w-8 h-8 -mr-1 -mt-1 rounded-full shrink-0 hover:bg-black/5 transition-colors cursor-pointer';
  closeBtn.setAttribute('aria-label', 'Fechar notificação');
  closeBtn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  toast.append(iconWrapper, textEl, closeBtn);
  container.appendChild(toast);

  const totalDuration = duration ?? DEFAULT_DURATIONS[type];
  let remaining = totalDuration;
  let timerId: number | undefined;
  let startedAt = Date.now();

  const removeToast = () => {
    if (timerId !== undefined) window.clearTimeout(timerId);
    toast.remove();
  };

  const startTimer = () => {
    startedAt = Date.now();
    timerId = window.setTimeout(removeToast, remaining);
  };

  const pauseTimer = () => {
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      timerId = undefined;
      remaining = Math.max(200, remaining - (Date.now() - startedAt));
    }
  };

  closeBtn.addEventListener('click', removeToast);
  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', startTimer);
  toast.addEventListener('focusin', pauseTimer);
  toast.addEventListener('focusout', startTimer);

  startTimer();
}

export function initToastBridge(): void {
  (window as Window & { mrShowToast?: typeof showToast }).mrShowToast = showToast;
  document.addEventListener('mr:toast', (event) => {
    const detail = (event as CustomEvent<ToastOptions>).detail;
    if (detail?.message) {
      showToast(detail);
    }
  });
}
