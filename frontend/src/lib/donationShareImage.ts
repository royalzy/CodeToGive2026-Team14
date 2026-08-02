import type { CauseId } from "../api/client";

export type ShareImageOrientation = "vertical" | "horizontal";

const NAVY = "#223969";
const GOLD = "#ffd21c";
const CREAM = "#f6efe0";
const CREAM_LINE = "#d9c9a3";

export const causeStampImages: Record<CauseId, string> = {
  where_needed_most: "/images/donate-1.png",
  sports: "/images/sports-session.jpg",
  dance: "/images/crystal-performing.jpg",
  nutrition: "/images/donate-5.png",
  family_support: "/images/donate-3.png",
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
  align: "left" | "center" = "left",
): number {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;
  let cursorY = y;
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = words[i];
      lineCount += 1;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(i + 1).join(" ");
        lines.push(remaining ? `${line}…` : line);
        line = "";
        break;
      }
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  for (const textLine of lines) {
    const drawX = align === "center" ? x - ctx.measureText(textLine).width / 2 : x;
    ctx.fillText(textLine, drawX, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

async function loadCauseIllustration(causeId: CauseId): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(causeStampImages[causeId]);
  } catch {
    return null;
  }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const scale = Math.max(w / img.width, h / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

/** Draws a postage-style stamp bearing the cause illustration, perforated edges and all. */
function drawStamp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  rotationDeg: number,
): void {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.translate(-w / 2, -h / 2);

  ctx.save();
  ctx.shadowColor = "rgb(34 57 105 / 30%)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Perforated edge: round dashes drawn in the backdrop colour bite into the white rect.
  ctx.strokeStyle = CREAM;
  ctx.lineCap = "round";
  ctx.lineWidth = 15;
  ctx.setLineDash([0.001, 21]);
  ctx.strokeRect(0, 0, w, h);
  ctx.setLineDash([]);

  const inset = 16;
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
    ctx.clip();
    drawCoverImage(ctx, img, inset, inset, w - inset * 2, h - inset * 2);
    ctx.restore();
  } else {
    ctx.fillStyle = NAVY;
    ctx.fillRect(inset, inset, w - inset * 2, h - inset * 2);
  }

  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 3;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

  ctx.restore();
}

