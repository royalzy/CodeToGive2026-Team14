import { type MouseEvent, useEffect, useRef, useState } from "react";

export interface CardMenuItem {
  key: string;
  label: string;
  onSelect: (announce: (message: string) => void) => void | Promise<void>;
}

export function CardOptionsMenu({
  label,
  items,
}: {
  label: string;
  items: CardMenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  function toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setOpen((current) => !current);
    setToast(null);
  }

  async function handleSelect(item: CardMenuItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    await item.onSelect((message) => {
      setToast(message);
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => {
        setOpen(false);
        setToast(null);
      }, 1400);
    });
  }

  return (
    <div className="card-options-menu" ref={containerRef}>
      <button
        type="button"
        className="card-options-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
      >
        <span aria-hidden="true">⋮</span>
      </button>
      {open && (
        <div className="card-options-panel" role="menu">
          {toast ? (
            <p className="card-options-toast" role="status">
              {toast}
            </p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(event) => handleSelect(item, event)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
