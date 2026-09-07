/**
 * Store Identity Helper
 * Dynamically updates document.title and browser tab favicon
 * to match the merchant's custom store identity (Name & Logo)
 */

const DEFAULT_TITLE = 'الزعيم — منصة الشحن والتجارة الإلكترونية في العراق';
const DEFAULT_FAVICON = '/favicon.png';

function applyFaviconLink(iconUrl: string) {
  if (typeof document === 'undefined' || !iconUrl) return;
  try {
    // 1. Remove existing favicon links to force browser to repaint immediately
    const existing = document.querySelectorAll("link[rel*='icon']");
    existing.forEach((el) => el.remove());

    // 2. Add new standard favicon link
    const link = document.createElement('link');
    link.type = iconUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png';
    link.rel = 'icon';
    link.href = iconUrl;
    document.head.appendChild(link);

    // 3. Add Apple touch icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = iconUrl;
    document.head.appendChild(appleLink);
  } catch (err) {
    console.warn('[StoreIdentity] Failed to apply favicon:', err);
  }
}

function generateInitialFavicon(name: string): string {
  const initial = (name || 'م').trim().charAt(0);
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f766e"/><stop offset="100%" stop-color="%23042f2e"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g)"/><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="50" fill="%23ffffff">${encodeURIComponent(initial)}</text></svg>`;
}

export function setStoreFavicon(logoUrl?: string, storeName?: string) {
  if (typeof document === 'undefined') return;

  if (logoUrl && logoUrl.trim()) {
    const cleanLogo = logoUrl.trim();

    // Use Canvas to square-crop and round corners into a clean 64x64 PNG favicon
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 64, 64);

          // Draw rounded rectangle background
          const radius = 14;
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(64 - radius, 0);
          ctx.quadraticCurveTo(64, 0, 64, radius);
          ctx.lineTo(64, 64 - radius);
          ctx.quadraticCurveTo(64, 64, 64 - radius, 64);
          ctx.lineTo(radius, 64);
          ctx.quadraticCurveTo(0, 64, 0, 64 - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.clip();

          // White base background so transparent or dark logos are always legible
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Draw scaled image centered
          ctx.drawImage(img, 0, 0, 64, 64);

          applyFaviconLink(canvas.toDataURL('image/png'));
          return;
        }
      } catch {
        // Fallback to direct URL if canvas fails
      }
      applyFaviconLink(cleanLogo);
    };

    img.onerror = () => {
      applyFaviconLink(generateInitialFavicon(storeName || ''));
    };

    img.src = cleanLogo;
  } else {
    applyFaviconLink(generateInitialFavicon(storeName || ''));
  }
}

/**
 * Sets document title and favicon to match store
 */
export function setStoreDocumentIdentity(storeName?: string, logoUrl?: string) {
  if (typeof document === 'undefined') return;

  if (storeName && storeName.trim()) {
    const cleanName = storeName.trim();
    document.title = `${cleanName} — المتجر الرسمي`;
  }

  setStoreFavicon(logoUrl, storeName);
}

/**
 * Restores document title and favicon to platform defaults
 */
export function restoreDefaultDocumentIdentity() {
  if (typeof document === 'undefined') return;
  document.title = DEFAULT_TITLE;
  applyFaviconLink(DEFAULT_FAVICON);
}
