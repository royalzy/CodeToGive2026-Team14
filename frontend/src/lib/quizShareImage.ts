import type { QuizResult } from "../content/volunteerQuiz";

export type ShareImageOrientation = "vertical" | "horizontal";

const NAVY = "#223969";
const GOLD = "#ffd21c";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;
  let cursorY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = words[i];
      cursorY += lineHeight;
      lineCount += 1;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(i + 1).join(" ");
        const truncated = remaining ? `${line}…` : line;
        ctx.fillText(truncated, x, cursorY);
        return cursorY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, cursorY);
  return cursorY + lineHeight;
}

async function loadIllustration(result: QuizResult): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(result.image);
  } catch {
    return null;
  }
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  result: QuizResult,
  illustration: HTMLImageElement | null,
): { width: number; height: number } {
  // Instagram Story ratio (9:16).
  const width = 1080;
  const height = 1920;
  const imageHeight = illustration
    ? Math.round((width / illustration.width) * illustration.height)
    : 1150;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, width, height);
  if (illustration) {
    ctx.drawImage(illustration, 0, 0, width, imageHeight);
  }

  const padX = 80;
  let cursorY = imageHeight + 170;
  ctx.fillStyle = GOLD;
  ctx.font = "800 28px Arial, sans-serif";
  ctx.fillText("LOVE 21 · WHAT TYPE OF VOLUNTEER ARE YOU?", padX, cursorY);

  cursorY += 74;
  ctx.fillStyle = "white";
  ctx.font = "700 44px Arial, sans-serif";
  cursorY = wrapText(ctx, `You are a "${result.title}"`, padX, cursorY, width - padX * 2, 54, 3);

  cursorY += 34;
  ctx.fillStyle = "rgb(255 255 255 / 85%)";
  ctx.font = "600 30px Arial, sans-serif";
  wrapText(
    ctx,
    "Take the quiz → https://love21foundation.com/volunteer/match",
    padX,
    cursorY,
    width - padX * 2,
    38,
    2,
  );

  return { width, height };
}

function drawHorizontal(
  ctx: CanvasRenderingContext2D,
  result: QuizResult,
  illustration: HTMLImageElement | null,
): { width: number; height: number } {
  const height = 630;
  const imageWidth = illustration
    ? Math.round((height / illustration.height) * illustration.width)
    : 592;
  const panelWidth = 560;
  const width = imageWidth + panelWidth;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, width, height);
  if (illustration) {
    ctx.drawImage(illustration, 0, 0, imageWidth, height);
  }

  const padX = imageWidth + 56;
  const panelTextWidth = panelWidth - 96;
  let cursorY = 130;
  ctx.fillStyle = GOLD;
  ctx.font = "800 20px Arial, sans-serif";
  cursorY = wrapText(
    ctx,
    "LOVE 21 · WHAT TYPE OF VOLUNTEER ARE YOU?",
    padX,
    cursorY,
    panelTextWidth,
    28,
    3,
  );

  cursorY += 30;
  ctx.fillStyle = "white";
  ctx.font = "700 32px Arial, sans-serif";
  cursorY = wrapText(ctx, `You are a "${result.title}"`, padX, cursorY, panelTextWidth, 40, 4);

  cursorY += 32;
  ctx.fillStyle = "rgb(255 255 255 / 85%)";
  ctx.font = "600 22px Arial, sans-serif";
  wrapText(
    ctx,
    "Take the quiz → https://love21foundation.com/volunteer/match",
    padX,
    cursorY,
    panelTextWidth,
    30,
    3,
  );

  return { width, height };
}

export async function generateQuizResultImage(
  result: QuizResult,
  orientation: ShareImageOrientation,
): Promise<string | null> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const illustration = await loadIllustration(result);

  if (orientation === "vertical") {
    drawVertical(ctx, result, illustration);
  } else {
    drawHorizontal(ctx, result, illustration);
  }

  return canvas.toDataURL("image/png");
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}
