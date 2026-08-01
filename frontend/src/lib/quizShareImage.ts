import type { QuizResult } from "../content/volunteerQuiz";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
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

export function generateQuizResultImage(result: QuizResult): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  gradient.addColorStop(0, "#e9003f");
  gradient.addColorStop(1, "#ffd21c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  ctx.beginPath();
  ctx.arc(CARD_WIDTH - 150, 90, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(90, CARD_HEIGHT - 60, 140, 0, Math.PI * 2);
  ctx.fill();

  const pad = 56;
  roundRect(ctx, pad, pad, CARD_WIDTH - pad * 2, CARD_HEIGHT - pad * 2, 32);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();

  const textX = pad + 56;
  let cursorY = pad + 76;

  ctx.fillStyle = "#e9003f";
  ctx.font = "800 20px Arial, sans-serif";
  ctx.fillText("LOVE 21 · WHAT TYPE OF VOLUNTEER ARE YOU?", textX, cursorY);

  cursorY += 64;
  ctx.fillStyle = "#171625";
  ctx.font = "900 52px Arial, sans-serif";
  ctx.fillText(result.archetype, textX, cursorY);

  cursorY += 46;
  ctx.fillStyle = "#1455c0";
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillText(`You are a "${result.title}"`, textX, cursorY);

  cursorY += 50;
  ctx.fillStyle = "#5e5b68";
  ctx.font = "400 22px Arial, sans-serif";
  cursorY = wrapText(ctx, result.personality, textX, cursorY, CARD_WIDTH - pad * 2 - 112, 32, 4);

  ctx.fillStyle = "#171625";
  ctx.font = "800 22px Arial, sans-serif";
  ctx.fillText("Take the quiz → love21.org/volunteer/match", textX, CARD_HEIGHT - pad - 30);

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
