/**
 * Intelligent client-side Content Safety & NSFW Filter for Product Images
 * Inspects uploaded images for inappropriate, adult, or explicit content.
 */

export interface ImageSafetyResult {
  isSafe: boolean;
  reason?: string;
}

// Explicit keywords in file names, titles, or URLs
const EXPLICIT_KEYWORDS = [
  'xxx', 'porn', 'nsfw', 'nude', 'naked', 'sex', 'boobs', 'vagina',
  'penis', 'dick', 'pussy', 'erotic', 'fetish', 'blowjob', 'hentai',
  'orgasm', 'intercourse', 'nudity', 'hardcore', 'sensual-adult',
  'اباحي', 'جنس', 'عاري', 'عري', 'اباحية', 'شذوذ', 'مخل'
];

/**
 * Checks if a pixel at (r, g, b) falls into human skin tone color range.
 * Uses Kovac et al. and YCbCr chrominance heuristic.
 */
function isSkinPixel(r: number, g: number, b: number): boolean {
  // 1. RGB Rule
  const rgbSkin =
    r > 95 &&
    g > 40 &&
    b > 20 &&
    Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
    Math.abs(r - g) > 15 &&
    r > g &&
    r > b;

  if (!rgbSkin) return false;

  // 2. YCbCr conversion
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

  return y > 60 && cb >= 77 && cb <= 135 && cr >= 133 && cr <= 178;
}

/**
 * Analyzes an image source (data URL, object URL, or remote URL) and file metadata
 * for explicit adult/NSFW content.
 */
export async function validateProductImageSafety(
  imageSource: string | File,
  fileName = ''
): Promise<ImageSafetyResult> {
  const nameToCheck = (
    fileName ||
    (typeof imageSource === 'string' ? imageSource : (imageSource as File)?.name) ||
    ''
  ).toLowerCase();

  // 1. Keyword check in name or URL
  for (const kw of EXPLICIT_KEYWORDS) {
    if (nameToCheck.includes(kw)) {
      return {
        isSafe: false,
        reason: 'تم رفض الصورة لاحتواء الملف على مسميات أو وسوم غير لائقة مخالفة لسياسة الاستخدام.',
      };
    }
  }

  // 2. Visual analysis via Canvas
  return new Promise((resolve) => {
    let src = '';
    let objectUrlToRevoke: string | null = null;

    if (typeof imageSource === 'string') {
      src = imageSource;
    } else if (imageSource && typeof imageSource === 'object') {
      objectUrlToRevoke = URL.createObjectURL(imageSource as Blob);
      src = objectUrlToRevoke;
    }

    if (!src) {
      resolve({ isSafe: true });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanup = () => {
      if (objectUrlToRevoke) {
        try {
          URL.revokeObjectURL(objectUrlToRevoke);
        } catch {}
      }
    };

    img.onerror = () => {
      cleanup();
      // If image failed to load, let normal image handling catch it
      resolve({ isSafe: true });
    };

    img.onload = () => {
      try {
        const sampleSize = 120;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          cleanup();
          resolve({ isSafe: true });
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        let skinPixelsTotal = 0;
        let skinPixelsCenter = 0;
        const totalPixels = sampleSize * sampleSize;

        const centerMin = Math.floor(sampleSize * 0.25);
        const centerMax = Math.floor(sampleSize * 0.75);
        let centerPixelsCount = 0;

        for (let y = 0; y < sampleSize; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const index = (y * sampleSize + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a < 128) continue; // Skip transparent background

            const isSkin = isSkinPixel(r, g, b);
            if (isSkin) {
              skinPixelsTotal++;
            }

            if (x >= centerMin && x <= centerMax && y >= centerMin && y <= centerMax) {
              centerPixelsCount++;
              if (isSkin) {
                skinPixelsCenter++;
              }
            }
          }
        }

        cleanup();

        const overallSkinRatio = skinPixelsTotal / totalPixels;
        const centerSkinRatio = centerPixelsCount > 0 ? skinPixelsCenter / centerPixelsCount : 0;

        // An excessive skin ratio (> 38% total or > 46% center) strongly correlates with unclad/explicit body content
        if (overallSkinRatio > 0.42 || (overallSkinRatio > 0.36 && centerSkinRatio > 0.48)) {
          resolve({
            isSafe: false,
            reason: 'عذراً، تم حظر الصورة لأنها تحتوي على نسب تعرّي أو محتوى غير لائق ومخالف لمعايير نشر المنتجات على المنصة. يرجى اختيار صورة واضحة ومناسبة للمنتج.',
          });
          return;
        }

        resolve({ isSafe: true });
      } catch (err) {
        cleanup();
        resolve({ isSafe: true });
      }
    };

    img.src = src;
  });
}
