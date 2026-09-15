// Browser-side image preparation for admin uploads (standing rule): decode →
// downscale to 1500px longest edge → WebP at 0.82, JPEG fallback when the
// browser can't encode WebP. Never upload the raw phone photo.
const MAX_EDGE = 1500;
const QUALITY = 0.82;

export class ImagePrepError extends Error {}

function isHeic(file: File) {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function prepareImage(file: File): Promise<{ blob: Blob; extension: "webp" | "jpg"; contentType: string }> {
  if (isHeic(file)) {
    throw new ImagePrepError("Las fotos HEIC del iPhone no se pueden subir. Expórtala como JPEG e inténtalo de nuevo.");
  }
  if (!file.type.startsWith("image/")) {
    throw new ImagePrepError("Ese archivo no es una imagen.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new ImagePrepError("No se pudo leer la imagen. Si es HEIC, expórtala como JPEG e inténtalo de nuevo.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImagePrepError("Tu navegador no pudo procesar la imagen.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, "image/webp");
  // Safari versions without WebP encoding silently return PNG instead.
  if (webp && webp.type === "image/webp") return { blob: webp, extension: "webp", contentType: "image/webp" };

  const jpeg = await canvasToBlob(canvas, "image/jpeg");
  if (!jpeg) throw new ImagePrepError("Tu navegador no pudo convertir la imagen.");
  return { blob: jpeg, extension: "jpg", contentType: "image/jpeg" };
}
