// Browser-side image preparation for admin uploads (standing rule): decode →
// crop to the slot's fixed ratio (framed by the admin) → downscale to 1500px
// longest edge → WebP at 0.82, JPEG fallback when the browser can't encode
// WebP. Never upload the raw phone photo.
const MAX_EDGE = 1500;
const QUALITY = 0.82;

// One ratio per use case. The public containers and the admin previews use
// the same class, so what the admin frames is exactly what the site shows.
export const IMAGE_RATIOS = {
  // Hero and about photos (people).
  portrait: { w: 4, h: 5, label: "4:5", className: "aspect-[4/5]" },
  // Portfolio cover and gallery.
  landscape: { w: 16, h: 9, label: "16:9", className: "aspect-video" },
} as const;

export type ImageRatio = keyof typeof IMAGE_RATIOS;

// Crop rectangle in source-image pixels.
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ImagePrepError extends Error {}

function isHeic(file: File) {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function decodeImage(file: File): Promise<ImageBitmap> {
  if (isHeic(file)) {
    throw new ImagePrepError("Las fotos HEIC del iPhone no se pueden subir. Expórtala como JPEG e inténtalo de nuevo.");
  }
  if (!file.type.startsWith("image/")) {
    throw new ImagePrepError("Ese archivo no es una imagen.");
  }
  try {
    return await createImageBitmap(file);
  } catch {
    throw new ImagePrepError("No se pudo leer la imagen. Si es HEIC, expórtala como JPEG e inténtalo de nuevo.");
  }
}

export async function prepareImage(
  bitmap: ImageBitmap,
  crop: CropRect,
): Promise<{ blob: Blob; extension: "webp" | "jpg"; contentType: string }> {
  const scale = Math.min(1, MAX_EDGE / Math.max(crop.width, crop.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.width * scale);
  canvas.height = Math.round(crop.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImagePrepError("Tu navegador no pudo procesar la imagen.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

  const webp = await canvasToBlob(canvas, "image/webp");
  // Safari versions without WebP encoding silently return PNG instead.
  if (webp && webp.type === "image/webp") return { blob: webp, extension: "webp", contentType: "image/webp" };

  const jpeg = await canvasToBlob(canvas, "image/jpeg");
  if (!jpeg) throw new ImagePrepError("Tu navegador no pudo convertir la imagen.");
  return { blob: jpeg, extension: "jpg", contentType: "image/jpeg" };
}