/** Draws a circular postmark with curved lettering, like a cancellation stamp. */
function drawPostmark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotationDeg: number,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.strokeStyle = "rgb(34 57 105 / 55%)";
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
  ctx.stroke();

  drawArcText(ctx, "LOVE 21 · THANK YOU ·", radius - 24, "700 15px Georgia, serif");

  ctx.beginPath();
  for (let i = 0; i < 7; i += 1) {
    const angle = Math.PI * 1.15 + i * 0.13;
    const x1 = Math.cos(angle) * (radius + 6);
    const y1 = Math.sin(angle) * (radius + 6);
    const x2 = Math.cos(angle) * (radius + 46);
    const y2 = Math.sin(angle) * (radius + 46);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draws text curving along the top of a circle centred on the current origin. */
function drawArcText(ctx: CanvasRenderingContext2D, text: string, radius: number, font: string): void {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = "rgb(34 57 105 / 70%)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalAngle = [...text].reduce((sum, char) => sum + ctx.measureText(char).width / radius, 0);
  ctx.rotate(-totalAngle / 2);

  for (const char of text) {
    const charAngle = ctx.measureText(char).width / radius;
    ctx.rotate(charAngle / 2);
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.translate(0, -radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    ctx.rotate(charAngle / 2);
  }
  ctx.restore();
}

/** Envelope-style backdrop: paper colour, flap crease lines, and a thin deckled border. */
function drawEnvelopeBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, width, height);

  const pad = Math.round(width * 0.035);
  const flapDepth = Math.round(height * 0.16);
  ctx.strokeStyle = CREAM_LINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(width / 2, pad + flapDepth);
  ctx.lineTo(width - pad, pad);
  ctx.stroke();

  roundRectPath(ctx, pad * 0.6, pad * 0.6, width - pad * 1.2, height - pad * 1.2, 22);
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawWaxSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
  const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  gradient.addColorStop(0, "#ffe487");
  gradient.addColorStop(1, GOLD);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = NAVY;
  ctx.font = `800 ${Math.round(radius * 0.7)}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("21", cx, cy + radius * 0.05);
  ctx.restore();
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  data: DonationShareData,
  illustration: HTMLImageElement | null,
): void {
  const width = 1080;
  const height = 1920;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  drawEnvelopeBackdrop(ctx, width, height);

  const stampW = 260;
  const stampH = 320;
  const stampX = width - 100 - stampW;
  const stampY = 130;
  drawStamp(ctx, illustration, stampX, stampY, stampW, stampH, 5);
  drawPostmark(ctx, stampX - 70, stampY + 90, 92, -12);

  const padX = 100;
  let cursorY = 420;
  ctx.textAlign = "left";
  ctx.fillStyle = NAVY;
  ctx.font = "italic 500 30px Georgia, serif";
  ctx.fillText(`To: The Love 21 family`, padX, cursorY);
  cursorY += 42;
  ctx.fillStyle = "rgb(34 57 105 / 65%)";
  ctx.font = "italic 500 26px Georgia, serif";
  ctx.fillText(`From: ${data.donorDisplayName || "A Love 21 supporter"}`, padX, cursorY);

  cursorY += 100;
  ctx.fillStyle = "#b8891a";
  ctx.font = "800 28px Arial, sans-serif";
  ctx.fillText("♥ THANK YOU FOR YOUR GIFT", padX, cursorY);

  cursorY += 74;
  ctx.fillStyle = NAVY;
  ctx.font = "700 52px Georgia, serif";
  cursorY = wrapText(ctx, data.headline, padX, cursorY, width - padX * 2, 62, 4);

  cursorY += 30;
  ctx.fillStyle = NAVY;
  ctx.font = "800 46px Georgia, serif";
  cursorY = wrapText(
    ctx,
    `HK$${data.amountHkd.toLocaleString("en-HK")} given`,
    padX,
    cursorY,
    width - padX * 2,
    56,
    1,
  );

  drawWaxSeal(ctx, width - 200, height - 210, 70);

  ctx.fillStyle = "rgb(34 57 105 / 70%)";
  ctx.font = "600 28px Arial, sans-serif";
  wrapText(
    ctx,
    "Join me → love21foundation.com/donate",
    padX,
    height - 230,
    width - padX * 2 - 200,
    36,
    2,
  );
}

function drawHorizontal(
  ctx: CanvasRenderingContext2D,
  data: DonationShareData,
  illustration: HTMLImageElement | null,
): void {
  const width = 1200;
  const height = 675;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  drawEnvelopeBackdrop(ctx, width, height);

  const stampW = 190;
  const stampH = 232;
  const stampX = width - 80 - stampW;
  const stampY = 70;
  drawStamp(ctx, illustration, stampX, stampY, stampW, stampH, 5);
  drawPostmark(ctx, stampX - 58, stampY + 66, 68, -12);

  const padX = 76;
  const contentWidth = width - padX * 2 - stampW - 60;
  let cursorY = 130;
  ctx.textAlign = "left";
  ctx.fillStyle = NAVY;
  ctx.font = "italic 500 22px Georgia, serif";
  ctx.fillText(`To: The Love 21 family`, padX, cursorY);
  cursorY += 32;
  ctx.fillStyle = "rgb(34 57 105 / 65%)";
  ctx.font = "italic 500 19px Georgia, serif";
  ctx.fillText(`From: ${data.donorDisplayName || "A Love 21 supporter"}`, padX, cursorY);

  cursorY += 56;
  ctx.fillStyle = "#b8891a";
  ctx.font = "800 20px Arial, sans-serif";
  ctx.fillText("♥ THANK YOU FOR YOUR GIFT", padX, cursorY);

  cursorY += 42;
  ctx.fillStyle = NAVY;
  ctx.font = "700 34px Georgia, serif";
  cursorY = wrapText(ctx, data.headline, padX, cursorY, contentWidth, 40, 3);

  cursorY += 18;
  ctx.fillStyle = NAVY;
  ctx.font = "800 30px Georgia, serif";
  cursorY = wrapText(
    ctx,
    `HK$${data.amountHkd.toLocaleString("en-HK")} given`,
    padX,
    cursorY,
    contentWidth,
    36,
    1,
  );

  drawWaxSeal(ctx, width - 130, height - 100, 46);

  ctx.fillStyle = "rgb(34 57 105 / 70%)";
  ctx.font = "600 19px Arial, sans-serif";
  wrapText(ctx, "Join me → love21foundation.com/donate", padX, height - 70, contentWidth - 80, 26, 2);
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
