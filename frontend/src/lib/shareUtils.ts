export interface ShareableContent {
  url: string;
  title: string;
  text?: string;
}

function resolveUrl(url: string): string {
  return new URL(url, window.location.origin).toString();
}

export async function shareOrCopyLink(
  content: ShareableContent,
  announce: (message: string) => void,
) {
  const shareUrl = resolveUrl(content.url);

  if (navigator.share) {
    try {
      await navigator.share({ title: content.title, text: content.text, url: shareUrl });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    announce("Link copied to clipboard");
  } catch {
    announce("Couldn't copy the link");
  }
}

export async function copyLink(url: string, announce: (message: string) => void) {
  try {
    await navigator.clipboard.writeText(resolveUrl(url));
    announce("Link copied to clipboard");
  } catch {
    announce("Couldn't copy the link");
  }
}

export async function copyDetails(content: ShareableContent, announce: (message: string) => void) {
  const parts = [content.title, content.text, resolveUrl(content.url)].filter(Boolean);
  try {
    await navigator.clipboard.writeText(parts.join("\n\n"));
    announce("Details copied to clipboard");
  } catch {
    announce("Couldn't copy the details");
  }
}
