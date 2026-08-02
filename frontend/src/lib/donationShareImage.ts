import type { CauseId } from "../api/client";

export type ShareImageOrientation = "vertical" | "horizontal";

const NAVY = "#223969";
const GOLD = "#ffd21c";

const causeImages: Record<CauseId, string> = {
  where_needed_most: "/images/donate-2.png",
  sports: "/images/sports-session.jpg",
  dance: "/images/crystal-performing.jpg",
  nutrition: "/images/donate-3.png",
  family_support: "/images/donate-4.png",
};

export interface DonationShareData {
  causeId: CauseId;
  amountHkd: number;
  headline: string;
  donorDisplayName: string;
}

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

async function loadCauseIllustration(causeId: CauseId): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(causeImages[causeId]);
  } catch {
    return null;
  }
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  data: DonationShareData,
  illustration: HTMLImageElement | null,
): void {
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
  ctx.fillText("LOVE 21 · MY DONATION", padX, cursorY);

  cursorY += 74;
  ctx.fillStyle = "white";
  ctx.font = "700 44px Arial, sans-serif";
  cursorY = wrapText(ctx, data.headline, padX, cursorY, width - padX * 2, 54, 4);

  cursorY += 34;
  ctx.fillStyle = GOLD;
  ctx.font = "800 40px Arial, sans-serif";
  cursorY = wrapText(
    ctx,
    `HK$${data.amountHkd.toLocaleString("en-HK")} given`,
    padX,
    cursorY,
    width - padX * 2,
    50,
    1,
  );

  cursorY += 34;
  ctx.fillStyle = "rgb(255 255 255 / 85%)";
  ctx.font = "600 30px Arial, sans-serif";
  wrapText(
    ctx,
    "Join me → https://love21foundation.com/donate",
    padX,
    cursorY,
    width - padX * 2,
    38,
    2,
  );
}

function drawHorizontal(
  ctx: CanvasRenderingContext2D,
  data: DonationShareData,
  illustration: HTMLImageElement | null,
): void {
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
  let cursorY = 120;
  ctx.fillStyle = GOLD;
  ctx.font = "800 20px Arial, sans-serif";
  cursorY = wrapText(ctx, "LOVE 21 · MY DONATION", padX, cursorY, panelTextWidth, 28, 2);

  cursorY += 28;
  ctx.fillStyle = "white";
  ctx.font = "700 32px Arial, sans-serif";
  cursorY = wrapText(ctx, data.headline, padX, cursorY, panelTextWidth, 40, 4);

  cursorY += 28;
  ctx.fillStyle = GOLD;
  ctx.font = "800 30px Arial, sans-serif";
  cursorY = wrapText(
    ctx,
    `HK$${data.amountHkd.toLocaleString("en-HK")} given`,
    padX,
    cursorY,
    panelTextWidth,
    36,
    1,
  );

  cursorY += 28;
  ctx.fillStyle = "rgb(255 255 255 / 85%)";
  ctx.font = "600 22px Arial, sans-serif";
  wrapText(
    ctx,
    "Join me → https://love21foundation.com/donate",
    padX,
    cursorY,
    panelTextWidth,
    30,
    3,
  );
}

export async function generateDonationShareImage(
  data: DonationShareData,
  orientation: ShareImageOrientation,
): Promise<string | null> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const illustration = await loadCauseIllustration(data.causeId);

  if (orientation === "vertical") {
    drawVertical(ctx, data, illustration);
  } else {
    drawHorizontal(ctx, data, illustration);
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
