/**
 * No Firebase Storage (that needs the paid Blaze plan) — instead resize the
 * image client-side and store it as a base64 data URL directly in the
 * Firestore document. Keeps everything on the free Spark plan.
 * Firestore caps a document at 1 MiB, so we keep images well under that.
 */
export async function uploadProjectImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 1000;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
}
